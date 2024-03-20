const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req.url);

  res.write("<html>");
  res.write("<head><title>Response</title></head>");
  res.write("<body><h1>Server is running...</h1></body>");
  res.write("</head>");
  res.end();
});

server.listen(4500);
