(function(News) {
	var Settings = {
		settings: null,
		get: function(key) {
			key = Settings.formalString(key);
			return Settings.settings[key];
		},
		set: function(key, value) {
			/*key = Settings.formalString(key);
			Settings.settings[key] = value;

			Shoutbox.sockets.saveSettings({ key: key, value: value }, function(err, result) {
				if (err || result === false) {
					app.alertError('Error saving settings!');
				}
			});*/
		},
		load: function(shoutPanel, callback) {
			/*Shoutbox.sockets.getSettings(function(err, result) {
				Settings.settings = result.settings;

				Settings.parse(shoutPanel);

				if (callback) {
					callback();
				}
			});*/
		}
	};

	News.settings = {
		get: Settings.get,
		set: Settings.set,
		load: Settings.load
	};
})(window.News);