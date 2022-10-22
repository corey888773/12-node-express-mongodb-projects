const http = require("http");

const server = http.createServer((request, response) => {
  if (request.url === "/") {
    response.write();
    response.end("Welcome to our page");
  }
  if (request.url === "/about") {
    response.write();
    response.end("About page");
  } else {
    response.write();
    response.end(
      `<h1>Ooops!</h1>
        <p>We can't seem to find a page you are looking for</p>
        <a href="/">go back to home page</a>`
    );
  }
});

server.listen(5000);
