// Packges
import { Request, Response } from "express";
import {
  Post,
  Price,
  PrismaClient,
  Car,
  MediaInPost,
  Media,
} from "@prisma/client";
import { createPostDto } from "./dto/createPost.dto";
import RESTResponse from "../../utils/RESTResponse";
import { HTTPResponses } from "../../constants/HTTPResponses";
import { MediaInPostInterface, MediaInterface } from "./dto/media.interface";
import { getPostDto } from "./dto/getPost.dto";
import { allPostsObject } from "../../utils/helperFunctions";
import fileUpload from "express-fileupload";
import { handlePostPictures } from "../../utils/fileSystem/postPictures";
import { v4 as uuid } from "uuid";

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

  // TODO: Implement pagination and function to group post with other models (finish allPostsObject function)
  // allPostsObject grupise sve modele posta iz baze u pripadajuci objekat
  // sve povezane modela jedne sa drugim
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
    console.log(medias);
    // TODO filter all data
    //const data = allPostsObject(posts, cars, prices, mediaInPosts, medias);
    return res
      .status(202)
      .send(RESTResponse.createResponse(true, HTTPResponses.OK, {}));
  }
}
