import { Router, Request, Response } from 'express';
import fs, {existsSync} from 'fs';
import Jimp = require('jimp');
import { requireAuth } from '../../users/routes/auth.router';

const router: Router = Router();
const download = require('image-downloader')
const cv = require('opencv4nodejs');

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
async function filterImageFromURL(inputURL: string): Promise<string> {
    return new Promise( async resolve => {
        const photo = await Jimp.read(inputURL);
        const outPath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
        await photo
            .resize(256, 256) // resize
            .quality(60) // set JPEG quality
            .greyscale() // set greyscale
            .write(__dirname + outPath, () => {
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
router.get( '/demo', requireAuth, async ( req: Request, res: Response ) => {
    // URL of a publicly accessible image
    const { image_url } = req.query;
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
            filterImageFromURL(image_url).then( (data) => {
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


router.get( '/', requireAuth, async ( req: Request, res: Response ) => {
    // Type of filter, URL of a publicly accessible image
    const {type, image_url} = req.query;
    // Verify type query
    if (!type) {
        res.status(400).send(`type required`);
    }
    // Verify image_url query and validate url
    if (!image_url || !isImageUrl(image_url)) {
        res.status(400).send(`image_url required`);
    }
    // Validate url
    urlExists(image_url).then(function (exists: { href: any; }) {
        if (!exists) {
            return res.status(400).send(`bad image_url`);
        } else {// URL points to a valid public image file
            const path = __dirname + '/tmp/';
            const fileName = Math.floor(Math.random() * 2000) + '.jpg';
            // Download the image from the URL and store it in /tmp/
            download.image({url: image_url, dest: path + fileName})
                .then((response: { filename: any, image: any }) => {
                    // BAD - wait for the file to finish downloading
                    while (!existsSync(response.filename)) { /* blocking polling loop */}
                    // Read the image into a cv matrix
                    const mat = cv.imread(path + fileName);
                    // Apply the canny filter
                    mat.canny(50, 50, 3);
                    // Write the filtered file to /tmp/
                    cv.imwrite(path + 'filtered.' + fileName, mat);
                    // respond with the image file
                    res.sendFile(path + 'filtered.' + fileName, {}, function (err: any) {
                        if (err) {
                            console.error(err);
                        } else {
                            // Deletes any files on the server on finish of the response
                            deleteLocalFiles([response.filename, path + 'filtered.' + fileName])
                                .catch( (derr: any) => {
                                    console.error(derr);
                                });
                        }
                    });
                }).catch((err: any) => {
                    console.error(err);
                });
        }
    });
});



export const FilterRouter: Router = router;
