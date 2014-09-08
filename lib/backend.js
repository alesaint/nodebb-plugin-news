var async = require('async'),

	NodeBB = module.require('./nodebb'),

	db = NodeBB.db,
	User = NodeBB.User,
	Plugins = NodeBB.Plugins;

(function(Backend) {

	Backend.addNews = function(title, content, callback) {
        db.incrObjectField('global', 'nextSid', function(err, sid) {
            console.log("callback",callback)
            if (err) {
				return callback(err);
			}


			var news = {
                title:title,
				content: content,
				deleted: '0',
                sid: sid
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

	Backend.getNewsBySid = function(sid, callback) {
		db.getObject('news:' + sid, function(err, shout) {
			if (err) {
				return callback(err);
			}
			return callback(null, shout);
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
            var news = [];
            for(var i in data){
                if(data[i].deleted == 0){
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
        console.log(">>>>>>>>><")
        db.getObjectField(sid, '_key', function(err, key) {
            if (err) {
                return callback(new Error('Unknown error'), false);
            }
            console.log("key",key)
            db.setObjectField(sid, 'deleted', '1', function (err, result) {
                if (err) {
                    return callback(new Error('Unknown error'), false);
                }
                console.log("success")
                return callback(null, true);
            });
        });
	};

	Backend.editNews = function(sid, msg, uid, callback) {
		User.isAdministrator(uid, function(err, isAdmin) {
			db.getObjectField('news:' + sid, 'fromuid', function(err, fromuid) {
				if (err) {
					return callback(new Error('Unknown error'), false);
				}

				if (fromuid === uid || isAdmin) {
					db.setObjectField('news:' + sid, 'content', msg, function (err, result) {
						if (err) {
							return callback(new Error('Unknown error'), false);
						}

						getNews([sid], false, function(err, news) {
							callback(err, news ? news[0] : null);
						});
					});
				} else {
					return callback(new Error('News does not belong to you'), false);
				}
			});
		});
	};


})(module.exports);