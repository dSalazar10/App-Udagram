import express, { Request, Response, Router } from "express";
import bodyParser from 'body-parser';
import * as EmailValidator from 'email-validator';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Validate URL
  // Does it contain an image file type?
  const isImageUrl = require('is-image-url');

  // Verify URL
  // Does it exist?
  const urlExists = require('url-exists-deep');

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res:Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // Filter an image based on a public url
  app.get( "/filteredimage", async ( req: Request, res:Response ) => {
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

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
