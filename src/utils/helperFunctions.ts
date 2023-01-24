import { Car, MediaInPost, Post, Price, Media } from "@prisma/client";
import * as bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}

export function generateLink(id: string, action: string) {
  const link = `${process.env.WEBSITE_URL}/${action}/${id}`;
  return link;
}

// TODO: finish filtering function
export function allPostsObject(
  posts: Post[],
  cars: Car[],
  prices: Price[],
  mediaInPosts: MediaInPost[],
  medias: Media[]
) {
  return {
    posts,
    cars,
    prices,
    mediaInPosts,
    medias,
  };
}
