import { Router, Request, Response } from 'express';
import fs from 'fs';
import { existsSync } from 'fs';
import Jimp = require('jimp');
import { spawn } from 'child_process';
import {requireAuth} from '../../users/routes/auth.router';
const cv = require('opencv4nodejs');

const router: Router = Router();

// Path to the filter programs
const filter_path = 'src/controllers/v0/filter/filters';

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

// saveImage
// helper function to save the filtered image locally
// returns the absolute path to the local image and the file's name
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file and the file's name
async function saveImage(inputURL: string) {
    const outPath = '/tmp/input/';
    const fileName = Math.floor(Math.random() * 2000) + '.jpg';
    const photo = await Jimp.read(inputURL);
    await photo.write(__dirname + outPath + fileName);
    return [__dirname + outPath, fileName];
}

// router.get( '/', requireAuth, async ( req: Request, res: Response ) => {
//     // Type of filter, URL of a publicly accessible image
//     const { type, image_url } = req.query;
//     // Verify type query
//     if ( !type ) {
//         res.status(400).send(`type required`);
//     }
//     // Verify image_url query and validate url
//     if ( !image_url || !isImageUrl(image_url) ) {
//         res.status(400).send(`image_url required`);
//     }
//
//     // Validate url
//     urlExists(image_url).then(function(exists: { href: any; }) {
//         if (!exists) {
//             return res.status(400).send(`bad image_url`);
//         } else { // URL points to a publicly accessible image
//             // Download the image to local storage
//             saveImage(image_url).then( ([path, fileName]) => {
//                 // Path to the downloaded image
//                 const original = path + fileName;
//                 // BAD - Wait for the file to finish downloading
//                 while (!existsSync(original)) { /* blocking polling loop */}
//                 // TODO: Try adding a second OpenCV filter script
//                 //       and add an additional parameter to select
//                 //       which filter to use as a POST parameter
//                 // Fork a new process - canny filter
//                 const pythonProcess = spawn('python3', [
//                     // function's path
//                     `${filter_path}/canny.py`,
//                     // function's arguments
//                     path, fileName
//                 ], {}).on('error', function( err ) {
//                     throw err;
//                 });
//                 if (pythonProcess !== undefined) {
//                     pythonProcess.stdout.on('data', () => {
//                         const filtered = path + 'filtered.' + fileName;
//                         // BAD - Wait for the file to finish being filtered
//                         while (!existsSync(filtered)) { /* blocking polling loop */}
//                         // Send the resulting file in the response
//                         res.sendFile(filtered, {}, function (err: any) {
//                             if (err) {
//                                 console.log(err);
//                             } else {
//                                 // Deletes any files on the server on finish of the response
//                                 deleteLocalFiles([path + fileName, filtered])
//                                     .catch((derr: any) => {
//                                     if (derr) {
//                                         return res.status(400).send(`bad image_url`);
//                                     }
//                                 });
//                             }
//                         });
//                     });
//                 }
//             });
//         }
//     });
// });

export const FilterRouter: Router = router;
