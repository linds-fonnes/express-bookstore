const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

process.env.NODE_ENV = "test";

describe("Book Routes Test", function(){
    beforeEach(async function () {
        await db.query("DELETE FROM books");
        let b1 = await Book.create({
            isbn: "0000000001",
            amazon_url: "https://www.amazon.com/testbook1",
            author: "Test Tester",
            language: "english",
            pages: 999,
            publisher: "Testers and Co.",
            title: "To Test a Book",
            year: 2021
        })

        let b2 = await Book.create({
            isbn: "0000000002",
            amazon_url: "https://wwww.amazon.com/testbook2",
            author: "Test Tester Jr",
            language: "english",
            pages: 999,
            publisher: "Testers and Co.",
            title: "To Test a Book 2",
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
                amazon_url: "https://www.amazon.com/testbook1",
                author: "Test Tester",
                language: "english",
                pages: 999,
                publisher: "Testers and Co.",
                title: "To Test a Book",
                year: 2021 
                },
                {
                isbn: "0000000002",
                amazon_url: "https://wwww.amazon.com/testbook2",
                author: "Test Tester Jr",
                language: "english",
                pages: 999,
                publisher: "Testers and Co.",
                title: "To Test a Book 2",
                year: 2021
                }
            ]})
        })
    })

    describe("GET /books/:isbn", function () {
        test("retrieves data on a single book", async function () {
            let response = await request(app).get("/books/0000000001")
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({book: {
                isbn: "0000000001",
                    amazon_url: "https://www.amazon.com/testbook1",
                    author: "Test Tester",
                    language: "english",
                    pages: 999,
                    publisher: "Testers and Co.",
                    title: "To Test a Book",
                    year: 2021 
            }})
        })

        test("receive error if isbn isn't valid", async function () {
            let response = await request(app).get("/books/1234567890")
            expect(response.statusCode).toBe(404)
            expect(response.body).toEqual({
                error: {
                    message: "There is no book with an isbn '1234567890",
                    status: 404
                },
                message: "There is no book with an isbn '1234567890" 
            })
        })
    })

    describe("POST /books", function () {
        test("adds a new book", async function () {
            let response = await request(app).post("/books").send({
            isbn: "1250800812",
            amazon_url: "https://www.amazon.com/Ace-Spades-Faridah-Abike-Iyimide/dp/1250800811/ref=monarch_sidesheet",
            author: "Faridah Abike Iyimide",
            language: "english",
            pages: 432,
            publisher: "Feiwel & Friends",
            title: "Ace of Spades",
            year: 2021
            })
            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual({book: {
            isbn: "1250800812",
            amazon_url: "https://www.amazon.com/Ace-Spades-Faridah-Abike-Iyimide/dp/1250800811/ref=monarch_sidesheet",
            author: "Faridah Abike Iyimide",
            language: "english",
            pages: 432,
            publisher: "Feiwel & Friends",
            title: "Ace of Spades",
            year: 2021
            }})
        })

        test("receive error if no data is incorrect", async function () {
            let response = await request(app).post("/books").send({
                isbn: "0525559477",
                amazon_url: "https://www.amazon.com/Midnight-Library-Novel-Matt-Haig/dp/0525559477/ref=monarch_sidesheet",
                author: "Matt Haig",
                language: "english",
                pages: 304,
                publisher: "Viking",
                title: "Midnight Library",
                year: "2021"
            })
            expect(response.statusCode).toBe(400)
            expect(response.body).toEqual({       
                error: {
                message: [
                "instance.year is not of a type(s) integer"
                ],
                status: 400
                },
                message: [
                "instance.year is not of a type(s) integer"
                 ]
            })
        })

        test("receive error if data is missing", async function (){
            let response = await request(app).post("/books").send({
                isbn: "0525559477",
                amazon_url: "https://www.amazon.com/Midnight-Library-Novel-Matt-Haig/dp/0525559477/ref=monarch_sidesheet",
                author: "Matt Haig",
                language: "english",
                pages: 304,
                publisher: "Viking",
                title: "Midnight Library"
            })
            expect(response.statusCode).toBe(400)
            expect(response.body).toEqual({       
                error: {
                message: [
                    "instance requires property \"year\""
                ],
                status: 400
                },
                message: [
                    "instance requires property \"year\""
                 ]
            })
        })

        describe("PUT /books/:isbn", function () {
            test("updates book's data", async function () {
            let response = await request(app).put("/books/0000000001").send({
            isbn: "0000000001",
            amazon_url: "https://www.amazon.com/testbook1",
            author: "Test Tester",
            language: "english",
            pages: 12,
            publisher: "Testers and Co.",
            title: "To Test a Book",
            year: 2020
                })
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                book: {
                isbn: "0000000001",
                amazon_url: "https://www.amazon.com/testbook1",
                author: "Test Tester",
                language: "english",
                pages: 12,
                publisher: "Testers and Co.",
                title: "To Test a Book",
                year: 2020
                }
            }) 
            })
            
            test("error if book isn't in database", async function () {
                let response = await request(app).put("/books/1234567890").send({
                    isbn: "0000000001",
                    amazon_url: "https://www.amazon.com/testbook1",
                    author: "Test Tester",
                    language: "english",
                    pages: 999,
                    publisher: "Testers and Co.",
                    title: "To Test a Book Again",
                    year: 2019  
                })
                expect(response.statusCode).toBe(404)
            })

            test("error if data is incorrectly formatted", async function () {
                let response = await request(app).put("/books/0000000001").send({
                    isbn: "0000000001",
                    amazon_url: "https://www.amazon.com/testbook1",
                    author: "Test Tester",
                    language: "english",
                    pages: 999,
                    publisher: "Testers and Co.",
                    title: "To Test a Book Again",
                    year: "2019" 
                })
                expect(response.statusCode).toBe(400)
            })
        })

        describe("DELETE /books/:isbn", function () {
            test("deletes a book", async function () {
                let response = await request(app).delete("/books/0000000001")
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual({message: "Book deleted"})
            })
        })
    })

    afterAll(async function () {
        await db.end();
    })

})