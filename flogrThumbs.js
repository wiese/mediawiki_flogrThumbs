
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
