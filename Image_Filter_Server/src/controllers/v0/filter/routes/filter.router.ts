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
import {requireAuth} from '../../users/routes/auth.router';
import fs from 'fs';
import Jimp = require('jimp');

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
// Validates the URL, filters the image, sends image back, and deletes local files
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

/* Endpoints */

// Display information about the API
router.get( '/', async ( req, res ) => {
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
        '    <p>Welcome to the Image Filter API</p>\n' +
        '</body>\n' +
        '</html>\n');
});
// Grey Filter
router.post('/grey', requireAuth, async ( req: Request, res: Response ) => {
    // URL of a publicly accessible image
    const { image_url } = req.body;
    // Verify query and validate url
    if ( !image_url || !isImageUrl(image_url) ) {
        res.status(400).send(`image_url required`);
    }
    filterImage(image_url, res, 1)
        .catch( (filter_throw) => {
            console.log(filter_throw);
        });
});
// Sepia Filter
router.post('/sepia', requireAuth, async ( req: Request, res: Response ) => {
    // URL of a publicly accessible image
    const { image_url } = req.body;
    // Verify query and validate url
    if ( !image_url || !isImageUrl(image_url) ) {
        return res.status(400).send(`image_url required`);
    }
    filterImage(image_url, res, 2)
        .catch( (filter_throw) => {
            console.log(filter_throw);
        });
});
// Blur Filter
router.post('/blur', requireAuth, async ( req: Request, res: Response ) => {
    // URL of a publicly accessible image
    const { image_url } = req.body;
    // Verify query and validate url
    if ( !image_url || !isImageUrl(image_url) ) {
        res.status(400).send(`image_url required`);
    }
    filterImage(image_url, res, 3)
        .catch( (filter_throw) => {
            console.log(filter_throw);
        });
});
// Gaussian Filter
router.post('/gaussian', requireAuth, async ( req: Request, res: Response ) => {
    // URL of a publicly accessible image
    const { image_url } = req.body;
    // Verify query and validate url
    if ( !image_url || !isImageUrl(image_url) ) {
        res.status(400).send(`image_url required`);
    }
    filterImage(image_url, res, 4)
        .catch( (filter_throw) => {
            console.log(filter_throw);
        });
});
// Mirror Filter
router.post('/mirror', requireAuth, async ( req: Request, res: Response ) => {
    // URL of a publicly accessible image
    const { image_url } = req.body;
    // Verify query and validate url
    if ( !image_url || !isImageUrl(image_url) ) {
        res.status(400).send(`image_url required`);
    }
    filterImage(image_url, res, 5)
        .catch( (filter_throw) => {
            console.log(filter_throw);
        });
});
// Invert Filter
router.post('/invert', requireAuth, async ( req: Request, res: Response ) => {
    // URL of a publicly accessible image
    const { image_url } = req.body;
    // Verify query and validate url
    if ( !image_url || !isImageUrl(image_url) ) {
        res.status(400).send(`image_url required`);
    }
    filterImage(image_url, res, 6)
        .catch( (filter_throw) => {
            console.log(filter_throw);
        });
});

export const FilterRouter: Router = router;
