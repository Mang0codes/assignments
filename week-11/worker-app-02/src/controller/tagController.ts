// getTags , getPostsByTag

import { Prisma, PrismaClient } from "@prisma/client/edge";
import { Context } from "hono";

export async function getTags(c: Context){
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    });
    try{
        const tags = await prisma.tags.findMany();
        return c.json({
            tags: tags,
        });
    }catch(err){
     return c.body(`Internal server error ${err}`, 500);
    }
}

export async function getPostsByTag(c: Context){
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    });
try {
    const tagExist = await prisma.tags.findFirst({
        where: {
            tag: String(c.req.param('tag')),
        }
    });
    if(tagExist == null){
        return c.body("Tag does not exist", 404);
    }

    const res = await prisma.tags.findMany({
        where: {
            tag: String(c.req.param('tag')),
        },
        select: {
        post: {
            select: {
                User: { select: { username: true } },
                id: true,
                userId: true,
                title: true,
                body: true,
                createdAt: true,
            },
        },
    },
    });

    return c.json({
           posts: res[0].post.map((post: any) => ({
            username: post.User.username,
            id: post.id,
            title: post.title,
            body: post.body,
            createdAt: post.createdAt,
           })),
    });
}   catch(err){
    return c.body(`Internal server error ${err}`, 500);
}
}