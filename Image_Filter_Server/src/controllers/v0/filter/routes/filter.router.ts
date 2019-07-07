import { Router, Request, Response } from 'express';
import fs from 'fs';
import Jimp = require('jimp');
import { requireAuth } from '../../users/routes/auth.router';
const router: Router = Router();

// Validate URL
// Does it contain an image file type?
const isImageUrl = require('is-image-url');

// Verify URL
// Does it exist?
const urlExists = require('url-exists-deep');

async function greyFilter(photo: Jimp) {
    photo.resize(256, 256)
        .quality(60)
        .greyscale();
    return photo;
}
async function sepiaFilter(photo: Jimp) {
    photo.resize(256, 256)
        .quality(60)
        .sepia();
    return photo;
}
async function blurFilter(photo: Jimp) {
    photo.resize(256, 256)
        .quality(60)
        .blur(7);
    return photo;
}
async function gaussianFilter(photo: Jimp) {
    photo.resize(256, 256)
        .quality(60)
        .gaussian(7);
    return photo;
}
async function mirrorFilter(photo: Jimp) {
    photo.resize(256, 256)
        .quality(60)
        .mirror(true, false);
    return photo;
}
async function invertFilter(photo: Jimp) {
    photo.resize(256, 256)
        .quality(60)
        .invert();
    return photo;
}

// filterImage
// Validates the URL, filters the image, sends it back, and deletes local files
// INPUTS
//     image_url: string - the url of a publicly accessible image
//     res: Response - the calling function's response variable
//     type: number - the filter requested
// RETURNS
//     nothing
async function filterImage(image_url: string, res: Response, type: number) {
    // Validate url
    urlExists(image_url).then(function(exists: { href: any; }) {
        if (!exists) {
            return res.status(400).send(`${image_url} does not exist.`);
        } else {
            // Filter the image
            filterImageFromURL(image_url, type).then( (data) => {
                // Send the resulting filtered image to caller
                res.sendFile(data, {}, function (send_err: any) {
                    if (!send_err) {
                        // Deletes any files on the server on finish of the response
                        deleteLocalFiles([data]).catch( (del_err: any) => {
                            if (!del_err) {
                                return res.status(400).send(`bad image_url`);
                            } else {
                                console.log(del_err);
                            }
                        }).catch( (del_throw) => {
                            console.log(del_throw);
                        });
                    } else {
                        console.log(send_err);
                    }
                });
            }).catch( (send_throw) => {
                console.log(send_throw);
            });
        }
    });
}

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
async function filterImageFromURL(inputURL: string, type: number): Promise<string> {
    return new Promise( async resolve => {
        const photo: Jimp = await Jimp.read(inputURL);
        const outPath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
        switch (type) {
            case 1:
                await greyFilter(photo).then( (img) => {
                    img.write(__dirname + outPath, () => {
                        resolve(__dirname + outPath);
                    });
                });
                break;
            case 2:
                await sepiaFilter(photo).then( (img) => {
                    img.write(__dirname + outPath, () => {
                        resolve(__dirname + outPath);
                    });
                });
                break;
            case 3:
                await blurFilter(photo).then( (img) => {
                    img.write(__dirname + outPath, () => {
                        resolve(__dirname + outPath);
                    });
                });
                break;
            case 4:
                await gaussianFilter(photo).then( (img) => {
                    img.write(__dirname + outPath, () => {
                        resolve(__dirname + outPath);
                    });
                });
                break;
            case 5:
                await mirrorFilter(photo).then( (img) => {
                    img.write(__dirname + outPath, () => {
                        resolve(__dirname + outPath);
                    });
                });
                break;
            default:
                await invertFilter(photo).then( (img) => {
                    img.write(__dirname + outPath, () => {
                        resolve(__dirname + outPath);
                    });
                });
        }
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
* 6) invert
* */
router.get( '/', requireAuth, async ( req: Request, res: Response ) => {
    // URL of a publicly accessible image
    const { image_url } = req.query;
    // Verify query and validate url
    if ( !image_url || !isImageUrl(image_url) ) {
        res.status(400).send(`image_url required`);
    }
    filterImage(image_url, res)
        .catch( (filter_throw) => {
            console.log(filter_throw);
        });

});

router.post('/grey', requireAuth, async ( req: Request, res: Response ) => {});


export const FilterRouter: Router = router;
