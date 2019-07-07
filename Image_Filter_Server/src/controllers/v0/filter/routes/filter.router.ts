import { Router, Request, Response } from 'express';
import fs, {existsSync} from 'fs';
import Jimp = require('jimp');
import { requireAuth } from '../../users/routes/auth.router';
const router: Router = Router();

// Validate URL
// Does it contain an image file type?
const isImageUrl = require('is-image-url');

// Verify URL
// Does it exist?
const urlExists = require('url-exists-deep');

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
async function filterImageFromURL(inputURL: string, type: number): Promise<string> {
    return new Promise( async resolve => {
        const photo = await Jimp.read(inputURL);
        const outPath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
        switch (type) {
            case 1: await photo
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .greyscale(); // set greyscale
            break;
            case 2: await photo
                .sepia()
                .resize(256, 256) // resize
                .quality(60); // set JPEG quality
            break;
            case 3: await photo
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .blur(7);
            break;
            case 4: await photo
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .gaussian(7);
            break;
            case 5: await photo
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .mirror(true, false);
            break;
            default: await photo
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .autocrop();
        }
        await photo.write(__dirname + outPath, () => {
                resolve(__dirname + outPath);
            });
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
async function deleteLocalFiles(files: Array<string>) {
    for ( const file of files) {
        fs.unlinkSync(file);
    }
}

// Filter an image based on a public url
/* /api/v0/filter/?type=&?url=
* 1) grey
* 2) sepia
* 3) blur
* 4) gaussian
* 5) mirror
* */
router.get( '/', requireAuth, async ( req: Request, res: Response ) => {
    // URL of a publicly accessible image
    const { type, image_url } = req.query;
    // Verify query and validate url
    if ( !image_url || !isImageUrl(image_url) ) {
        res.status(400).send(`image_url required`);
    }
    // Validate url
    urlExists(image_url).then(function(exists: { href: any; }) {
        if (!exists) {
            return res.status(400).send(`bad image_url`);
        } else {
            // Filter the image
            filterImageFromURL(image_url, type).then( (data) => {
                // Send the resulting file in the response
                res.sendFile(data, {}, function (err: any) {
                    if (err) {
                        throw err;
                    } else {
                        // Deletes any files on the server on finish of the response
                        deleteLocalFiles([data]).catch( (derr: any) => {
                            if (derr) {
                                return res.status(400).send(`bad image_url`);
                            }
                        });
                    }
                });
            }).catch( (err) => {
                if (err) {
                    throw err;
                }
            });
        }
    });
});


export const FilterRouter: Router = router;
