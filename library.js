var	NodeBB = require('./lib/nodebb'),
    fs = require('fs'),
    path = require('path'),
    file = NodeBB.file,
    plugins = NodeBB.plugins,
    nconf = require('nconf'),
    Config = require('./lib/config'),
    Backend = require('./lib/backend'),
    Settings = NodeBB.settings,
    categories = NodeBB.categories,
    SocketPlugins = NodeBB.SocketPlugins,
    PostTools = NodeBB.PostTools,
    Topics = NodeBB.Topics,
    app;


var News = {};

News.register = {
	load: function(params, callback) {


		function renderGlobal(req, res, next) {
			Config.getTemplateData(function(data) {
				res.render(Config.plugin.id, data);
			});
		}

		function renderAdmin(req, res, next) {
            Config.getTemplateData(function(data) {
                categories.getAllCategories(0,function (err, categoryData) {

                    data.categories = categoryData;
                    res.render('admin/' + Config.plugin.id, data);

                });


            });
		}
        app = params.app;

        var router = params.router;
        router.get(Config.plugin.route, params.middleware.buildHeader, renderGlobal);
        router.get('/api' + Config.plugin.route, renderGlobal);

        router.get('/admin' + Config.plugin.route, params.middleware.admin.buildHeader, renderAdmin);

        var multipart = require('connect-multiparty');
        var multipartMiddleware = multipart();

        var middlewares = [multipartMiddleware, params.middleware.validateFiles, params.middleware.applyCSRF, params.middleware.authenticate];

        //router.post('/category/uploadpicture', middlewares, controllers.admin.uploads.uploadCategoryPicture);

        router.post('/admin' + Config.plugin.route +'/uploadImage',middlewares, uploadImage);

        router.get('/api/admin' + Config.plugin.route, renderAdmin);

        router.get('/api' + Config.plugin.route +'/list', getNews);

        router.post('/api/admin' + Config.plugin.route +'/add', addNews);
        router.post('/api/admin' + Config.plugin.route +'/edit', editNews);
        router.post('/api/admin' + Config.plugin.route +'/remove', removeNews);
        router.post('/api/admin' + Config.plugin.route +'/highlight', highlightNews);
        router.post('/api/admin' + Config.plugin.route +'/addTopic', addTopic);
        router.post('/api/admin' + Config.plugin.route +'/addCategoryForNews', addCategoryForNews);

        SocketPlugins[Config.plugin.id] = {
            get: function(socket, newsId, callback) {
                if (newsId) {
                    Backend.getNewsById(newsId, function(err, news) {
                        callback(err, news);
                    });
                }
            },
            order: function(socket, newsList, callback){
                Backend.setOrder(newsList, function(err, news) {
                    callback(err, news);
                })
            },
            loadMore:function(socket, data, callback){
                var start = parseInt(data.after, 10),
                    end = (start -1) + 5;

                Config.getTemplateData(function(data) {
                    callback(null, data);
                }, (start -1), end);
            }
        };



        //Config.init(callback);

	},
    created: function(topic,cb) {
    },
    deleted: function(topic,cb) {
    },
    global: {
		addNavigation: function(custom_header, callback) {
			if (Config.global.get('toggles.headerLink')) {
				custom_header.navigation.push({
					class: '',
					iconClass: 'fa fa-fw ' + Config.plugin.icon,
					route: Config.plugin.route,
					text: Config.plugin.name
				});
			}

			callback(null, custom_header);
		}
	},
	admin: {
		addNavigation: function(custom_header, callback) {
			custom_header.plugins.push({
				route: Config.plugin.route,
				icon: Config.plugin.icon,
				name: Config.plugin.name
			});

			callback(null, custom_header);
		}
	}
};

News.widget = {
    define: function(widgets, callback) {
        widgets.push({
            name: Config.plugin.name,
            widget: Config.plugin.id,
            description: Config.plugin.description,
            content: ''
        });

        widgets.push({
            name: Config.plugin.name+"-home",
            widget: Config.plugin.id+"-home",
            description: Config.plugin.description,
            content: ''
        });


        callback(null, widgets);
    },
    render: function(widget, callback) {
        //Remove any container
        widget.data.container = '';
        Config.getTemplateData(function(data) {
            data.news = data.news.filter(function(news) {
                return news.highlight;
            });

            app.render('news/slide', data, callback);
        })

    },
    renderHome: function(widget, callback) {
        //Remove any container
        widget.data.container = '';
        Config.getTemplateData(function(data) {

            app.render('news', data, callback);
        }, 0, 5);

    }
};

function addNews(req, res, next) {
    var title = req.body.title;
    var content =  req.body.content;

    Backend.addNews(title,content, function(error,news){
        res.json(news);
    });
}

function editNews(req, res, next) {

    var title = req.body.title;
    var content =  req.body.content;
    var contentPost =  req.body.contentPost;
    var sid =  req.body.sid;
    var uid =  req.user.uid;
    var tid =  req.body.tid;
    var topicThumb = req.body.topicThumb;


    Backend.getNewsById(("news:"+sid),function(error, news) {
        news.title = title;
        news.content = content;
        news.sid = sid;
        Backend.editNews(news, sid, function (error, news) {

            Topics.getTopicData(tid,function(err, data){

                PostTools.edit({"uid":uid,"pid":data.mainPid,"title":title,"content":contentPost,topic_thumb: topicThumb, tags: []}, function(err, results) {
                    if(err) {
                        return callback(err);
                    }

                    res.json(results);
                });

            })






        });
    })
}







function uploadImage(req, res, next) {

        try {
            params = JSON.parse(req.body.params);
        } catch (e) {
            var err = {
                error: 'Error uploading file! Error :' + e.message
            };
            return res.send(req.xhr ? err : JSON.stringify(err));
        }

    var uploadedFile = req.files.files[0];
    var filename =  'news-' + params.cid + path.extname(uploadedFile.name);

    function done(err, image) {
        fs.unlink(uploadedFile.path);
        if (err) {
            return next(err);
        }
        var url = image.url.startsWith('http') ? image.url : nconf.get('relative_path') + image.url;
        Backend.addImg(params.cid,url, function(){
            res.json([{name: uploadedFile.name, url: url}]);
        });


    }

    if (plugins.hasListeners('filter:uploadImage')) {
        plugins.fireHook('filter:uploadImage', {image: uploadedFile, uid: req.user.uid}, done);
    } else {
        file.saveFileToLocal(filename, '', uploadedFile.path, done);
    }



}



function getNews(req, res, next) {
    Backend.getNews(0,-1,function(err,data){

        res.json(data);
    });
}


function removeNews(req, res, next) {
    console.log("removeNews req.body.cid",req.body.cid);
    var sid = req.body.cid;
    Backend.removeNews(sid,function(){
        res.redirect('/admin' + Config.plugin.route);

    });

}
function highlightNews(req, res, next) {
    var sid = req.body.cid;
    var highlight = parseInt(req.body.highlight,10);
    Backend.setHighlight(sid, highlight,function(){
        res.redirect('/admin' + Config.plugin.route);

    });

}



function addTopic(req, res, next) {
    var sid = req.body.sid;
    var topicId = req.body.topicId;
    Backend.addTopic(sid, topicId, function(err, data){
        res.json(data);
    });
}

function addCategoryForNews(req, res, next) {
    var cid = req.body.cid;

    //Settings.set("categoryIdForNews",cid);

    Config.saveCategoryId(cid)
    res.json({});
    /*Settings.addTopic(sid, topicId, function(err, data){
        res.json(data);
    });*/
}




module.exports = News;
