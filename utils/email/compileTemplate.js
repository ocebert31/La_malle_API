const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

function compileTemplate(templateName, context) {
  let templatePath;
  if (context === "user") {
    templatePath = path.join(__dirname, "..", "..", "views", "user", `${templateName}.hbs`)
  } else if (context === "contact") {
    templatePath = path.join(__dirname, "..", "..", "views", "contact", `${templateName}.hbs`)
  }
  const source = fs.readFileSync(templatePath, "utf-8");
  const template = Handlebars.compile(source);
  return template;
}

module.exports = compileTemplate;
