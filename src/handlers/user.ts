import { Request, Response } from 'express';
import { createJWT, hashPassword, comparePasswords } from '../auth/auth';
// import db from '../server'
import db from '../moresecureserver'

export const createNewUser = async (req: Request, res: Response) => {
    let existingUser;
    try {
        existingUser = await db.get(req.body.username);
        console.log(existingUser)
    } catch (err : any) {
        if (!err.notFound) {
            throw err; // rethrow if it's a different error
        }
    }

    if (existingUser) {
        res.status(400).json({ message: 'Username already exists' });
        return;
    } else {
        db.put(req.body.username, {
                    password: await hashPassword(req.body.password),
                    data: {}
                })
    }
    
    // const user = await prisma.user.create({
    //     data: {
    //         username: req.body.username,
    //         password: await hashPassword(req.body.password),
    //     }
    // })

    // // used copilot to do this...
    const token = createJWT({
        id: req.body.username,
        username: req.body.username
    }, '1h');

    // // equivalent to { token: token }
    res.json({ token });
}

export const signin = async (req: Request, res: Response) => {
    let existingUser;
    try {
        existingUser = await db.get(req.body.username);
    } catch (err : any) {
        if (!err.notFound) {
            throw err; // rethrow if it's a different error
        }
    }
    
    // typescript wants you to make sure user is not null
    if (!existingUser) {
        res.status(401)
        res.json({message: 'Unauthorized'})
        return
    }

    const isValid = await comparePasswords(req.body.password, existingUser["password"]);
    if (!isValid) {
        res.status(401)
        res.json({message: 'Unauthorized'})
        return
    }

    const token = createJWT({
        id: req.body.username,
        username: req.body.username
    }, '1h');
    

    // equivalent to { token: token }
    res.json({ token });
}

export const getUserData = async (req: Request, res: Response) => {
    res.json(await db.get(req.body.username))
    res.status(200)
};

export const updateUserData = async (req: Request, res: Response) => {
    await db.del(req.body.username)
    db.put(req.body.username, {
        password: await hashPassword(req.body.password),
        data: req.body.data
    })
    res.status(200)
    res.send("Success.")
}