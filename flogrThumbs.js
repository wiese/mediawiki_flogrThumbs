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
	};
	var collection = type + escape(value);
	jQuery(element).show().addClass('initialized loading');
	jQuery.get('/extensions/flogr/', queryData[type], function(data) {
		var pictures = data.match(/.*<div id=['"]thumbnail_container['"]>([\s\S]+?)<\/div>.*/i)[1];
		var title = data.match(/.*<span id=['"]page_title['"]>([\s\S]+?)<\/span>.*/i)[1];
		var count = pictures.match(/<img /ig).length;
												jQuery(element).removeClass('loading').html(						'<div class="thumbs">' + pictures + '</div>' +
			'<strong>' + title + '</strong>' +
			'(' + count  + ')'							);
												jQuery('a', element).attr('rel', 'lightbox[' + collection + ']');
		jQuery('a', element).lightBox(lightboxOptions);
												// find flickr hosted (teaser) images present in page body (too easy?)
		// issue: flickr using different domains (static.flickr.com, staticflickr.com)
		var picFromFlickrRule = 'img[src*="flickr\\.com\\/"][src$="\\.jpg"]'
		jQuery('#bodyContent p ' + picFromFlickrRule).each(function() {
			var insiteThumb = jQuery(this);
			var picId = insiteThumb.attr('src').match(/\/(\d{10})_.+?\.jpg$/i)[1];
			if (picId != parseInt(picId)) {
				return true;	// give up on this, but go on to next item;
			}
													// find respective thumb in just received list of thumbs
			jQuery(picFromFlickrRule + '[src*="/' + picId + '_"]', element).each(function() {
				var link = jQuery(this).parent('a').get(0);	// get its link
				var newLink = jQuery(link).clone(true).empty().get(0);
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

