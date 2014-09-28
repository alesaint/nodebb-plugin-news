var async = require('async'),

	NodeBB = module.require('./nodebb'),

	db = NodeBB.db,
	User = NodeBB.User,
	Plugins = NodeBB.Plugins;

(function(Backend) {

	Backend.addNews = function(title, content, callback) {
        db.incrObjectField('global', 'nextSid', function(err, sid) {
            if (err) {
				return callback(err);
			}


			var news = {
                title:title,
				content: content,
				deleted: '0',
                sid: sid,
                pathImg:'',
                created:new Date().getTime(),
                tid:null,
                order:0
			};

			db.setObject('news:' + sid, news, function(err) {

                if (err) {
					return callback(err);
				}



				db.listAppend('news', sid);
                return callback(null, news);

            });
		});
	};

    Backend.editNews = function(news,sid, callback) {

        db.setObject('news:' + sid, news, function(err) {
            if (err) {
                return callback(err);
            }

            //db.listAppend('news', sid);
            return callback(null, news);
        })
    };

    Backend.setOrder = function(newsList, callback) {
        function orderNews(news, next) {
            db.setObjectField(news.cid, 'order', news.order, function (err, result) {
                next();
            });
        }

        async.eachSeries(newsList, orderNews, function(err) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, true);
        });


    };


	Backend.getNewsById = function(id, callback) {
		db.getObject(id, function(err, news) {
			if (err) {
				return callback(err);
			}
			return callback(null, news);
		});
	};

	Backend.getNews =  function(start, end, callback) {
		db.getListRange('news', start, end, function(err, sids) {
			if (err) {
				return callback(err);
			}

			if (!sids || !sids.length) {
				return callback(null, []);
			}

			getNews(sids, callback);
            //callback(sids);
		});
	};

	function getNews(sids, callback) {
		var keys = sids.map(function(sid) {
			return 'news:' + sid;
		});

		db.getObjects(keys, function(err, data) {
			if (err) {
				return callback(err);
			}



            data = data.reverse();
            data = data.sort(function(a,b){
                return a.order - b.order;
            });
            var news = [];
            var index = 1;
            for(var i = 0;i<data.length;i++){
                if(data[i].deleted == 0){
                    data[i].index = index;
                    index++;
                    news.push(data[i]);
                }
            }


            callback(null,news);
		});
	}

	Backend.parse = function(message, userData, callback) {
		Plugins.fireHook('filter:post.parse', message, function(err, parsed) {
			User.isAdministrator(userData.uid, function(err, isAdmin) {
				userData.status = NodeBB.SocketIndex.isUserOnline(userData.uid) ? (userData.status || 'online') : 'offline';
				userData.isAdmin = isAdmin;

				var news = {
					user: userData,
					content: parsed
				};

				callback(null, news);
			});
		});
	};

	Backend.removeNews = function(sid, callback) {
        db.getObjectField(sid, '_key', function(err, key) {
            if (err) {
                return callback(new Error('Unknown error'), false);
            }
            db.setObjectField(sid, 'deleted', '1', function (err, result) {
                if (err) {
                    return callback(new Error('Unknown error'), false);
                }
                return callback(null, true);
            });
        });
	};


    Backend.addImg = function(sid,pathImg, callback) {
        db.getObjectField(sid, 'sid', function(err, key) {
            if (err) {
                return callback(new Error('Unknown error'), false);
            }
            db.setObjectField('news:'+sid, 'pathImg', pathImg, function (err, result) {
                if (err) {
                    return callback(new Error('Unknown error'), false);
                }
                return callback(null, true);
            });
        });
    };

    Backend.addTopic = function(sid,tid, callback) {
        db.getObjectField(sid, 'sid', function(err, key) {
            if (err) {
                return callback(new Error('Unknown error'), false);
            }
            db.setObjectField('news:'+sid, 'tid', tid, function (err, result) {
                if (err) {
                    return callback(new Error('Unknown error'), false);
                }
                return callback(null, true);
            });
        });
    };

    Backend.setHighlight = function(sid,highlight, callback) {
        db.getObjectField(sid, 'sid', function(err, key) {
            if (err) {
                return callback(new Error('Unknown error'), false);
            }
            db.setObjectField(sid, 'highlight', highlight, function (err, result) {
                if (err) {
                    return callback(new Error('Unknown error'), false);
                }
                return callback(null, true);
            });
        });
    };


})(module.exports);
