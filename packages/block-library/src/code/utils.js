/**
 * External dependencies
 */
import { flow } from 'lodash';

/**
 * Escapes ampersands, shortcodes, and links.
 *
 * @param {string} content The content of a code block.
 * @return {string} The given content with some characters escaped.
 */
export function escape( content ) {
	return flow(
		escapeAmpersands,
		escapeTagDelimiters,
		escapeOpeningSquareBrackets,
		escapeProtocolInIsolatedUrls
	)( content || '' );
}

/**
 * Unescapes escaped ampersands, shortcodes, and links.
 *
 * @param {string} content Content with (maybe) escaped ampersands, shortcodes, and links.
 * @return {string} The given content with escaped characters unescaped.
 */
export function unescape( content ) {
	return flow(
		unescapeProtocolInIsolatedUrls,
		unescapeOpeningSquareBrackets,
		unescapeTagDelimiters,
		unescapeAmpersands
	)( content || '' );
}

/**
 * Returns the given content with all its ampersand characters converted
 * into their HTML entity counterpart (i.e. & => &amp;)
 *
 * @param {string}  content The content of a code block.
 * @return {string} The given content with its ampersands converted into
 *                  their HTML entity counterpart (i.e. & => &amp;)
 */
function escapeAmpersands( content ) {
	return content.replace( /&/g, '&amp;' );
}

/**
 * Returns the given content with all &amp; HTML entities converted into &.
 *
 * @param {string}  content The content of a code block.
 * @return {string} The given content with all &amp; HTML entities
 *                  converted into &.
 */
function unescapeAmpersands( content ) {
	return content.replace( /&amp;/g, '&' );
}

/**
 * Returns the given content with all < and > characters converted into
 * their HTML entity counterparts: &lt; and &gt;
 *
 * @param {string}  content The content of a code block.
 * @return {string} The given content with all < and > characters converted
 *                  into their HTML entity counterparts: &lt; and &gt;
 */
function escapeTagDelimiters( content ) {
	return content.replace( /</g, '&lt;' ).replace( />/g, '&gt;' );
}

/**
 * Returns the given content with all &lt; and &gt; HTML entities converted
 * into < and >, respectively.
 *
 * @param {string}  content The content of a code block.
 * @return {string} The given content with all &lt; and &gt; HTML entities
 *                  converted into < and >, respectively
 */
function unescapeTagDelimiters( content ) {
	return content.replace( /&lt;/g, '<' ).replace( /&gt;/g, '>' );
}

/**
 * Returns the given content with all opening shortcode characters converted
 * into their HTML entity counterpart (i.e. [ => &#91;). For instance, a
 * shortcode like [embed] becomes &#91;embed]
 *
 * This function replicates the escaping of HTML tags, where a tag like
 * <strong> becomes &lt;strong>.
 *
 * @param {string}  content The content of a code block.
 * @return {string} The given content with its opening shortcode characters
 *                  converted into their HTML entity counterpart
 *                  (i.e. [ => &#91;)
 */
function escapeOpeningSquareBrackets( content ) {
	return content.replace( /\[/g, '&#91;' );
}

/**
 * Returns the given content translating all &#91; into [.
 *
 * @param {string}  content The content of a code block.
 * @return {string} The given content with all &#91; into [.
 */
function unescapeOpeningSquareBrackets( content ) {
	return content.replace( /&#91;/g, '[' );
}

/**
 * Converts the first two forward slashes of any isolated URL into their HTML
 * counterparts (i.e. // => &#47;&#47;). For instance, https://youtube.com/watch?x
 * becomes https:&#47;&#47;youtube.com/watch?x.
 *
 * An isolated URL is a URL that sits in its own line, surrounded only by spacing
 * characters.
 *
 * See https://github.com/WordPress/wordpress-develop/blob/5.1.1/src/wp-includes/class-wp-embed.php#L403
 *
 * @param {string}  content The content of a code block.
 * @return {string} The given content with its ampersands converted into
 *                  their HTML entity counterpart (i.e. & => &amp;)
 */
function escapeProtocolInIsolatedUrls( content ) {
	return content.replace( /^(\s*https?:)\/\/([^\s<>"]+\s*)$/m, '$1&#47;&#47;$2' );
}

/**
 * Converts the first two forward slashes of any isolated URL from the HTML entity
 * &#73; into /.
 *
 * An isolated URL is a URL that sits in its own line, surrounded only by spacing
 * characters.
 *
 * See https://github.com/WordPress/wordpress-develop/blob/5.1.1/src/wp-includes/class-wp-embed.php#L403
 *
 * @param {string}  content The content of a code block.
 * @return {string} The given content with the first two forward slashes of any
 *                  isolated URL from the HTML entity &#73; into /.
 */
function unescapeProtocolInIsolatedUrls( content ) {
	return content.replace( /^(\s*https?:)&#47;&#47;([^\s<>"]+\s*)$/m, '$1//$2' );
}
