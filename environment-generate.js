function ensureProtocol(url, protocol) {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("ws://") ||
    url.startsWith("wss://")
  ) {
    return url;
  }
  return `${protocol}://${url}`;
}

function generateEnvironmentContent() {
  const backendURL = ensureProtocol(process.env.BACKEND_URL, "http");
  const wsURL = ensureProtocol(process.env.WS_URL, "ws");
  return `export const environment = {
    production: ${process.env.IS_PRODUCTION || false},
    environment: "${process.env.ENVIRONMENT || "local"}",
    backendURL: "${backendURL || "http://localhost:8080"}",
    wsURL: "${wsURL || "ws://localhost:8080/graphql"}"
  };`;
}

(function generateEnvironment() {
  const fs = require("fs");
  const fileName = "environment.ts";
  const content = generateEnvironmentContent();
  console.log(`env : ${content}`);
  process.chdir("src/environments");
  fs.writeFile(fileName, content, (err) => {
    err ? console.log(err) : console.log("env is generated");
  });
})();
