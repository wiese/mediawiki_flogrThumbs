/**
 * flogrThumbs - flogr's thumbnails and browseable lightbox inside your website
 *
 * @requires jQuery
 *
 * @example flogrThumbs('my_picture_set', 'set', '1234567890');
 * @example flogrThumbs('all_my_cat_pics', 'tag', 'cat');
 *
 * @param string domId The id of the dom element (the container)
 * @param string type  The type of collection to show (e.g. "set", "tag")
 * @param string value A unique identifyer of the collection (set id, or a tag)
 *
 * @return void
 */
function flogrThumbs(domId, type, value) {
	var id = '#' + domId;	// jQuery syntax
	var queryData = {	// build all, pick the right one
		set: { type: 'sets', 'setId': value },
		tag: { type: 'recent', 'tags': value }
	};
	var collection = type + escape(value);
	jQuery(id).show().addClass('initialized loading');
	jQuery.get('/extensions/flogr/', queryData[type], function(data) {
		var pictures = data.match(/.*<div id=['"]thumbnail_container['"]>([\s\S]+?)<\/div>.*/i)[1];
		var title = data.match(/.*<span id=['"]page_title['"]>([\s\S]+?)<\/span>.*/i)[1];
		var count = pictures.match(/<img /ig).length;
		jQuery(id).removeClass('loading').html(
			'<div class="thumbs">' + pictures + '</div>' +
				'<strong>' + title + '</strong>' +
				'(' + count  + ' Fotos)'
		);
		jQuery(id + ' a').attr('rel', 'lightbox[' + collection + ']');
		jQuery(id + ' a').lightBox(lightboxOptions);
	});
}
