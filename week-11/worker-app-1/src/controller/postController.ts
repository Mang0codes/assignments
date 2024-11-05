import { Prisma, PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";



export async function getPosts(c: Context){
    const prisma = await PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try{
        const response = await prisma.posts.findMany({
            include:{
                tags: true,
                User: true,
            }
        });
        
        return c.json({
            posts: response.map((res: any) => (
                {
                    id: res.id,
                    username: res.User.username,
                    userId: res.User.id,
                    title: res.title,
                    body: res.body,
                    tags: res.tags,
                    createdAt: res.createdAt,
                }
            )),
        });
    } catch (err){
           return c.body(`Internal server error`, 500);
    }
}

export async function getUserPosts(c: Context){
    const prisma = await PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try{
        const response = await prisma.posts.findMany({
            where: {
                userId : (c.get('userId')),
            },
        });
        return c.json({
            post: response,
        });
    } catch(err){
        return c.body(`Internal server error`, 500);
    }
}

export async function createPost(c: Context){
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    });

     try{
        const body:{
            title: string,
            body: string,
            tags: string,
        } = await c.req.json();

        const tagNames = body.tags.split(",").map((tag) => tag.trim())
        if(body.body == null || body.title == null){
            return c.body("Invalid inputs",400);
        }


        const response = await prisma.posts.create({
            data: {
                title: body.title,
                body: body.body,
                userId: c.get('userId'), 
                tags: {
                    connectOrCreate: tagNames.map((tag) => ({
                      where: {tag},
                      create: {tag},
                    })),
                },
            },
            include: {
                tags: true,
            },
        });
     } catch(err){
        return c.body(`Internal server error`, 500);
    }
}

export async function getPost(c: Context){
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    });

    try{
        const post = await prisma.posts.findFirst({
              where:{
                id: Number(c.req.param('id')),
                userId: c.get('userId'),
              },
              include: {
                tags: true,
              },
        });

        if(post == null){
            return c.body("Cannot find post", 400);
        }
        return c.json({
            data: {
                id: post.id,
                title: post.title,
                body: post.body,
                tags: post.tags,
                createdAt: post.createdAt,
            },
        });
    }catch(err){
        return c.body(`Internal server error`, 500);    
    }
}

export async function updatePost(c: Context){
     const prisma = new PrismaClient({
        datasourceURl: c.env.DATABASE_URL,
     });

     try{

     const getPost : {
        title: string,
        body: string,
        tags: string,
     } = await c.req.json();

     const tagNames = getPost.tags.split(",").map((tag) => tag.trim())
     const post = await prisma.posts.findFirst({
           where: {
            id: Number(c.req.param('id')),
            userId: c.get('userId'),
           },
     });
     if(post == null)
        return c.body("Cannot find post", 404);

     const response = await prisma.posts.findFirst({
           where: {
            id: Number(c.req.param('id')),
            userId: c.get('userId'),
           },
           data: {
             title: getPost.title,
             body: getPost.body,
             tags: {
                connectOrCreate: tagNames.map((tag) => ({
                    where:  {tag},
                    create: {tag},  
                })),
             },
           },
           include: {
            tags: true,
           },
     });

     return c.json({
        data: {
            id: response.id,
            title: response.title,
            body: response.body,
            tags: response.tags,
            createdAt: response.createdAt,
        },
     });

    } catch(err){
        return c.body(`Internal server error`, 500);  
    }
}

export async function deletePost(c: Context){
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    });
    try{
    const postToDel = await prisma.posts.findFirst({
        where: {
            id: Number(c.req.param('id')),
            userId: c.get('userId'),
        },
    });
    if(postToDel == null){
        return c.body("Cannot find post", 404 );
    }
    
    const response = await prisma.post.delete({
        where: {
            id : Number(c.req.param('id')),
            userId: c.get('userId'),
        },
    });
    return c.json({
        message: "Post deleted",
    });
} catch(err){
    return c.body(`Internal server error ${err}`, 500);
}
}