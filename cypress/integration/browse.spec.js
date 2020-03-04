describe("The browse page", () => {
    beforeEach(() => {
        cy.server();
        cy.fixture("videos.json").then(data => {
            cy.route("GET", "videos", data);
            cy.visit("http://localhost:80/")
        });
    });

    describe("when the page loads", () => {
        it("should display a maximum of 3 videos per row", () => {
            cy.get(".container-fluid")
                .children()
                .first()
                .children()
                .should("have.length", 3);
        })

        it("should display a video card containing a title and link with a thumbnail", () => {
            cy.get(".container-fluid")
                .children()
                .first()
                .children()
                .first()
                .as("card");

            cy.get("@card")
                .contains("Rocky IV");

            cy.get("@card")
                .find("a")
                .should("have.attr", "href").and("contain", "/watch/rocky.mp4");
        
            cy.get("@card")
                .find("img")
                .should("have.attr", "src").and("contain", "/images/rocky.png");
        })
    })

    describe("when the user clicks a video thumbnail", () => {
        it("should redirect them to the watch page of that video", () => {
            cy.get(".container-fluid")
                .children()
                .first()
                .children()
                .first()
                .find("a")
                .click();
            cy.location("pathname").should("eq", "/watch/rocky.mp4");
        })
    })

    describe("when the user clicks the upload link", () => {
        it("should redirect them to the upload page", () => {
            cy.get("[data-testid=uploadLink]").click();
            cy.location("pathname").should("eq", "/upload");
        })
    })
})