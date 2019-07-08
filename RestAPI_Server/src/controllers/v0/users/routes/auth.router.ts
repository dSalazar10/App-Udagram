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
import {User} from '../models/User';
import {NextFunction} from 'connect';
import {config} from '../../../../config/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as EmailValidator from 'email-validator';

const router: Router = Router();

/* Helper Functions */

// Generate a salted password hash using Javascript Web Tokens
async function generatePassword(plainTextPassword: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plainTextPassword, salt);
}
// Compare a given password with the stored password hash
async function comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hash);
}
// Generate a Javascript Web Token using a given email
function generateJWT(user: User): string {
    return jwt.sign(user.short(), config.dev.jwt_secret);
}
// Validate authentication provided
export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).send({ message: 'No authorization headers.' });
    }
    const token_bearer = req.headers.authorization.split(' ');
    if (token_bearer.length != 2) {
        return res.status(401).send({ message: 'Malformed token.' });
    }
    const token = token_bearer[1];
    return jwt.verify(token, config.dev.jwt_secret, (err, decoded) => {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
      }
      return next();
    });
}

/* Endpoints */

router.get('/', async (req: Request, res: Response) => {
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
        '    <p>/auth</p>\n' +
        '</body>\n' +
        '</html>\n');
});
// Verify credentials are valid
router.get('/verification',
    requireAuth,
    async (req: Request, res: Response) => {
        return res.status(200).send({ auth: true, message: 'Authenticated.' });
});
// Login with username and password
router.post('/login', async (req: Request, res: Response) => {
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

    res.status(200).send({ auth: true, token: generateJWT(user), user: user.short()});
});

// register a new user
router.post('/', async (req: Request, res: Response) => {
    const email = req.body.email;
    const plainTextPassword = req.body.password;
    // check email is valid
    if (!email || !EmailValidator.validate(email)) {
        return res.status(400).send({ auth: false, message: 'Email is required or malformed' });
    }

    // check email password valid
    if (!plainTextPassword) {
        return res.status(400).send({ auth: false, message: 'Password is required' });
    }

    // find the user
    const user = await User.findByPk(email);
    // check that user doesnt exists
    if (user) {
        return res.status(422).send({ auth: false, message: 'User may already exist' });
    }

    const password_hash = await generatePassword(plainTextPassword);

    const newUser = await new User({
        email: email,
        password_hash: password_hash
    });

    let savedUser;
    try {
        savedUser = await newUser.save();
    } catch (e) {
        throw e;
    }

    res.status(201).send({token: generateJWT(savedUser), user: savedUser.short()});
});

export const AuthRouter: Router = router;
