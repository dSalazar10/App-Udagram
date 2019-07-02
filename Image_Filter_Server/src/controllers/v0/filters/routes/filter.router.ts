import { Router, Request, Response } from 'express';
import { requireAuth } from '../../users/routes/auth.router';
import fs from 'fs';
import Jimp = require('jimp');

const router: Router = Router();

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
    return new Promise( async resolve => {
        const photo = await Jimp.read(inputURL);
        const outpath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
        await photo
            .resize(256, 256) // resize
            .quality(60) // set JPEG quality
            .greyscale() // set greyscale
            .write(__dirname + outpath, (img) => {
                resolve(__dirname + outpath);
            });
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
    for ( const file of files) {
        fs.unlinkSync(file);
    }
}
// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    res.send(`auth`);
});

// endpoint to filter an image from a public url
router.get( '/filteredimage/', requireAuth, async ( req: Request, res: Response ) => {
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
        });
    });
});

export const FilterRouter: Router = router;
