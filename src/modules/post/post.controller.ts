// Packges
import { Request, Response } from "express";
import {
  Post,
  Price,
  PrismaClient,
  Car,
  MediaInPost,
  Media,
  Prisma,
} from "@prisma/client";
import { v4 as uuid } from "uuid";
// DTOs
import { createPostDto } from "./dto/createPost.dto";
import { getPostDto } from "./dto/getPost.dto";
import { MediaInPostInterface } from "./dto/media.interface";
// Helpers
import RESTResponse from "../../utils/RESTResponse";
import { HTTPResponses } from "../../constants/HTTPResponses";
import { filterPosts } from "../../utils/helperFunctions";
import { handlePostPictures } from "../../utils/fileSystem/postPictures";

const prisma: PrismaClient = new PrismaClient();

export class PostController {
  // TODO: Treba ubaciti logiku i implementaciju za priority slika
  static async create(req: Request, res: Response): Promise<Response> {
    const payload = req.body;
    const images: any = req.files;
    const userId: any = req.user;
    const validation = createPostDto.safeParse(payload);
    if (!validation.success) throw validation.error;

    // TODO: when front is finished, delete this piece of logic, its only because of postman
    // also change vlaidation in `createPostDto`
    if (payload.used === "true") {
      payload.used = true;
    } else {
      payload.used = false;
    }

    if (payload.fixed === "true") {
      payload.fixed = true;
    } else {
      payload.fixed = false;
    }

    const car: Car | null = await prisma.car.findFirst({
      where: {
        brand: payload.brand,
        model: payload.model,
        used: payload.used,
        bodyType: payload.bodyType,
        drivetrain: payload.drivetrain,
        engine: payload.engine,
        horsePower: parseInt(payload.horsePower),
        transmission: payload.transmission,
        fuelType: payload.fuelType,
        exteriorColor: payload.exteriorColor,
        interiorColor: payload.interiorColor,
      },
    });

    const price: Price | null = await prisma.price.create({
      data: {
        price: payload.price,
        currency: payload.currency,
        fixed: payload.fixed,
      },
    });

    const media: any = await prisma.$transaction(
      images.image.map((image: any) =>
        prisma.media.create({
          data: {
            path: image.name,
          },
        })
      )
    );

    const cursorId = uuid();

    const post: Post | null = await prisma.post.create({
      data: {
        description: payload.description,
        country: payload.country,
        year: parseInt(payload.year),
        mileage: payload.mileage,
        priceId: price.id,
        carId: car!.id,
        userId: userId.id,
        cursor: cursorId,
      },
    });

    let imagePriority: MediaInPostInterface[] = [];

    const medias = await prisma.media.findMany();
    media.map((image: any, index: number) => {
      imagePriority.push({
        postId: post!.id,
        mediaId: image.id,
        priority: index,
      });
    });
    const mediaInPost = await prisma.mediaInPost.createMany({
      data: imagePriority,
    });

    handlePostPictures(images, userId.id, post.id);
    return res
      .status(201)
      .send(RESTResponse.createResponse(true, HTTPResponses.OK, { post }));
  }

  /**
   * It gets a post from the database and returns it with the price, car, mediaInPost and medias associated
   * with it.
   * </code>
   * @param {Request} req - Request, res: Response
   * @param {Response} res - Response - Express response object
   * @returns {
   *   "success": true,
   *   "message": "OK",
   *   "data": {
   *     "post": {...},
   *     "price": {...},
   *     "car": {...},
   *     "mediaInPost": {...},
   *      "media": {...}
   *    }
   * }
   */
  static async getPost(req: Request, res: Response): Promise<Response> {
    const postId = req.params.id;
    const validation = getPostDto.safeParse({ postId });
    if (!validation.success) throw validation.error;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    const price = await prisma.price.findUnique({
      where: {
        id: post?.priceId,
      },
    });

    const car = await prisma.car.findUnique({
      where: {
        id: post?.carId,
      },
    });

    const mediaInPost = await prisma.mediaInPost.findMany({
      where: {
        postId: post?.id,
      },
    });

    const medias = await prisma.$transaction(
      mediaInPost.map((media) =>
        prisma.media.findUnique({ where: { id: media.mediaId } })
      )
    );

    return res.status(202).send(
      RESTResponse.createResponse(true, HTTPResponses.OK, {
        post,
        price,
        car,
        mediaInPost,
        medias,
      })
    );
  }

  /**
   * This function retrieves a specified number of posts from a database, along with associated data
   * such as prices, cars, and media, and returns it in a response object.
   * @param {Request} req - The request object containing information about the incoming HTTP request.
   * @param {Response} res - `res` is the response object that will be sent back to the client with the
   * HTTP response.
   * @returns a Promise that resolves to a Response object. The Response object contains a status code
   * of 202 and a JSON object with a boolean value indicating success, an HTTP response message, and a
   * data object that contains information about posts, cars, prices, mediaInPosts, and medias.
   */
  static async getAllPosts(req: Request, res: Response): Promise<Response> {
    const { lastCursor, items } = req.query;

    const numberOfPosts =
      typeof items === "string" ? parseInt(items, 10) || 10 : 10;
    let parsedLastCursor =
      typeof lastCursor === "string" ? lastCursor : undefined;

    let posts: Post[];
    if (parsedLastCursor) {
      posts = await prisma.post.findMany({
        take: numberOfPosts,
        skip: 0,
        cursor: {
          cursor: parsedLastCursor,
        },
      });
    } else {
      posts = await prisma.post.findMany({
        take: numberOfPosts,
        skip: 0,
      });
    }

    const prices: (Price | null)[] = await prisma.$transaction(
      posts.map((post) =>
        prisma.price.findFirst({
          where: {
            post: post,
          },
        })
      )
    );

    let cars: any = [];
    const allCars = await prisma.car.findMany();
    for (let i = 0; i < posts.length; i++) {
      for (let j = 0; j < allCars.length; j++) {
        if (posts[i].carId === allCars[j].id) {
          cars.push(allCars[j]);
        }
      }
    }

    const mediaInPosts: MediaInPost[][] = await prisma.$transaction(
      posts.map((post: Post) =>
        prisma.mediaInPost.findMany({
          where: {
            post: post,
          },
        })
      )
    );
    let medias: (Media[] | null)[] = [];
    await Promise.all(
      mediaInPosts.map(async (media) => {
        const result = await prisma.$transaction(
          media.map((item) =>
            prisma.media.findMany({
              where: {
                mediaInPost: item,
              },
            })
          )
        );
        medias = [...medias, ...result];
      })
    );

    const data = filterPosts(posts, cars, prices, mediaInPosts, medias);
    return res
      .status(202)
      .send(RESTResponse.createResponse(true, HTTPResponses.OK, { data }));
  }

  static async deletePost(req: Request, res: Response): Promise<Response> {
    const postId: string = req.params.id;

    const post: Post = await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    const price: Price = await prisma.price.delete({
      where: {
        id: post.priceId,
      },
    });

    const mediaInPosts: MediaInPost[] = await prisma.mediaInPost.findMany({
      where: {
        post: post,
      },
    });

    const deletedMediaInPosts: MediaInPost[] = await prisma.$transaction(
      mediaInPosts.map((mediaInPost) =>
        prisma.mediaInPost.delete({
          where: {
            id: mediaInPost.id,
          },
        })
      )
    );

    //TODO: add to delete medias and images from folder

    return res.status(202).send();
  }
}
