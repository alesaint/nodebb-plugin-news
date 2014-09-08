(function(News) {
	var Settings = {
		register: function(shoutPanel) {
			shoutPanel.off('click', '#news-setting-menu a').on('click', '#news-setting-menu a', this.handle);
		},
		handle: function(e) {
			var el = $(e.currentTarget),
				statusEl = el.find('span'),
				key = el.data('news-setting'),
				status = statusEl.hasClass('fa-check');

			if (status) {
				statusEl.removeClass('fa-check').addClass('fa-times');
				status = 0;
			} else {
				statusEl.removeClass('fa-times').addClass('fa-check');
				status = 1;
			}

			News.settings.set(key, status);

			return false;
		}
	};

    News.actions.register(Settings);
})(window.News);