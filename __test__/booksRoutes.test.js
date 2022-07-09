const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

const bookTest = { 
	isbn: "0691161518",
    amazon_url: "http://a.co/eobPtX2",
    author: "Matthew Lane",
    language: "english",
    pages: 264,
    publisher: "Princeton University Press",
    title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    year: 2017
}
const bookTestUpdated = { 
	isbn: "0691161518",
    amazon_url: "http://a.co/eobPtX2",
    author: "Matthew Louis",
    language: "spanish",
    pages: 300,
    publisher: "Princeton University Press",
    title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    year: 2018
}

beforeAll(async function(){
    await db.query("DELETE FROM books");
});

/** Test all Books Routes APP */
describe("Books Routes Test", function (){
    /**
    * POST /books
    * Creates a book and responds with the newly created book
    */
    describe("POST /books", function (){
        test("Add a new book", async function (){
            let response = await request(app).post("/books").send({ book: bookTest });
            expect(response.statusCode).toEqual(201);
            expect(response.body).toEqual({ book: bookTest });
        });

        test("error for invalid input data (is not string)", async function (){
            let response = await request(app).post("/books")
                .send({ book: { "isbn": 123 } });

            expect(response.statusCode).toEqual(400);
            expect(response.body).toEqual({ 
                "error": expect.any(Object),
                "message": expect.any(Array)
            });
        });

        test("error for invalid input data (is not number)", async function (){
            let response = await request(app).post("/books")
                .send({ book: { "pages": "acb" } });

            expect(response.statusCode).toEqual(400);
            expect(response.body).toEqual({ 
                "error": expect.any(Object),
                "message": expect.any(Array)
            });
        });

        test("error for invalid input data (is not url)", async function (){
            let response = await request(app).post("/books")
                .send({ book: { "amazon_url": "www.com" } });

            expect(response.statusCode).toEqual(400);
            expect(response.body).toEqual({ 
                "error": expect.any(Object),
                "message": expect.any(Array)
            });
        });

        test("error for missing data", async function (){
            let response = await request(app).post("/books")
                .send({ book: { "isbn": bookTest.isbn } });

            expect(response.statusCode).toEqual(400);
            expect(response.body).toEqual({ 
                "error": expect.any(Object),
                "message": expect.any(Array)
            });
        });
    });


    /**
    * PUT /books/[isbn]
    * Updates a book and responds with the updated book
    */
    describe("PUT /books/[isbn]", function (){
        test("Update a book", async function (){
            let response = await request(app).put(`/books/${bookTestUpdated.isbn}`).send({ book: bookTestUpdated });
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({ book: bookTestUpdated });
        });

        test("error for invalid input data (is not string)", async function (){
            let response = await request(app).put(`/books/${bookTestUpdated.isbn}`)
                .send({ book: { "isbn": 123 } });

            expect(response.statusCode).toEqual(400);
            expect(response.body).toEqual({ 
                "error": expect.any(Object),
                "message": expect.any(Array)
            });
        });

        test("error for invalid input data (is not number)", async function (){
            let response = await request(app).put(`/books/${bookTestUpdated.isbn}`)
                .send({ book: { "pages": "acb" } });

            expect(response.statusCode).toEqual(400);
            expect(response.body).toEqual({ 
                "error": expect.any(Object),
                "message": expect.any(Array)
            });
        });

        test("error for invalid input data (is not url)", async function (){
            let response = await request(app).put(`/books/${bookTestUpdated.isbn}`)
                .send({ book: { "amazon_url": "www.com" } });

            expect(response.statusCode).toEqual(400);
            expect(response.body).toEqual({ 
                "error": expect.any(Object),
                "message": expect.any(Array)
            });
        });

        test("error for missing data", async function (){
            let response = await request(app).put(`/books/${bookTestUpdated.isbn}`)
                .send({ book: { "isbn": bookTest.isbn } });

            expect(response.statusCode).toEqual(400);
            expect(response.body).toEqual({ 
                "error": expect.any(Object),
                "message": expect.any(Array)
            });
        });
    });

    /**
    * POST /books/[isbn]
    * Updates partially a book and responds with the updated book
    */
    describe("POST /books/[isbn]", function (){
        test("Update partially a book", async function (){
            let response = await request(app).post(`/books/${bookTestUpdated.isbn}`)
                .send({ 
                    book: { 
                        "title": "Title Updated",
                        "year": 2022
                    } 
                });

            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({ 
                book: {
                    isbn: bookTestUpdated.isbn,
                    amazon_url: bookTestUpdated.amazon_url,
                    author: bookTestUpdated.author,
                    language: bookTestUpdated.language,
                    pages: bookTestUpdated.pages,
                    publisher: bookTestUpdated.publisher,
                    title: "Title Updated",
                    year: 2022
                } 
            });
        });

        test("error for invalid input data (is not string)", async function (){
            let response = await request(app).put(`/books/${bookTestUpdated.isbn}`)
                .send({ book: { "isbn": 123 } });

            expect(response.statusCode).toEqual(400);
            expect(response.body).toEqual({ 
                "error": expect.any(Object),
                "message": expect.any(Array)
            });
        });

        test("error for invalid input data (is not number)", async function (){
            let response = await request(app).put(`/books/${bookTestUpdated.isbn}`)
                .send({ book: { "pages": "acb" } });

            expect(response.statusCode).toEqual(400);
            expect(response.body).toEqual({ 
                "error": expect.any(Object),
                "message": expect.any(Array)
            });
        });

        test("error for invalid input data (is not url)", async function (){
            let response = await request(app).put(`/books/${bookTestUpdated.isbn}`)
                .send({ book: { "amazon_url": "www.com" } });

            expect(response.statusCode).toEqual(400);
            expect(response.body).toEqual({ 
                "error": expect.any(Object),
                "message": expect.any(Array)
            });
        });

        test("error for invalid isbn", async function (){
            let response = await request(app).get("/books/abc123");
            expect(response.statusCode).toEqual(404);
            expect(response.body).toEqual({ 
                "error": expect.any(Object),
                "message": expect.any(String)
            });
        });
    });

    /**
    * GET /books
    * Responds with a list of all the books
    */
     describe("GET /books", function (){
        test("List of all books", async function (){
            let response = await request(app).get("/books");
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({ books: expect.any(Array) });
        });
    });

    /**
    * GET /books/[isbn]
    * Responds with a single book found by its isbn
    */
     describe("GET /books/[isbn]", function (){
        test("Get a single book found by isbn", async function (){
            let response = await request(app).get(`/books/${bookTestUpdated.isbn}`);
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({ book: expect.any(Object) });
        });

        test("error for invalid isbn", async function (){
            let response = await request(app).get("/books/abc123");
            expect(response.statusCode).toEqual(404);
            expect(response.body).toEqual({ 
                "error": expect.any(Object),
                "message": expect.any(String)
            });
        });
    });

    /**
    * DELETE /books/[isbn]
    * Deletes a book and responds with a message of “Book deleted”
    */
     describe("DELETE /books/[isbn]", function (){
        test("Delete a book by isbn", async function (){
            let response = await request(app).delete(`/books/${bookTestUpdated.isbn}`);
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({ message: "Book deleted" });
        });

        test("error for invalid isbn", async function (){
            let response = await request(app).delete("/books/abc123");
            expect(response.statusCode).toEqual(404);
            expect(response.body).toEqual({ 
                "error": expect.any(Object),
                "message": expect.any(String)
            });
        });
    });
});  

afterAll(async function (){
  await db.end();
});