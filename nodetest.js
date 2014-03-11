var httpd = require("http").createServer(handler);
var fs = require('fs');
var url = require("url");
var path = require("path");
var port = process.argv[2] || 8080;
var spawn = require('child_process').spawn;

httpd.listen(parseInt(port, 10));

function handler (request, response) {

	var uri = url.parse(request.url).pathname,
	filename = path.join(process.cwd(), uri);
	
	
	
	console.log(uri);
	console.log('filename',filename);

	path.exists(filename, function(exists) {
		if(!exists) {
			response.writeHead(404, {"Content-Type": "text/html;charset=UTF-8"});
			response.write("404 Not Found\n");

			response.end();
			return; //these returns get you out of the function I think
		}

		if (fs.statSync(filename).isDirectory()) filename += 'index2.html';

		fs.readFile(filename, "binary", function(err, file) {
			if(err) {
				response.writeHead(500, {"Content-Type": "text/html;charset=UTF-8"});
				response.write(err + "\n");
				response.end();
				return;
			}

			response.writeHead(200);
			response.write(file, "binary"); //otherwise here's where the file gets finally served
			response.end();
		}); //fs.readFile

	}); //path.exists

} //handler (request, response) {
