import { Router, Request, Response } from 'express';
import { FeedItem } from '../models/FeedItem';
import { requireAuth } from '../../users/routes/auth.router';
import * as AWS from '../../../../aws';
import {config} from '../../../../config/config';
import {s3} from '../../../../aws';

const router: Router = Router();
const axios = require('axios');


// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
    items.rows.map((item) => {
            if (item.originalUrl) {
                if (item.filterUrl) {
                    item.filterUrl = AWS.getGetSignedUrl(item.filterUrl);
                }
                item.originalUrl = AWS.getGetSignedUrl(item.originalUrl);
            }
    });
    res.send(items);
});

// Get a specific resource
router.get('/:id',
    async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await FeedItem.findByPk(id);
    res.send(item);
});

async function filterImage(token: string, id: number, type: string) {
    // Search for the image to be filtered
    const item: FeedItem = await FeedItem.findByPk(id);
    const host: string = config.dev.filter_host;
    const image: string = AWS.getGetSignedUrl(item.originalUrl);
    // Set the headers for the Filter Request
    const getConfig = {
        headers: {
            authorization: `Bearer ${token}`
        }
    };
    // Request for an image to be filtered
    axios.post(`${host}/api/v0/filter/${type}?image_url=${image}`, getConfig)
        .then( (getResponse: { data: any; }) => {
            const filtered_image = new Buffer(getResponse.data).toString('base64');
            const f_image_name = 'filtered.' + item.originalUrl;
            // Store the filtered image in S3
            s3.putObject({
                Body: filtered_image,
                Bucket: config.dev.aws_media_bucket,
                Key: f_image_name
            });
            // Update the item with the filtered url
            const updated_item = item.update({
                'caption': item.caption,
                'originalUrl': item.originalUrl,
                'filteredURL': f_image_name
            }).catch( (update_throw) => {
                console.log(update_throw);
            });
            /* Do we return the new image?? */
        })
        .catch(function (post_throw: any) {
            console.log(post_throw);
        });
}

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
        const fileName = req.body.original;
        const filteredFileName = req.body.filtered;
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
            'originalUrl': fileName,
            'filteredURL': filteredFileName
        });
        updated_item.originalUrl = AWS.getGetSignedUrl(updated_item.originalUrl);
        res.status(200).send(updated_item);
});


// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName',
    requireAuth,
    async (req: Request, res: Response) => {
    const { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({url: url});
});

// Post meta data and the filename after a file is uploaded
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
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
