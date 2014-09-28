var NodeBB = module.require('./nodebb'),
	pjson = require('../package.json'),
	Settings = NodeBB.Settings,
    Backend = module.require('./backend');



(function(Config) {
	Config.plugin = {
		name: 'News',
		id: 'news',
		version: pjson.version,
		description: pjson.description,
		icon: 'fa-bullhorn',
		route: '/news'
	};

	var adminDefaults = {
		toggles: {
			headerLink: false
			/*features: (function() {
				var defaults = {};
				features.forEach(function(el) {
					defaults[el.id] = el.enabled;
				});
				return defaults;
			})()*/
		},
		limits: {
            newsLimit: "25"
		},
        catId:1
	};


    Config.adminSockets = {
        sync: function() {
            Config.global.sync();
        },
        getDefaults: function(socket, data, callback) {
            callback(null, Config.global.createDefaultWrapper());
        }
    };

	Config.global = new Settings(Config.plugin.id, Config.plugin.version, adminDefaults);

    Config.saveCategoryId = function(catId){
        adminDefaults.catId = catId;
        Config.global.set('catId',catId);
    }

    Config.getTemplateData = function(callback, start, end) {
       var catId = Config.global.get('catId');

        var nbNews = end;

        Backend.getNews(0,-1,function(err,news){

            start = start || 0;
            nbNews = nbNews || news.length;
            var data = {news:news.slice(start,nbNews),catId:catId}

            callback(data);
        });
       /* var data = {};
        callback(data);*/
    };

})(module.exports);