import { Router, Request, Response } from 'express';
import { Connection, Request as TediousRequest, Types } from 'tedious';

class BookController {
    router: Router;

    config = {
        server: 'localhost',
        options: {
            port: 1433,
            database: 'bookish',
            trustServerCertificate: true,
            rowCollectionOnRequestCompletion: true,
        },
        authentication: {
            type: 'default',
            options: {
                userName: 'markSQLSA',
                password: 'Nacho[7]Dip',
            },
        },
    };

    constructor() {
        this.router = Router();
        this.router.get('/:id', this.getBook.bind(this));
        this.router.get('/', this.getBooks.bind(this));
        this.router.post(
            '/:bookTitle/:copies/:ISBN/:authorFirst/:authorLast',
            this.createBook.bind(this),
        );
    }

    async getBook(req: Request, res: Response) {
        const connection = new Connection(this.config);
        let requestStatement = new String(); //Plz ignore
        const output = [];

        // Setup event handler when the connection is established.
        connection.on('connect', async function (err) {
            if (err) {
                console.log('Error: ', err);
                throw err;
            }
            let id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ status: 'Invalid Id' });
            } else {
                const sqlRequest = `SELECT * FROM books WHERE id = ${id}`;
                const databaseRequest = new TediousRequest(
                    sqlRequest,
                    function (err, _rowCount, rows) {
                        if (err) {
                            console.log(err);
                            throw err;
                        } else {
                            if (rows.length == 0) {
                                return res
                                    .status(400)
                                    .json({ status: 'book not found' });
                            } else {
                                for (let j = 0; j < rows[0].length; j++) {
                                    output.push(rows[0][j].value);
                                }
                                return res.status(200).json(output);
                            }
                        }
                    },
                );
                requestStatement = connection.execSql(databaseRequest);
            }
        });
        connection.connect();
    }

    async createBook(req: Request, res: Response) {
        const connection = new Connection(this.config);
        let requestStatement = new String(); //Plz ignore
        const output = [];

        // Setup event handler when the connection is established.
        connection.on('connect', async function (err) {
            if (err) {
                console.log('Error: ', err);
                throw err;
            }
            const parsedBookTitle = req.params.bookTitle.split('_').join(' ');

            const sqlRequest = `INSERT INTO books (BookTitle, Copies, ISBN) 
                VALUES ( '${parsedBookTitle}', 
                ${req.params.copies},
                ${req.params.ISBN}) 
                INSERT INTO authors (FirstName, Surname) 
                VALUES ( '${req.params.authorFirst}', 
                '${req.params.authorLast}') 
                INSERT INTO books_authors (Author_Id, Book_Id) 
                VALUES ( IDENT_CURRENT('authors'), IDENT_CURRENT('books')) `;

            console.log(sqlRequest);

            const databaseRequest = new TediousRequest(sqlRequest, function (
                err,
            ) {
                if (err) {
                    console.log(err);
                } else {
                    return res
                        .status(200)
                        .json({ status: 'Book has been added' });
                }
            });
            requestStatement = connection.execSql(databaseRequest);
        });
        connection.connect();
    }

    async getBooks(req: Request, res: Response) {
        const connection = new Connection(this.config);
        const output = [];

        // Setup event handler when the connection is established.
        connection.on('connect', async function (err) {
            if (err) {
                console.log('Error: ', err);
                throw err;
            }
            const databaseRequest = new TediousRequest(
                'SELECT * FROM books',
                function (err, rowCount, rows) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(rowCount + ' rows');
                        let tmp_rows = [];
                        for (let i = 0; i < rows.length; i++) {
                            tmp_rows = [];
                            for (let j = 0; j < rows[i].length; j++) {
                                tmp_rows.push(rows[i][j].value);
                            }
                            output.push(tmp_rows);
                        }
                        return res.status(200).json(output);
                    }
                },
            );
            connection.execSql(databaseRequest);
        });
        connection.connect();
    }
}

export default new BookController().router;
