// Packges
import { Request, Response } from "express";
import { Post, Price, PrismaClient } from "@prisma/client";
import { createPostDto } from "./dto/createPost.dto";
import RESTResponse from "../../utils/RESTResponse";
import { HTTPResponses } from "../../constants/HTTPResponses";
import { MediaInPostInterface, MediaInterface } from "./dto/media.interface";
import { getPostDto } from "./dto/getPost.dto";
import { allPostsObject } from "../../utils/helperFunctions";

export class PostController {
  static prisma: PrismaClient = new PrismaClient();

  // TODO: Treba ubaciti logiku i implementaciju za priority slika
  // TODO: Treba implementirati i upload slika (cuvati u uploads folderu)
  static async create(req: Request, res: Response): Promise<Response> {
    const payload = req.body;
    const userId: any = req.user;
    try {
      createPostDto.parse(payload);
    } catch (error) {
      return res
        .status(401)
        .send(
          RESTResponse.createResponse(false, HTTPResponses.INVALID_DATA, {})
        );
    }

    let car: any;
    try {
      car = await this.prisma.car.findFirst({
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
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send(
          RESTResponse.createResponse(false, HTTPResponses.BAD_REQUEST, {})
        );
    }

    let price: Price | null;
    try {
      price = await this.prisma.price.create({
        data: {
          price: payload.price,
          currency: payload.currency,
          fixed: payload.fixed,
        },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send(
          RESTResponse.createResponse(false, HTTPResponses.BAD_REQUEST, {})
        );
    }

    let images: MediaInterface[] = [];
    payload.imagePaths.map((image: string) => {
      images.push({
        path: image,
      });
    });
    let media: any;
    try {
      media = await this.prisma.$transaction(
        images.map((image) => this.prisma.media.create({ data: image }))
      );
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send(
          RESTResponse.createResponse(false, HTTPResponses.BAD_REQUEST, {})
        );
    }
    let post: Post | null;
    try {
      post = await this.prisma.post.create({
        data: {
          description: payload.description,
          country: payload.country,
          year: payload.year,
          mileage: payload.mileage,
          priceId: price.id,
          carId: car.id,
          userId: userId.id,
        },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send(
          RESTResponse.createResponse(false, HTTPResponses.BAD_REQUEST, {})
        );
    }

    let imagePriority: MediaInPostInterface[] = [];
    try {
      const medias = await this.prisma.media.findMany();
      media.map((image: any, index: number) => {
        imagePriority.push({
          postId: post!.id,
          mediaId: image.id,
          priority: index,
        });
      });
    } catch (error) {}

    let mediaInPost;
    try {
      mediaInPost = await this.prisma.mediaInPost.createMany({
        data: imagePriority,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send(
          RESTResponse.createResponse(false, HTTPResponses.BAD_REQUEST, {})
        );
    }
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
    try {
      getPostDto.parse({ postId });
    } catch (error) {
      return res
        .status(401)
        .send(
          RESTResponse.createResponse(false, HTTPResponses.INVALID_DATA, {})
        );
    }

    let post;
    try {
      post = await this.prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send(
          RESTResponse.createResponse(
            false,
            HTTPResponses.INTERNAL_SERVER_ERROR,
            {}
          )
        );
    }
    let price;
    try {
      price = await this.prisma.price.findUnique({
        where: {
          id: post?.priceId,
        },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send(
          RESTResponse.createResponse(
            false,
            HTTPResponses.INTERNAL_SERVER_ERROR,
            {}
          )
        );
    }
    let car;
    try {
      car = await this.prisma.car.findUnique({
        where: {
          id: post?.carId,
        },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send(
          RESTResponse.createResponse(
            false,
            HTTPResponses.INTERNAL_SERVER_ERROR,
            {}
          )
        );
    }
    let mediaInPost;
    try {
      mediaInPost = await this.prisma.mediaInPost.findMany({
        where: {
          postId: post?.id,
        },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send(
          RESTResponse.createResponse(
            false,
            HTTPResponses.INTERNAL_SERVER_ERROR,
            {}
          )
        );
    }
    let medias;
    try {
      medias = await this.prisma.$transaction(
        mediaInPost.map((media) =>
          this.prisma.media.findUnique({ where: { id: media.mediaId } })
        )
      );
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send(
          RESTResponse.createResponse(
            false,
            HTTPResponses.INTERNAL_SERVER_ERROR,
            {}
          )
        );
    }
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

  // TODO: Implement pagination
  static async getAllPosts(req: Request, res: Response): Promise<Response> {
    let posts: any;
    try {
      posts = await this.prisma.post.findMany();
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send(
          RESTResponse.createResponse(
            false,
            HTTPResponses.INTERNAL_SERVER_ERROR,
            {}
          )
        );
    }
    let prices;
    try {
      prices = await this.prisma.price.findMany();
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send(
          RESTResponse.createResponse(
            false,
            HTTPResponses.INTERNAL_SERVER_ERROR,
            {}
          )
        );
    }
    let cars: any = [];
    try {
      const allCars = await this.prisma.car.findMany();
      for (let i = 0; i < posts.length; i++) {
        for (let j = 0; j < allCars.length; j++) {
          if (posts[i].carId === allCars[j].id) {
            cars.push(allCars[j]);
          }
        }
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send(
          RESTResponse.createResponse(
            false,
            HTTPResponses.INTERNAL_SERVER_ERROR,
            {}
          )
        );
    }
    let mediaInPosts;
    try {
      mediaInPosts = await this.prisma.mediaInPost.findMany();
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send(
          RESTResponse.createResponse(
            false,
            HTTPResponses.INTERNAL_SERVER_ERROR,
            {}
          )
        );
    }
    let medias;
    try {
      medias = await this.prisma.media.findMany();
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send(
          RESTResponse.createResponse(
            false,
            HTTPResponses.INTERNAL_SERVER_ERROR,
            {}
          )
        );
    }
    const data = allPostsObject(posts, cars, prices, mediaInPosts, medias);
    return res
      .status(202)
      .send(RESTResponse.createResponse(true, HTTPResponses.OK, data));
  }
}
