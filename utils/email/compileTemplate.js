const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const layouts = require("handlebars-layouts");

// Active les helpers layouts
Handlebars.registerHelper(layouts(Handlebars));

function compileTemplate(templateName, context) {
  let templatePath;
  if (context === "user") {
    templatePath = path.join(__dirname, "..", "..", "views", "user", `${templateName}.hbs`);
  } else if (context === "contact") {
    templatePath = path.join(__dirname, "..", "..", "views", "contact", `${templateName}.hbs`);
  }
  const layoutPath = path.join(__dirname, "..", "..", "views", "emailLayout.hbs");

  // Charger les fichiers
  const source = fs.readFileSync(templatePath, "utf-8");
  const layoutSource = fs.readFileSync(layoutPath, "utf-8");

  Handlebars.registerPartial("layout", layoutSource);
  const template = Handlebars.compile(source);

  return template;
}

module.exports = compileTemplate;
