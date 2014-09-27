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


	Config.global = new Settings(Config.plugin.id, Config.plugin.version, adminDefaults);

    Config.saveCategoryId = function(catId){
        adminDefaults.catId = catId;
        Config.global.set('catId',catId);
    }

    Config.getTemplateData = function(callback) {

       var catId = Config.global.get('catId');

       Backend.getNews(0,-1,function(err,news){
            var data = {news:news,catId:catId}
            callback(data);
        });
       /* var data = {};
        callback(data);*/
    };

})(module.exports);