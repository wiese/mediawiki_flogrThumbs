/**
 * flogrThumbs - flogr's thumbnails and browseable lightbox inside your website
 *
 * @requires jQuery
 *
 * @example flogrThumbs(myDiv, 'set', '1234567890');
 * @example flogrThumbs(jQuery('my_cat_pics'), 'tag', 'kitten');
 *
 * @param Object element The dom element to fill with thumbnails
 * @param string type    The type of collection to show ("set" or "tag")
 * @param string value   A unique identifyer of the collection (set id, or a tag)
 *
 * @return void
 */
function flogrThumbs(element, type, value) {
	var queryData = {	// build all, pick the right one
		set: { type: 'sets', 'setId': value },
		tag: { type: 'recent', 'tags': value }
	},
	element = jQuery(element);

	element.show().addClass('initialized loading');

	jQuery.get('/extensions/flogr/', queryData[type], function(data) {
		var html = jQuery.parseHTML(data),
			pictures = jQuery('div#thumbnail_container', html).get(0).innerHTML,
			title = jQuery('span#page_title', html).text();
			count = jQuery('img', pictures).length;

		if (jQuery.trim(pictures) === '') { // no usable content found
			element.hide();
			return false;
		}

		element.removeClass('loading').html(
			'<div class="thumbs">' + pictures + '</div>' +
			'<strong>' + title + '</strong>' +
			'(' + count  + ')'
		);
		jQuery('a', element)
			.attr('rel', 'lightbox[' + type + escape(value) + ']')
			.lightBox(lightboxOptions);

		// find flickr hosted (teaser) images present in page body (too easy?)
		// issue: flickr using different domains (static.flickr.com, staticflickr.com)
		var picFromFlickrRule = 'img[src*="flickr\\.com\\/"][src$="\\.jpg"]'
		jQuery('#bodyContent p ' + picFromFlickrRule).each(function() {
			var insiteThumb = jQuery(this),
				picId = insiteThumb.attr('src').match(/\/(\d{10})_.+?\.jpg$/i)[1];
			if (picId != parseInt(picId)) {
				return true;	// give up on this, but go on to next item
			}
			// find respective thumb in just received list of thumbs
			jQuery(picFromFlickrRule + '[src*="/' + picId + '_"]', element).each(function() {
				var link = jQuery(this).parent('a').get(0),	// get its link
					newLink = jQuery(link).clone(true).empty().get(0);
				insiteThumb.wrap(newLink);	// make thumb in body have same link
			});
		});
	});
}

jQuery(document).ready(function() {
	jQuery('.flogrthumbs').each(function(index, element) {
		flogrThumbs(element, jQuery(element).data('flogr-type'), jQuery(element).data('flogr-value'));
	});
});
