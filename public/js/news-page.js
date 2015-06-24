(function() {
    var settings, wrapper, saveInterval, catId;

    $(document).ready(function() {
        require(['forum/infinitescroll'], function(infinitescroll) {

            function enableInfiniteLoadingOrPagination() {
                    console.log(" enableInfiniteLoadingOrPagination>>>>>>>>")
                    infinitescroll.init(loadMoreNews);
            }



            function loadMoreNews(direction) {
                console.log(">loadMoreNews>>>>>>");
                if (!$('#news-container').length || !$('#news-container').children().length) {
                    return;
                }

                infinitescroll.calculateAfter(direction, '#news-container article[data-sid]', 5,false, function(after, offset, el) {

                    loadNewsAfter(after, function() {
                        if (direction < 0 && el) {
                            scrollToTopic(el.attr('data-sid'), null, 0, offset);
                        }
                    });
                });
            };

            function loadNewsAfter(after, callback) {
                console.log(">loadNewsAfter>>>>>>");
                 infinitescroll.loadMore('plugins.news.loadMore', {
                    after: after
                }, function (data, done) {

                    if (data.news && data.news.length) {
                        onNewsLoaded(data, function() {
                            done();
                            callback();
                        });
                    } else {
                        done();
                    }
                });
            }


            onNewsLoaded = function(data, callback) {
                console.log("onNewsLoaded");
                if(!data.news || !data.news.length) {
                    return;
                }
                var newsList = data.news;
                /*function removeAlreadyAddedTopics() {
                    topics = topics.filter(function(topic) {
                        return $('#topics-container li[data-tid="' + topic.tid +'"]').length === 0;
                    });
                }*/

                var after = null,
                    before = null;

                function findInsertionPoint() {
                    if (!$('#news-container article[data-sid]').length) {
                        return;
                    }
                    var last = $('#news-container article[data-sid]').last();
                    var lastIndex = last.prevAll().length;
                    var firstIndex = newsList.length;
                    /*if (firstIndex > lastIndex) {
                        after = last;
                    } else {
                        before = $('#topics-container .category-item[data-tid]').first();
                    }*/
                }

                //removeAlreadyAddedTopics();
                /*if(!topics.length) {
                    return;
                }*/

                //findInsertionPoint();

                ajaxify.loadTemplate('news', function(categoryTemplate) {
                    var html = templates.parse(templates.getBlock(categoryTemplate, 'news'), data);

                    translator.translate(html, function(translatedHTML) {
                        var container = $('#news-container'),
                            html = $(translatedHTML);


                            /*if(after) {
                                html.insertAfter(after);
                            } else if(before) {
                                html.insertBefore(before);
                            } else {*/
                                container.append(html);
                           // }

                        if (typeof callback === 'function') {
                            callback();
                        }
                        //html.find('span.timeago').timeago();
                        //app.createUserTooltips();
                        //utils.makeNumbersHumanReadable(html.find('.human-readable-number'));
                    });
                });
            };


            scrollToTopic = function(newsId, clickedTid, duration, offset) {
                console.log(">scrollToTopic>>>>>>");
                if(!tid) {
                    return;
                }

                if(!offset) {
                    offset = 0;
                }

                if($('#news-container article[data-sid="' + newsId + '"]').length) {
                    var scrollTo = $('#news-container article[data-sid="' + tid + '"]');

                    if (scrollTo.length) {
                        $('html, body').animate({
                            scrollTop: (scrollTo.offset().top - $('#header-menu').height() - offset) + 'px'
                        }, duration !== undefined ? duration : 400, function() {
                            navigator.update();
                        });
                    }
                }
            };


            enableInfiniteLoadingOrPagination();

        });
    });



}());