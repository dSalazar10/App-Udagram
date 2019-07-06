import { Router, Request, Response } from 'express';
import { FeedItem } from '../models/FeedItem';
import { requireAuth } from '../../users/routes/auth.router';
import * as AWS from '../../../../aws';

const router: Router = Router();
const axios = require('axios');

// @TODO: connect to Image Filter Server
async function filterImage(image_url: string, token: string) {
    const host = 'http://localhost:8082/api/v0/filter/demo?image_url=';
    const sessionUrl = `${host}${image_url}`;
    const uname = 'hello@world.com';
    const pass = 'fancypass';
    axios.get(sessionUrl, {}, {
        auth: {
            token: token,
            user: {
                email: 'hello@world.com'
            }
        }
    }).then(function(response) {
        console.log('Authenticated');
    }).catch(function(error) {
        console.log({msg: 'Error on Authentication', err: error});
    });
}
router.get('/demo',
    requireAuth,
    async (req: Request, res: Response) => {
    const config = {
        headers: {
            authorization: req.headers.authorization,
        }
    }
    const url = 'http://localhost:8082/api/v0/filter/demo?image_url=https://timedotcom.files.wordpress.com/2019/03/kitten-report.jpg';
    axios.get(url, config)
        .then((response: any) => {
            res.status(200).send(response);
        }).catch((error: any) => {
            console.log(error);
        });
});

// Get all feed items
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
