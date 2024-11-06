import { PrismaClient } from "@prisma/client/edge";
import {withAccelerate} from "@prisma/extension-accelerate"
import { Context } from "hono";
import { Jwt } from "hono/utils/jwt";
import { userSigninSchema, userSignupSchema } from "../zod/user";


export async function signup(c: Context){
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());

       try {
        const body: {
              username : string;
              password : string;
              email    : string;
        }  = await c.req.json();

        const parsedUser = userSignupSchema.safeParse(body);

        if(!parsedUser.success){
            return c.body("Invalid user input", 400);
        }

        const userExists = await prisma.user.findFirst({
            where: { email: body.email },
        });

        if(userExists){
            return c.body("USer already exists", 400)
        }

        const response = await prisma.user.create({
            data: {
                username: body.username,
                password: body.password,
                email: body.email
            },
        });

        const userId = response.id;
        const token = await Jwt.sign({userId} , c.env.JWT_TOKEN);

        return c.json({
            msg: 'User created successfully!!',
            token: token,
            user: {
                userId: response.id,
                username: response.username,
                email: response.email,
            },
        });
       } catch(err){
        return c.body(`Internal server error ${err}`, 500);
       }
}

export async function signin(c: Context){
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try{ 
        const body : {
            email: string,
            password: string,
        } = await c.req.json()

        const parsedUser = userSigninSchema.safeParse(body);

        if(!parsedUser.success){
            return c.body("Invalid user input", 400);
        }

        const response = await prisma.user.findFirst({
            where: {
                email: body.email,
                password: body.password,
            },
        });

        if(response == null){
            return c.body("Invalid userId", 404);
        }

        const userId = response.id;
        const token = Jwt.sign({userId}, c.env.JWT_TOKEN);
    
            return c.json({
                msg: "Signed in successfully",
               token: token,
            user: {
                userId: userId,
                username: response.username,
                email: response.email,
            },
            });

        } catch (error) {
            return c.body(`Internal server error: ${error}`, 500);
        }
    }

export async function userProfile(c: Context){
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
        const user = await prisma.user.findFirst({
            where: {
                id: Number(c.req.param('id')),
            },
            include: {
                post: true,
            },
        });
        if(user == null){
            return c.body("Invalid userId", 404);
        }
        else{
            return c.json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    posts: user.post,
                }
            });
        }
    } catch(err){
        return c.body(`Internal server error: ${err}`, 500);
    }
}    

export async function getAllUsers(c: Context){
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());
    
    try {
    const response = await prisma.user.findMany();
    return c.json({
        users: response.map((user: any) => ({
            id:  user.id,
            email: user.email,
            username: user.username,
    })),
    });
} catch(err){
    return c.body(`Internal server error: ${err}`, 500);
}
}