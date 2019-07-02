import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { NextFunction } from 'connect';
import * as EmailValidator from 'email-validator';
import { config } from '../../../../config/config';

const router: Router = Router();

async function generatePassword(plainTextPassword: string): Promise<string> {
    // Results in 1024 rounds
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plainTextPassword, salt);
}

async function comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hash);
}

function generateJWT(user: User): string {
    return jwt.sign(user.short(), config.jwt.secret);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
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

// Verify if authenticated
router.get('/verification', requireAuth, async (req: Request, res: Response) => {
    return res.status(200).send({ auth: true, message: 'Authenticated.' });
});

// Login with current user
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
    // Responds with jwt and email
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

    res.status(200).send({token: generateJWT(savedUser), user: savedUser.short()});
});

router.get('/', async (req: Request, res: Response) => {
    res.send('auth');
});

export const AuthRouter: Router = router;
