(function() {
	var settings, wrapper, saveInterval;

	$(document).ready(function() {
		require(['settings','uploader'], function(_settings,uploader) {
			settings = _settings;

			wrapper = $('#newsForm');


            wrapper.find(('#save')).click(function(event) {
                event.preventDefault();
                //save();
                var title = $('#title').val();
                var content = $('#description').val();

                $.post('/api/admin/news/add', {
                    _csrf : $('#csrf_token').val(),
                    title : title,
                    content : content
                },  function(data) {
                    if(typeof data === 'string') {
                        location.reload();
                    }
                });
            });


            $('.remove').click(function(event) {
                event.preventDefault();
                //save();
                var newsRow = $(this).parents('li[data-cid]');
                var	cid = newsRow.attr('data-cid')/*.replace(/news:/g,"")*/;

                $.post('/api/admin/news/remove', {
                    _csrf : $('#csrf_token').val(),
                    cid : cid
                }, function(data) {
                    if(typeof data === 'string') {
                        location.reload();
                    }
                });
            });


		});
	});




}());