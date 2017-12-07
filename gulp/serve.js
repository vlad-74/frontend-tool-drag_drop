'use strict';

const browserSync = require('browser-sync').create();
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function(options) {

  return function() {
  	if(isDevelopment){
		var open = require("open");
		// open("https://github.com/angular-ui/ui-sortable");
		// open("https://codepen.io/thgreasi/pen/XjEWqV");
		// open("https://codepen.io/thgreasi/pen/ORvJzJ");
		// open("https://codepen.io/thgreasi/pen/zKWYWR");
		// open("https://codepen.io/qertis/pen/skwbp");

	    browserSync.init({
	      server: options.src,
	      browser: ["chrome", "firefox"]
	    });

	    browserSync.watch(`${options.src}/**/*.*`).on('change', browserSync.reload);
  	}else{
		var child_process = require('child_process');
		child_process.exec("node server.js", function(error, stdout, stderr) {
		    console.log(stdout);
		});
	}
  };

};

