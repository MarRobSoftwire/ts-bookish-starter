import { Router, Request, Response } from 'express';

class BookController {
    router: Router;
    Connection = require('tedious').Connection;

    config = {
        server: "localhost:1433", // or "localhost"
        options: {},
        authentication: {
            type: "default",
            options: {  
            userName: "test",
            password: "test",
            }
        }
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
        let connection = new this.Connection(this.config);

        // Setup event handler when the connection is established. 
        connection.on('connect', function(err) {
            if(err) {
                console.log('Error: ', err)
            }
            // If no error, then good to go...
            console.log('i work!')
        });
        connection.connect();
        // TODO: implement functionality
        const sql = await 1;
        return res.status(200).json(sql);
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
