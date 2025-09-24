const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

function compileTemplate(templateName) {
  const templatePath = path.join(__dirname, "..", "..", "views", "email", `${templateName}.hbs`);
  const source = fs.readFileSync(templatePath, "utf-8");
  const template = Handlebars.compile(source);
  return template;
}

module.exports = compileTemplate;
