(function(News) {


	var Utils = {
		initialize: function(newsPanel, callback) {
			news.actions.initialize(news);
		}
	};

	News.utils = {
		initialize: Utils.initialize
	};
})(window.News);

