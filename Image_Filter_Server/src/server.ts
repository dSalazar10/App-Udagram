import express, { Request, Response } from "express";
import bodyParser from 'body-parser';
import * as jwt from 'jsonwebtoken';
import * as EmailValidator from 'email-validator';
import * as bcrypt from 'bcrypt';
import { NextFunction } from 'connect';

import { filterImageFromURL, deleteLocalFiles } from './util/util';
import {config} from "./config/config";
import { User } from "./User";
import { sequelize } from "./sequelize";


(async () => {

    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 8082;
    
    // Set up Sequelize
    await sequelize.addModels([User]);
    await sequelize.sync();

    // Use the body parser middleware for post requests
    app.use(bodyParser.json());

    // Root Endpoint
    // Displays a simple message to the user
    app.get( "/", async ( req: Request, res:Response ) => {
        res.send("try GET /filteredimage?image_url={{}}")
    } );

    // endpoint to filter an image from a public url
    app.get( "/filteredimage/", requireAuth, async ( req: Request, res:Response ) => {
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
    
    /**********************************************************************/

    function requireAuth(req: Request, res: Response, next: NextFunction) {
        // Make sure there is a request header present and includes an authentication header
        if (!req.headers || !req.headers.authorization) {
            // User not allowed - terminate flow
            return res.status(401).send({ message: `No authorization headers.` });
        }
        // If we do have a header, then split it into salt and hash
        const token_bearer = req.headers.authorization.split(' ');
        // Check to see if there are actually two parts
        // tslint:disable-next-line:triple-equals
        if (token_bearer.length != 2) {
            return res.status(401).send({ message: `Malformed token.` });
        }
        const token = token_bearer[1];
        // Verify if the token is valid
        return jwt.verify(token, config.jwt.secret, (err, decoded) => {
            // Not valid
            if (err) {
                return res.status(500).send({ auth: false, message: `Failed to authenticate.` });
            }
            // Valid
            return next();
        });
    }

    async function comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(plainTextPassword, hash);
    }

    function generateJWT(user: User): string {
        return jwt.sign(user.short(), config.jwt.secret);
    }

    // Login with current user
    app.post('/login', async (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;
        // check email is valid
        if (!email || !EmailValidator.validate(email)) {
            return res.status(400).send({ auth: false, message: 'Email is required or malformed' });
        }

        // check email password valid
        if (!password) {
            return res.status(400).send({ auth: false, message: 'Password is required' });
        }

        const user = await User.findByPk(email);
        // check that user exists
        if (!user) {
            return res.status(401).send({ auth: false, message: 'Unauthorized' });
        }

        // check that the password matches
        const authValid = await comparePasswords(password, user.password_hash);

        if (!authValid) {
            return res.status(401).send({ auth: false, message: 'Unauthorized' });
        }
        // Responds with jwt and email
        res.status(200).send({ auth: true, token: generateJWT(user), user: user.short()});
    });

    /**********************************************************************/


    // Start the Server
    app.listen( port, () => {
        console.log( `server running http://localhost:${ port }` );
        console.log( `press CTRL+C to stop server` );
    } );
})();
