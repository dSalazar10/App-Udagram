/* MIT License

Copyright (c) 2019 Daniel Salazar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import express, { Request, Response, Router } from 'express';
import { IndexRouter } from './controllers/v0/index.router';
import bodyParser from 'body-parser';
import { V0MODELS } from './controllers/v0/model.index';
import { sequelize } from './sequelize';

(async () => {

  await sequelize.addModels(V0MODELS);
  await sequelize.sync();

  const app = express();
  const port = process.env.PORT || 8082;

  app.use(bodyParser.json());

  // CORS Should be restricted
  app.use(function(req: any,
                   res: { header: {
                     (arg0: string, arg1: string): void;
                     (arg0: string, arg1: string): void;
                   }; }, next: () => void) {
    // This is the port that the Ionic Server uses
    res.header('Access-Control-Allow-Origin', 'http://localhost:8100');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });

  app.use('/api/v0/', IndexRouter);

  // Root URI call
  app.get( '/', async ( req: any, res: { send: (arg0: string) => void; } ) => {
    res.send( '/api/v0/' );
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  });
})();
