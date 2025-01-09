// Create web server
// Load module
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
// Create server
var server = http.createServer(function(request, response) {
    // Get URL
    var path = url.parse(request.url).pathname;
    // Check URL
    if (path == '/') {
        // Read file
        fs.readFile('index.html', 'utf-8', function(err, file) {
            // Response
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(file);
            response.end();
        });
    } else if (path == '/comments') {
        // Check method
        if (request.method === 'POST') {
            // Read data
            var data = '';
            request.on('data', function(chunk) {
                data += chunk;
            });
            request.on('end', function() {
                // Parse data
                var query = qs.parse(data);
                // Read file
                fs.readFile('comments.json', 'utf-8', function(err, file) {
                    // Parse file
                    var comments = JSON.parse(file);
                    // Add data
                    comments.push(query);
                    // Write file
                    fs.writeFile('comments.json', JSON.stringify(comments), function(err) {
                        // Response
                        response.writeHead(200, {'Content-Type': 'text/plain'});
                        response.write('Add comment');
                        response.end();
                    });
                });
            });
        } else if (request.method === 'GET') {
            // Read file
            fs.readFile('comments.json', 'utf-8', function(err, file) {
                // Response
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.write(file);
                response.end();
            });
        }
    } else {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.write('Not found');
        response.end();
    }
});
// Listen port
server.listen(3000);
// Output message
console.log('Server running at http://localhost:3000/');
// End of comments.js
