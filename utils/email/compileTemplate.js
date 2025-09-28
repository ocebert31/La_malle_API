const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const layouts = require("handlebars-layouts");

Handlebars.registerHelper(layouts(Handlebars));

const CONTEXT_PATHS = {
  user: "user",
  contact: "contact",
};

const LAYOUT_FILE = "emailLayout.hbs";

function compileTemplate(templateName, context) {
  const contextPath = CONTEXT_PATHS[context];
  if (!contextPath) throw new Error("Aucun contexte n'est indiqué");

  const templatePath = path.join(__dirname, "..", "..", "views", contextPath, `${templateName}.hbs`);
  const layoutPath = path.join(__dirname, "..", "..", "views", LAYOUT_FILE);

  if (!fs.existsSync(templatePath)) throw new Error(`Template introuvable: ${templateName}`);
  if (!fs.existsSync(layoutPath)) throw new Error(`Layout introuvable: ${LAYOUT_FILE}`);

  const source = fs.readFileSync(templatePath, "utf-8");
  const layoutSource = fs.readFileSync(layoutPath, "utf-8");

  Handlebars.registerPartial("layout", layoutSource);

  return Handlebars.compile(source);
}

module.exports = compileTemplate;
