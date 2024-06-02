function generateEnvironmentContent() {
    return `export const environment = {
    production: ${process.env.IS_PRODUCTION || false},
    environment: "${process.env.ENVIRONMENT || "local"}",
    backendURL: "${process.env.BACKEND_URL || "http://localhost:8080"}"
  };`;
}

(function generateEnvironment() {
    const fs = require('fs');
    const fileName = 'environment.ts';
    const content = generateEnvironmentContent();
    process.chdir('src/environments');
    fs.writeFile(fileName, content, (err) => { (err) ? console.log(err) : console.log('env is generated'); });
})();