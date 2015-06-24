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
                        console.log(imageUrlOnServer);
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


            wrapper.find(('#edit')).click(function(event) {
                event.preventDefault();
                //save();
                var title = $('#title').val();
                var content = $('#description').val().replace(/\n/g,"<br/>");

                var csrf = $('#csrf_token').val();
                var img = $('#hiddenNewsImg').val();
                var sid = $('#hiddenNewsId').val();
                var tid = $('#hiddenTopicId').val();


                $.post('/api/admin/news/edit', {
                    _csrf : csrf,
                    title : title,
                    content : content,
                    contentPost: "<img src='"+img+"'/><br/>" + content,
                    sid: sid,
                    tid: tid,
                    topicThumb: img
                },  function(news) {
                    location.reload();

                });
            });



            $('.edit').click(function(event) {
                event.preventDefault();
                var newsRow = $(this).parents('li[data-cid]');
                var	newsId = newsRow.attr('data-cid');
                socket.emit('plugins.news.get', newsId, function(err, news) {

                    if (!err) {
                        var title = $('#title').val(news.title);
                        var content = $('#description').val(news.content.replace(/<br\/>/g,"\n"));
                        $('#editImgNews').css('background-image', 'url(' + news.pathImg + ')');
                        $('#editImgNews').parents('.form-group').removeClass('hidden');
                        $('#hiddenNewsId').val(news.sid);
                        $('#hiddenNewsImg').val(news.pathImg);

                        $('#hiddenTopicId').val(news.tid);
                        $('#edit').removeClass('hidden');
                        $('#save').addClass('hidden');
                    }
                })
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


            $('.highlight').click(function(event) {
                event.preventDefault();
                //save();
                var newsRow = $(this).parents('li[data-cid]');
                var	cid = newsRow.attr('data-cid');


                if($(this).attr('id') == "enableHighlight"){

                    $.post('/api/admin/news/highlight', {
                        _csrf : $('#csrf_token').val(),
                        cid : cid,
                        highlight:1
                    }, function(data) {
                        location.reload();
                    });

                }else{
                    $.post('/api/admin/news/highlight', {
                        _csrf : $('#csrf_token').val(),
                        cid : cid,
                        highlight:0
                    }, function(data) {
                        location.reload();
                    });
                }

            });

            $('#editImgBtn').click(function(event) {
                event.preventDefault();
                var id = $('#hiddenNewsId').val() + "";
                uploader.open('/admin/news/uploadImage',{ cid: id }, 0, function(imageUrlOnServer) {
                    $('#editImgNews').css('background-image', 'url(' + imageUrlOnServer + ')');
                })
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


            var modified_news = [];

            function modified(el) {
                var cid = $(el).parents('li').attr('data-cid');
                if(cid) {
                    modified_news.push({
                        cid:cid,
                        order:$(el).val()
                    });
                }
            }

            function updateNewsOrders() {
                var news = $('.admin-news #entry-container').children();
                for(var i = 0; i<news.length; ++i) {
                    var input = $(news[i]).find('input[data-name="order"]');

                    input.val(i+1).attr('data-value', i+1);
                    modified(input);
                }
                saveOrder();
            }

            function saveOrder() {
                if(modified_news.length) {
                    socket.emit('plugins.news.order', modified_news, function(err, result) {
                        console.log("Success save order");
                    })
                }
            }


            $('#entry-container').sortable({
                stop: function(event, ui) {
                    modified_news = [];
                    updateNewsOrders();
                },
                distance: 10
            });


		});
	});




}());