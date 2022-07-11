import { Router, Request, Response } from 'express';
import { Connection, Request as TediousRequest } from 'tedious';

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
        this.router.post('/', this.createBook.bind(this));
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
            const databaseRequest = new TediousRequest(
                'SELECT * FROM books WHERE id = ' + req.params.id,
                function (err, rowCount, rows) {
                    if (err) {
                        console.log(err);
                        throw err
                    } else {
                        if (rows.length == 0){
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
        });
        connection.connect();
    }

    async getBooks(req: Request, res: Response) {
        const connection = new Connection(this.config);
        let requestStatement = new String(); //Plz ignore
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
            const databaseRequest = new TediousRequest(
                'SELECT * FROM books WHERE id = ' + req.params.id,
                function (err, rowCount, rows) {
                    if (err) {
                        console.log(err);
                        throw err
                    } else {
                        if (rows.length == 0){
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
        });
        connection.connect();
    }
}

export default new BookController().router;
