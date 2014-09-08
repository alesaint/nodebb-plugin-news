(function() {
	$(window).on('action:widgets.loaded', function(e, data) {
		if ($('#news').length > 0) {
			News.init(data.url);
		}
	});

	window.News = {
		init: function(url) {
			News.base.initialize(url, $('#news'));
		}
	};
})();