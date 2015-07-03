//require files
var Q 						= 	require('q');
var fs 						= 	require('fs');
var http 					= 	require('http');
var parseString 			= 	require('xml2js').parseString;
var colors 					= 	require('colors/safe');
var mkdirp 					=	require('mkdirp');

//vars
var appUrl 					= 	"http://test.thespace.org";
var siteMapUri 				= 	"/sitemap.xml";
var fullUrl 				= 	appUrl + siteMapUri;
var totalNumberOfFiles		=	0;
var noOfFiles 				= 	0;

var warnings 				= 	0;
var errors					= 	0;
var success 				= 	0; 

//debug/information level
//0 - only errors
//1 - module updates
//2 - progress
//3 - debugging

var debug 					= 	2;
var progress 				= 	0;
var progressAlt				=	0;
var totalPages				=	0;

//settings for modules
colors.setTheme({
  success: 'green',
  warn: 'yellow',
  error: 'red'
});


var xml = "";
var website 				= 	[]

function cl(v, a, c) {

	if (debug >= a) {
		switch (c) {
			case 1 : { console.log(colors.rainbow(v)); break; }
			case 2 : { console.log(colors.green(v)); break; }
			case 3 : { console.log(colors.yellow(v)); break; }
			case 4 : { console.log(colors.red(v)); break; }
			case 5 : { console.log(colors.inverse(v)); break; }
			default : { console.log(v); break; }
		}
	}
}

function getWebSite() {
	var deferred = Q.defer();

	cl('Welcome to Petrify', 1, 1);

	getSiteMap().then(function() {
		deferred.resolve();
	})

	return deferred.promise;
}

function getSiteMap() {
	var deferred = Q.defer();
	var chunk = "";

	cl('Looking for Sitemap', 1);

	http.get(fullUrl, function(res) {
		res.on('data', function(e) {	
			chunk += e
		})
		res.on('end', function() {
			cl('Sitemap Recieved', 1, 2);
			parseXML(chunk).then(function() {
				deferred.resolve();
			});
		})
	})

	return deferred.promise;
}

function getPage(url) {

	var deferred = Q.defer();
	var chunk = "";

	http.get(url, function(res) {
		progressAlt++
		cl(progressAlt + "/" + totalPages + ": Getting Page " + url, 3, 5);

		res.on('data', function(e) {	
			chunk += e
		})
		res.on('end', function() {
			website.push({"url":url, "html":chunk})
			progress++
			cl(progress + "/" + totalPages + ": Recieved Page " + url, 2, 5);
			deferred.resolve();
		})
	})

	return deferred.promise;
}


function parseXML(xml) {
	
}

	

function loopJSON(json) { 

   	cl("Started downloading webpages from sitemap", 1);
   	totalPages = json.urlset.url.length;

	var promises = []
	deferred = Q.defer();

	var x = 0

	var loop = 0;
 
	for (var k in json.urlset.url) {
		promises.push(getPage(json.urlset.url[k].loc[0]));

	}	

	return Q.all(promises);

}

function buildDir() {

	var promises = []
	cl('Creating Directorys', 1);
	progress = 0;


	for (loop = 0; loop < website.length; loop++) {
		progress++;
		var html = website[loop].html;
		var url = website[loop].url;
		var dir = url.replace(appUrl, "");
		cl(progress + "/" + totalPages + ": Creating Directory " + dir, 3, 5);
		promises.push(makeFolder('public'+ dir));
	}
	return Q.all(promises);

}

function makeFolder(dir) {
	
	var deferred = Q.defer();

	mkdirp(dir, function(err) {
			if (err) {
				deferred.resolve();
				cl('Failed creating Directory: ' + dir + ', but continuing anyway', 1, 4)
			}
			else {
	    		deferred.resolve();
			}
		})

	return deferred.promise;

} 

function createFiles() {

	var promises = []
	cl('Finished Creating Directorys', 1, 2)
	cl('Creating Files', 1)
	progress = 0;
	for (loop = 0; loop < website.length; loop++) {
		var html = website[loop].html;
		var url = website[loop].url;
		var dir = url.replace(appUrl, "");
		progress++;

		cl(progress + "/" + totalPages + ": Creating file " + dir + "/index.html", 2, 5);

		promises.push(writeToFile('public'+ dir + '/index.html', html))

	}

	return Q.all(promises);

}

function writeToFile(dir, html) {

	var deferred = Q.defer();

	fs.writeFile(dir, html, function(err) {
		if (err) {
			console.log('something is wrong', err);
		} else {
			deferred.resolve();
		}
	})

	return deferred.promise;

}

function finished() {
	cl('Finished Creating Files', 1, 2)
	cl('Petrify has finished', 1, 2)
}

getWebSite()
.then(buildDir)
.then(createFiles)
.then(finished);