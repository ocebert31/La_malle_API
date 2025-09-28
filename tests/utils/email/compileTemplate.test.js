const fs = require("fs");
const compileTemplate = require("../../../utils/email/compileTemplate");

jest.mock("fs");

const fakeTemplates = {
  "profile.hbs": `
    {{#extend "layout"}}
      {{#content "title"}}Bienvenue{{/content}}
      {{#content "body"}}Bonjour {{name}}{{/content}}
    {{/extend}}
  `,
  "contactEmail.hbs": `
    {{#extend "layout"}}
      {{#content "title"}}Contact{{/content}}
      {{#content "body"}}Email du contact : {{email}}{{/content}}
    {{/extend}}
  `,
  "emailLayout.hbs": `
    <html>
      <body>
        <h1>{{#block "title"}}{{/block}}</h1>
        <div>{{#block "body"}}{{/block}}</div>
      </body>
    </html>
  `,
  "empty.hbs": ``,
};

beforeEach(() => {
  fs.existsSync = jest.fn((filePath) => Object.keys(fakeTemplates).some(f => filePath.endsWith(f)));
  fs.readFileSync = jest.fn((filePath) => {
    const key = Object.keys(fakeTemplates).find(f => filePath.endsWith(f));
    if (!key) throw new Error("Fichier introuvable");
    return fakeTemplates[key];
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("compileTemplate", () => {
  describe("successful compilation", () => {
    test.each([
      ["profile", "user", { name: "Océane" }, ["Bonjour Océane", "Bienvenue"]],
      ["contactEmail", "contact", { email: "oceane@test.com" }, ["Email du contact : oceane@test.com", "Contact"]],
    ])("correctly compiles the %s template for %s", (templateName, context, data, expected) => {
      const template = compileTemplate(templateName, context);
      const output = template(data);
      expected.forEach(e => expect(output).toContain(e));
    });

    test("returns a compiled function", () => {
      expect(typeof compileTemplate("profile", "user")).toBe("function");
    });

    test("renders template even if some data is missing", () => {
      const template = compileTemplate("profile", "user");
      const output = template({});
      expect(output).toContain("Bonjour");
      expect(output).toContain("Bienvenue");
    });

    test("renders an empty template without errors", () => {
      const template = compileTemplate("empty", "user");
      const output = template({});
      expect(output).toBe("");
    });
  });

  describe("error handling", () => {
    test("throws an error if the template does not exist", () => {
      expect(() => compileTemplate("inexistant", "user"))
        .toThrow("Template introuvable: inexistant");
    });

    test("throws an error if the context is invalid", () => {
      expect(() => compileTemplate("profile", "invalide"))
        .toThrow("Aucun contexte n'est indiqué");
    });

    test("throws an error if the layout does not exist", () => {
      fs.existsSync = jest.fn((filePath) => {
        if (filePath.endsWith("profile.hbs")) return true;  
        if (filePath.endsWith("emailLayout.hbs")) return false; 
        return false;
      });
      expect(() => compileTemplate("profile", "user")).toThrow("Layout introuvable: emailLayout.hbs")});
  });
});
