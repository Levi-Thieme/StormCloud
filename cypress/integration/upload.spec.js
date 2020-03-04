describe("The upload page header", () => {
    beforeEach(() => cy.visit("http://localhost:80/upload"));

    describe("When the home button is clicked", () => {
        it("redirects the user to the home page", () => {
            cy.get("[data-testid=homeLink]").click();
            cy.location("pathname").should("eq", "/index");
        })
    })
})

describe("The upload form", () => {
    beforeEach(() => cy.visit("http://localhost:80/upload"));

    it("requires the title, video file, and thumbnail file inputs", () => {
        cy.get("[data-testid=titleInput]")
            .should("have.attr", "required");
        cy.get("[data-testid=videoFileInput]")
            .should("have.attr", "required");
        cy.get("[data-testid=thumbnailFileInput]")
            .should("have.attr", "required");
    })

    it("redirects the user to the home page on submission", () => {
        cy.get("[data-testid=uploadForm]")
            .should("have.attr", "action")
            .and("eq", "/videos/upload");
    })
})