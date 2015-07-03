var mkdirp 					=	require('mkdirp');
var Q 						= 	require('q');
var q 						=	require('./quick-console.js');
var html 					=	require('./petrify-html.js');

module.exports = {
	website: [],
	progress: 0,
	init: function(html) {
		var deferred = Q.defer();

		q.c('Creating Directorys', 1);
		this.website = html;
		this.buildDir().then(function() {
			q.c('Completed Creating Directorys', 1, 2);
	    	deferred.resolve();
		});

		return deferred.promise;
	},

	buildDir: function() {
		var promises = []

		for (var loop = 0; loop < this.website.length; loop++) {
			var url = this.website[loop].url;
			var dir = url.replace(global.appUrl, "");
			promises.push(this.makeDir('public'+ dir));
		}
		return Q.all(promises);
	},

	makeDir: function(dir) {
		var deferred = Q.defer();

		var websiteLength = this.website.length;

		mkdirp(dir, function(err) {
			if (err) {
				deferred.resolve();
				q.c('Failed creating Directory: ' + dir + ', but continuing anyway', 1, 4)
			}
			else {
				module.exports.progress++;
				q.c(module.exports.progress + "/" + websiteLength + ": Creating Directory: " + dir, 2, 5);
	    		deferred.resolve();
			}
		})

		return deferred.promise;

	}
}