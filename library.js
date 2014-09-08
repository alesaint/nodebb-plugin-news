var	NodeBB = require('./lib/nodebb'),
	Config = require('./lib/config'),
    Backend = require('./lib/backend'),
	app;

var News = {};

News.register = {
	load: function(expressApp, middleware, controllers, callback) {
		app = expressApp;

		function renderGlobal(req, res, next) {
			Config.getTemplateData(function(data) {
				res.render(Config.plugin.id, data);
			});
		}

		function renderAdmin(req, res, next) {
            Config.getTemplateData(function(data) {
                res.render('admin/' + Config.plugin.id, data);
            });
		}



        app.get(Config.plugin.route, middleware.buildHeader, renderGlobal);
		app.get('/api' + Config.plugin.route, renderGlobal);

		app.get('/admin' + Config.plugin.route, middleware.admin.buildHeader, renderAdmin);
        app.get('/api/admin' + Config.plugin.route, renderAdmin);

        app.get('/api' + Config.plugin.route +'/list', getNews);

        app.post('/api/admin' + Config.plugin.route +'/add', addNews);
        app.post('/api/admin' + Config.plugin.route +'/remove', removeNews);



        callback(expressApp, middleware, controllers);
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

        callback(null, widgets);
    },
    render: function(widget, callback) {
        //Remove any container
        widget.data.container = '';
        Config.getTemplateData(function(data) {
            app.render('news/slide', data, callback);
        })

    }
};

function addNews(req, res, next) {
    var title = req.body.title;
    var content =  req.body.content;

    Backend.addNews(title,content, function(){
        res.redirect('/admin' + Config.plugin.route);
    });
}

function getNews(req, res, next) {
    Backend.getNews(0,-1,function(err,data){

        res.json(data);
    });
}

function removeNews(req, res, next) {
    var sid = req.body.cid;
    Backend.removeNews(sid,function(){
        res.redirect('/admin' + Config.plugin.route);
    });

}


module.exports = News;
