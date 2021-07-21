const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

describe("Book Routes Test", function(){
    beforeEach(async function () {
        await db.query("DELETE FROM books");
        let b1 = await Book.create({
            isbn: "0000000001",
            amazon_url: "https://www.amazon.com/testbook",
            author: "Test Tester",
            language: "english",
            pages: 999,
            publisher: "Testers and Co.",
            title: "To Test a Book",
            year: 2021
        })
    })

    describe("GET /books", function () {
        test("retrieves list of all books", async function () {
            let response = await request(app).get("/books")
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ books: [
                {
                    isbn: "0000000001",
                    amazon_url: "https://www.amazon.com/testbook",
                    author: "Test Tester",
                    language: "english",
                    pages: 999,
                    publisher: "Testers and Co.",
                    title: "To Test a Book",
                    year: 2021 
                }
            ]})
        })
    })

    afterAll(async function () {
        await db.end();
    })

})