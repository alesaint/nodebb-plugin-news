(function() {
	var settings, wrapper, saveInterval, catId;

	$(document).ready(function() {
		require(['settings','uploader'], function(_settings,uploader) {
			settings = _settings;

			wrapper = $('#newsForm');


            var defaultCategory = $('#catId').val();

            $('#categoryNewsId option[value='+defaultCategory+']').prop('selected', true);
            catId = parseInt($('#categoryNewsId').val(),10);



            wrapper.find(('#save')).click(function(event) {
                event.preventDefault();
                //save();
                var title = $('#title').val();
                var content = $('#description').val().replace(/\n/g,"<br/>");

                var csrf = $('#csrf_token').val();

                $.post('/api/admin/news/add', {
                    _csrf : csrf,
                    title : title,
                    content : content
                },  function(news) {




                    uploader.open('/admin/news/uploadImage', {cid: news.sid}, 0, function(imageUrlOnServer) {

                            var action = 'topics.post';
                            composerData = {
                                title: title,
                                content: '<img src="' + imageUrlOnServer+'"/><br/>'+content,
                                topic_thumb: imageUrlOnServer,
                                category_id: catId,
                                tags: [],
                                news:news
                            };

                            socket.emit(action, composerData, function(err, topic) {
                                $.post('/api/admin/news/addTopic', {
                                    _csrf: csrf,
                                    topicId: topic.tid,
                                    sid: news.sid
                                }, function(){
                                    location.reload();
                                })

                            })
                            //

                    })
                });
            });


            $('.remove').click(function(event) {
                event.preventDefault();
                //save();
                var newsRow = $(this).parents('li[data-cid]');
                var	cid = newsRow.attr('data-cid');

                var	tid = newsRow.children('input[data-tid]').attr('data-tid');

                socket.emit("topics.delete", {tids: [tid], cid: catId}, function (err, topic) {

                });

                $.post('/api/admin/news/remove', {
                    _csrf : $('#csrf_token').val(),
                    cid : cid
                }, function(data) {
                    location.reload();
                });

            });

            $('#categoryNewsId').change(function(event) {
                event.preventDefault();
                //save();
                var cid = $('#categoryNewsId').val();

                $.post('/api/admin/news/addCategoryForNews', {
                    _csrf : $('#csrf_token').val(),
                    cid : cid
                }, function(data) {

                });

            });




		});
	});




}());