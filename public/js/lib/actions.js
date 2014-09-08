(function(News) {
	var actions = [];

    News.actions = {
		register: function(obj) {
			actions.push(obj);
		},
		initialize: function(newsPanel) {
			for (var a in actions) {
				if (actions.hasOwnProperty(a)) {
					actions[a].register(newsPanel);
				}
			}
		}
	};
})(window.News);