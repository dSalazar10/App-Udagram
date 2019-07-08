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
import {Router, Request, Response} from 'express';
import {User} from '../models/User';
import {AuthRouter} from './auth.router';

const router: Router = Router();
// Route to auth.router.index for /auth
router.use('/auth', AuthRouter);

/* Endpoints */

// Display info for /user
router.get('/', async (req: Request, res: Response) => {
    res.send('<!doctype html>\n' +
        '\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '  <meta charset="utf-8">\n' +
        '  <title>Udagram</title>\n' +
        '  <meta name="description" content="Udagram">\n' +
        '  <meta name="author" content="Daniel">\n' +
        '</head>\n' +
        '\n' +
        '<body>\n' +
        '    <p>Nothing to see here.</p>\n' +
        '</body>\n' +
        '</html>\n');
});
// Search for a specific user
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await User.findByPk(id);
    res.send(item);
});

export const UserRouter: Router = router;
