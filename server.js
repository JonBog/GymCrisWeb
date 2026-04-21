const { createServer } = require("node:https");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const next = require("next");

const port = Number(process.env.PORT) || 3000;
const hostname = process.env.HOSTNAME || "gymcris.test";
const dev = process.env.NODE_ENV !== "production";

const httpsOptions = {
  key: readFileSync(resolve(__dirname, "certs/gymcris.test-key.pem")),
  cert: readFileSync(resolve(__dirname, "certs/gymcris.test.pem")),
};

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    handle(req, res);
  }).listen(port, hostname, () => {
    console.log(`> Ready on https://${hostname}:${port}`);
  });
});
