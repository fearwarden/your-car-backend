// Packges
import { Request, Response } from "express";
import { Car, Media, Post, Price, PrismaClient } from "@prisma/client";
import { createPostDto } from "./dto/createPost.dto";
import RESTResponse from "../../utils/RESTResponse";
import { HTTPResponses } from "../../constants/HTTPResponses";
import { MediaInPostInterface, MediaInterface } from "./dto/media.interface";

export class PostController {
  static prisma: PrismaClient = new PrismaClient();

  // TODO: Treba ubaciti logiku i implementaciju za priority slika
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
}
