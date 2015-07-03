var Q 						= 	require('q');
var sitemap					=	require('./petrify-sitemap.js');
var html					=	require('./petrify-html.js');
var createDirs				=	require('./petrify-create-directories.js');
var touch					=	require('./petrify-touch-make-grab.js');
var q 						=	require('./quick-console.js');

module.exports = {
	url: "",
	sitemap: "",
	details: 0,
	fullUrl: "",
	init: function() {

		q.mode = this.details;
		q.c('Welcome to Petrify', 1, 1);

		global.appUrl = this.url;

		if (typeof this.sitemap === "object") {
			
			html.init(this.sitemap)
			.then(function(html) {
				createDirs.init(html)
				.then(function() {
					touch.init(html)
					.then(function(){
						q.c("Petrify has finsihed", 1, 2);
					})
				})
			})
			.catch(function(err) { console.log(err)})
			.done();			

		}
		else if (typeof this.sitemap === "string") {
			global.fullUrl = this.url + this.sitemap;	

			sitemap.init()
			.then(function(json) 	{ 
				html.init(json)
				.then(function(html) {
					createDirs.init(html)
					.then(function() {
						touch.init(html)
						.then(function() {
							q.c("Petrify has finsihed", 1, 2);
						});
					})
				})
			}) 
			.catch(function(err) { console.log(err)})
			.done();
		}




		// 

		

		// sitemap.init()
		// .then(function(json) 	{ 
		// 	html.init(json)
		// 	.then(function(html) {
		// 		createDirs.init(html)
		// 		.then(function() {
		// 			touch.init();
		// 		})
		// 	})
		// }) 
		// .catch(function(err) { console.log(err)})
		// .done();


	}

}