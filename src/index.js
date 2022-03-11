import http from "http";
import Routes from "./routes.js";

const handler = (request, response) => {
  const { method } = request;
  const routes = new Routes();
  const defaultRoute = () => {
    response.writeHead(404);
    response.end("not found");
  };
  const route = routes[method.toLowerCase()] || defaultRoute;
  route(request, response);
};

const server = http.createServer(handler);

server.listen(process.env.PORT || 3000);

server.on("listening", () => {
  console.log(`running in http://localhost:${server.address().port}/`);
});
