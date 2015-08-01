var Petrify = require('./lib/petrify-main.js');


//set url for sitemap
Petrify.url = "http://fe.test.auto.thespace.org";
//location of sitemap or array of urls
// Petrify.sitemap = 	[
// 					"http://test.thespace.org",
// 					"http://test.thespace.org/about",
// 					"http://test.thespace.org/news",
// 					"http://test.thespace.org/artworks",
// 					"http://test.thespace.org/artists"
// 					];

Petrify.sitemap = "/sitemap.xml";
//details you want in the site map
Petrify.details = 2;

Petrify.init();

