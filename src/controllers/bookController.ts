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

    getBook(req: Request, res: Response) {
        // TODO: implement functionality

        return res.status(200).json({ status: 'OK' });
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
                        //console.log("something else")
                        // console.log(rows[1][2].value)
                        let tmp_rows = [];
                        for (let i = 0; i < rows.length; i++) {
                            tmp_rows = [];
                            for (let j = 0; j < rows[i].length; j++) {
                                // console.log(rows[i][j].value)
                                tmp_rows.push(rows[i][j].value);
                            }
                            output.push(tmp_rows);
                        }
                        return res.status(200).json(output);
                    }
                },
            );

            // databaseRequest.on('row', function(columns){

            //     columns.forEach(function(column){
            //         // console.log(column.value);
            //         output.push(column.value)
            //     });
            //     // console.log("Inside db request.on" + output)
            //     // console.log(databaseRequest.rowCount)
            //     // if (databaseRequest.rowCount == i) {
            //     //     return res.status(200).json(output);
            //     // } else {
            //     //     i++;
            //     // }
            // });
            // // console.log("Outside db request.on" + output)
            requestStatement = connection.execSql(databaseRequest);
            // // console.log(databaseRequest.rows)
        });
        connection.connect();
        console.log('After .connect' + output);
    }

    createBook(req: Request, res: Response) {
        // TODO: implement functionality
        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
    }
}

export default new BookController().router;
