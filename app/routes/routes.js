var request = require("request");
var querystring = require("querystring");
var http = require("http");
var url = require("url");

module.exports = function(app)
{
  app.get("/image/*", function(request, response)
  {
    var pathname = url.parse(request.url).pathname;

    response.sendfile(pathname);
  });

  app.get("*", function(request, response)
  {
    response.sendFile("/index.html");
  });

};
