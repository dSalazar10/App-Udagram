import { Router, Request, Response } from 'express';
import * as EmailValidator from "email-validator";
import fs from 'fs';
import Jimp = require('jimp');

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
async function filterImageFromURL(inputURL: string): Promise<string> {
    return new Promise( async resolve => {
        const photo = await Jimp.read(inputURL);
        const outPath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
        await photo
            .resize(256, 256) // resize
            .quality(60) // set JPEG quality
            .greyscale() // set greyscale
            .write(__dirname+outPath, (img)=>{
                resolve(__dirname+outPath);
            });
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
async function deleteLocalFiles(files: Array<string>) {
    for( let file of files) {
        fs.unlinkSync(file);
    }
}


// Filter an image based on a public url
router.get( "/demo", async ( req: Request, res:Response ) => {
    const email = req.body.email;
    const password = req.body.password;
    // Verify email, verify password, validate email
    if (!email || !password || !EmailValidator.validate(email) ) {
        return res.status(400).send({ auth: false, message: `Failed to authenticate.` });
    }
    // VERY BAD - storing a single user/pass in proc env and compare in memory
    // A quick and easy way to block public access
    // @TODO: upgrade security
    if (email !== process.env.ISERVER_USER) {
        return res.status(400).send({ auth: false, message: `Failed to authenticate.` });
    }
    if (password !== process.env.ISERVER_PASSWORD) {
        return res.status(400).send({ auth: false, message: `Failed to authenticate.` });
    }
    // URL of a publicly accessible image
    const { image_url } = req.query;
    // Verify query and validate url
    if ( !image_url || !isImageUrl(image_url) ) {
        res.status(400).send(`image_url required`);
    }
    // Validate url
    urlExists(image_url).then(function(exists: { href: any; }){
        if (!exists) {
            return res.status(400).send(`bad image_url`);
        } else {
            // Filter the image
            filterImageFromURL(image_url).then( (data) => {
                // Send the resulting file in the response
                res.sendFile(data, {}, function (err) {
                    if (err) {
                        throw err;
                    } else {
                        // Deletes any files on the server on finish of the response
                        deleteLocalFiles([data]).catch( (err) => {
                            if (err) {
                                return res.status(400).send(`bad image_url`);
                            }
                        });
                    }
                });
            }).catch( (err) => {
                if (err) {
                    throw err;
                }
            })
        }
    });
});

export const FilterRouter: Router = router;
