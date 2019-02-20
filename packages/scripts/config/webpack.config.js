/**
 * External dependencies
 */
const { BundleAnalyzerPlugin } = require( 'webpack-bundle-analyzer' );
const LiveReloadPlugin = require( 'webpack-livereload-plugin' );
const path = require( 'path' );

/**
 * Internal dependencies
 */
const { camelCaseDash } = require( '../utils' );

/**
 * Converts @wordpress/* string request into request object.
 *
 * Note this isn't the same as camel case because of the
 * way that numbers don't trigger the capitalized next letter.
 *
 * @example
 * formatRequest( '@wordpress/api-fetch' );
 * // { this: [ 'wp', 'apiFetch' ] }
 * formatRequest( '@wordpress/i18n' );
 * // { this: [ 'wp', 'i18n' ] }
 *
 * @param {string} request Request name from import statement.
 * @return {Object} Request object formatted for further processing.
 */
const formatRequest = ( request ) => {
	// '@wordpress/api-fetch' -> [ '@wordpress', 'api-fetch' ]
	const [ , name ] = request.split( '/' );

	// { this: [ 'wp', 'apiFetch' ] }
	return {
		this: [ 'wp', camelCaseDash( name ) ],
	};
};

const wordpressExternals = ( context, request, callback ) => {
	if ( /^@wordpress\//.test( request ) ) {
		callback( null, formatRequest( request ), 'this' );
	} else {
		callback();
	}
};

const externals = [
	{
		react: 'React',
		'react-dom': 'ReactDOM',
		tinymce: 'tinymce',
		moment: 'moment',
		jquery: 'jQuery',
		lodash: 'lodash',
		'lodash-es': 'lodash',
	},
	wordpressExternals,
];

const isProduction = process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';

const config = {
	mode,
	entry: {
		index: path.resolve( process.cwd(), 'src', 'index.js' ),
	},
	output: {
		filename: '[name].js',
		path: path.resolve( process.cwd(), 'build' ),
	},
	externals,
	resolve: {
		alias: {
			'lodash-es': 'lodash',
		},
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: require.resolve( 'source-map-loader' ),
				enforce: 'pre',
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: require.resolve( 'babel-loader' ),
			},
		],
	},
	plugins: [
		// WP_BUNDLE_ANALYZER global variable enables utility that represents bundle content
		// as convenient interactive zoomable treemap.
		process.env.WP_BUNDLE_ANALYZER && new BundleAnalyzerPlugin(),
		// WP_LIVE_RELOAD_PORT global variable changes port on which live reload works
		// when running watch mode.
		! isProduction && new LiveReloadPlugin( { port: process.env.WP_LIVE_RELOAD_PORT || 35729 } ),
	].filter( Boolean ),
	stats: {
		children: false,
	},
};

if ( ! isProduction ) {
	// WP_DEVTOOL global variable controls how source maps are generated.
	// See: https://webpack.js.org/configuration/devtool/#devtool.
	config.devtool = process.env.WP_DEVTOOL || 'source-map';
}

module.exports = config;
