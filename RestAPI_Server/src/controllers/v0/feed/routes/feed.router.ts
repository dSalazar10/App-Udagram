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
import {config} from '../../../../config/config';
import {s3} from '../../../../aws';
import * as fs from 'fs';

const router: Router = Router();
const axios = require('axios');

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
// Post an image
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




router.patch('/demo/:id', requireAuth, async (req: Request, res: Response) => {
    // Required id parameter
    const { id } = req.params;
    // Verify parameters
    if ( !id ) {
        return res.status(400).send(`id is required.`);
    }
    const token_bearer = req.headers.authorization.split(' ');
    if (token_bearer.length !== 2) {
        return res.status(401).send({ message: 'Malformed token.' });
    }
    // Search for the image to be filtered
    const item: FeedItem = await FeedItem.findByPk(id);
    if (!item) {
        return res.status(400).send('item not found.');
    }
    filterImage(token_bearer[1], item, 'sepia', res).then( (response) => {
        res.status(200);
        // if (!f_image_name) {
        //     // Update the item with the filtered url
        //     item.update({
        //         caption: item.caption,
        //         originalUrl: item.originalUrl,
        //         filterURL: f_image_name
        //     }).then( (updated_item) => {
        //         updated_item.originalUrl = AWS.getGetSignedUrl(updated_item.originalUrl);
        //         updated_item.filterUrl = AWS.getGetSignedUrl(updated_item.filterUrl);
        //         res.status(200).send(updated_item);
        //     }).catch( (update_throw) => {
        //         console.log(update_throw);
        //     });
        // }
    });
})

async function filterImage(token: string, item: FeedItem, type: string, res: Response): Promise<string> {
    const host: string = config.dev.filter_host;
    const image: string = AWS.getGetSignedUrl(item.url);
    const path = `${host}/api/v0/filter/${type}?image_url=${image}`;
    // Set the headers for the Filter Request
    // Request for an image to be filtered
    const data = JSON.stringify({
        image_url: `${image}`
    });
    const headers = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    axios.post(path, data, headers).then( (getResponse: any) => {
        res.send(getResponse.data);

        // const fileName = `${__dirname}/filtered.${item.url}`;
        // fs.writeFile(`${fileName}.1.png`, getResponse.data, (err) => {});
        // const base64Image = Buffer.from(getResponse.data, 'binary').toString('base64');
        // const decodedImage = Buffer.from(base64Image, 'base64').toString('binary');
        // fs.writeFile(`${fileName}.2.png`, decodedImage, function(err) {});

        // const encoded_data = getResponse.data.split(',')[1];
        // const image_data = new Uint8Array(Buffer.from('Test'));
        // fs.writeFile(fileName, image_data, (err) => {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log('File saved.');
        //         res.sendFile(fileName);
        //         // fs.readFile(fileName, function(err, fileData) {
        //         //     s3.putObject({
        //         //         Bucket: config.dev.aws_media_bucket,
        //         //         Key: fileName,
        //         //         Body: fileData
        //         //     }, function(putObject_err, putObject_data) {
        //         //         console.log('uploaded');
        //         //     });
        //         // });
        //         return true;
        //     }
        // });

    });
    return '';
}

export const FeedRouter: Router = router;
