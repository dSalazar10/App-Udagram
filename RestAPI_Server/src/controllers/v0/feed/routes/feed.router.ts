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
import {FeedItem} from '../models/FeedItem';
import {requireAuth} from '../../users/routes/auth.router';
import * as AWS from '../../../../aws';

const router: Router = Router();

/* Endpoints */

// Get all images
router.get('/', async (req: Request, res: Response) => {
    const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
    items.rows.map((item) => {
        if (item.url) {
            item.url = AWS.getGetSignedUrl(item.url);
        }
    });
    res.send(items);
});
// Get a specific resource
router.get('/:id',
    async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await FeedItem.findByPk(id).catch( (err) => {
        if (err) {
            throw err;
        }
        });
    res.send(item);
});
// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName',
    requireAuth,
    async (req: Request, res: Response) => {
    const { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({url: url});
});
// update a specific resource
router.patch('/:id',
    requireAuth,
    async (req: Request, res: Response) => {
        // Required id parameter
        const { id } = req.params;
        // Verify parameters
        if ( !id ) {
            return res.status(400).send(`id is required.`);
        }
        // Required JSON body
        const caption = req.body.caption;
        const fileName = req.body.url;
        // Verify caption
        if (!caption) {
            return res.status(400).send({ message: 'Caption is required or malformed' });
        }
        // Verify fileName
        if (!fileName) {
            return res.status(400).send({ message: 'File url is required' });
        }
        // Find item based on the search parameter
        const item: FeedItem = await FeedItem.findByPk(id);
        // Update the caption and url
        const updated_item = await item.update({
            'caption': caption,
            'url': fileName
        });
        updated_item.url = AWS.getGetSignedUrl(updated_item.url);
        res.status(200).send(updated_item);
});
// Update a specific image
router.post('/',
    requireAuth,
    async (req: Request, res: Response) => {
    const caption = req.body.caption;
    const fileName = req.body.url;
    // check Caption is valid
    if (!caption) {
        return res.status(400).send({ message: 'Caption is required or malformed' });
    }
    // check Filename is valid
    if (!fileName) {
        return res.status(400).send({ message: 'File url is required' });
    }
    const item = await new FeedItem({
            caption: caption,
            url: fileName
    });
    const saved_item = await item.save();
    saved_item.url = AWS.getGetSignedUrl(saved_item.url);
    res.status(201).send(saved_item);
});

export const FeedRouter: Router = router;
