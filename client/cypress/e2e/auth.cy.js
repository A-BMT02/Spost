describe("Authentication", () => {
  //login
  it("user can login", () => {
    cy.visit("/signin");
    cy.findByAltText(/email/i).type("ahmadbmtahir@gmail.com");
    cy.findByAltText(/password/i).type("12345678");
    cy.findByRole("button", {
      name: /sign in/i,
    }).click();
  });
});
