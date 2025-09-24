const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

function compileTemplate(templateName, context) {
  let templatePath;
  if (context === "email") {
    templatePath = path.join(__dirname, "..", "..", "views", "email", `${templateName}.hbs`)
  } else if (context === "password") {
    templatePath = path.join(__dirname, "..", "..", "views", "password", `${templateName}.hbs`)
  }
  const source = fs.readFileSync(templatePath, "utf-8");
  const template = Handlebars.compile(source);
  return template;
}

module.exports = compileTemplate;
