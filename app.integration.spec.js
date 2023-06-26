// app.integration.spec.js

const request = require("supertest");

const app = require("./app");
const agent = request.agent(app);

describe("app", () => {
  describe("when authenticated", () => {
    beforeEach(async () => {
      await agent
        .post("/login")
        .send("username=randombrandon&password=randompassword");
    });

    describe("POST /messages", () => {
      describe("with non-empty content", () => {
        describe("with JavaScript code in personalWebsiteURL", () => {
          it("responds with error", async (done) => {
            // …
            test("should return an error if personalWebsiteURL contains JavaScript code", async () => {
              const invalidMessage = {
                content: "Valid content",
                personalWebsiteURL:
                  'https://example.com/<script>alert("XSS")</script>',
              };
              const response = await request(app)
                .post("/messages")
                .send(invalidMessage);

              expect(response.status).toBe(400); // Vérifie le statut de réponse
              expect(response.body.error).toBe("Invalid personalWebsiteURL"); // Vérifie le message d'erreur retourné par le serveur
            });
            done();
          });
        });

        describe("with HTTP URL in personalWebsiteURL", () => {
          it("responds with success", async (done) => {
            // …
            test("should create a new message with valid content and personalWebsiteURL", async () => {
              const validMessage = {
                content: "Valid content",
                personalWebsiteURL: "https://example.com",
              };

              const response = await request(app)
                .post("/messages")
                .send(validMessage);

              expect(response.status).toBe(201); // Vérifie le statut de réponse
              expect(response.body.message).toBe("Message created"); // Vérifie le message de succès retourné par le serveur
              expect(response.body.data.content).toBe(validMessage.content); // Vérifie le contenu du message créé
              expect(response.body.data.personalWebsiteURL).toBe(
                validMessage.personalWebsiteURL
              ); // Vérifie l'URL du site personnel du message créé
              done();
            });
          });
        });
      });
    });
  });
});
