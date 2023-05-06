// Packges
import { Request, Response } from "express";
import { Post, Price, PrismaClient, Car } from "@prisma/client";
import { createPostDto } from "./dto/createPost.dto";
import RESTResponse from "../../utils/RESTResponse";
import { HTTPResponses } from "../../constants/HTTPResponses";
import { MediaInPostInterface, MediaInterface } from "./dto/media.interface";
import { getPostDto } from "./dto/getPost.dto";
import { allPostsObject } from "../../utils/helperFunctions";

const prisma: PrismaClient = new PrismaClient();

export class PostController {
  // TODO: Treba ubaciti logiku i implementaciju za priority slika
  // TODO: Treba implementirati i upload slika (cuvati u uploads folderu)
  static async create(req: Request, res: Response): Promise<Response> {
    const payload = req.body;
    const userId: any = req.user;
    const validation = createPostDto.safeParse(payload);
    if (!validation.success) throw validation.error;

    const car: Car | null = await prisma.car.findFirst({
      where: {
        brand: payload.brand,
        model: payload.model,
        used: payload.used,
        bodyType: payload.bodyType,
        drivetrain: payload.drivetrain,
        engine: payload.engine,
        horsePower: payload.horsePower,
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

    let images: MediaInterface[] = [];
    payload.imagePaths.map((image: string) => {
      images.push({
        path: image,
      });
    });
    const media: any = await prisma.$transaction(
      images.map((image) => prisma.media.create({ data: image }))
    );

    const post: Post | null = await prisma.post.create({
      data: {
        description: payload.description,
        country: payload.country,
        year: payload.year,
        mileage: payload.mileage,
        priceId: price.id,
        carId: car!.id,
        userId: userId.id,
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
    const posts = await prisma.post.findMany();
    const prices = await prisma.price.findMany();

    let cars: any = [];
    const allCars = await prisma.car.findMany();
    for (let i = 0; i < posts.length; i++) {
      for (let j = 0; j < allCars.length; j++) {
        if (posts[i].carId === allCars[j].id) {
          cars.push(allCars[j]);
        }
      }
    }

    const mediaInPosts = await prisma.mediaInPost.findMany();
    const medias = await prisma.media.findMany();

    const data = allPostsObject(posts, cars, prices, mediaInPosts, medias);
    return res
      .status(202)
      .send(RESTResponse.createResponse(true, HTTPResponses.OK, data));
  }
}
