import { Router, Request, Response } from 'express';
import { requireAuth } from '../../users/routes/auth.router';
import {deleteLocalFiles, filterImageFromURL} from "../../../../util/util";

const router: Router = Router();

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    res.send(`auth`);
});

// endpoint to filter an image from a public url
router.get( "/filteredimage/", requireAuth, async ( req: Request, res:Response ) => {
    // URL of a publicly accessible image
    const { image_url } = req.query;
    // validate the image_url query
    if ( !image_url ) {
        res.status(400).send(`image_url required`);
    }
    const img_url = req.query.image_url;
    // Filter the image
    filterImageFromURL(img_url).then(async(data) => {
        // Send the resulting file in the response
        res.sendFile(data, {}, function (err) {
            // Deletes any files on the server on finish of the response
            deleteLocalFiles([data]);
        })
    });
});

export const FeedRouter: Router = router;
