import { Car, MediaInPost, Post, Price, Media } from "@prisma/client";
import * as bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}

export function generateLink(id: string, action: string): string {
  const link = `${process.env.WEBSITE_URL}/${action}/${id}`;
  return link;
}

export function allPostsObject(
  posts: Post[],
  cars: Car[],
  prices: (Price | null)[],
  mediaInPosts: MediaInPost[][],
  medias: (Media[] | null)[]
) {
  return posts.map((post, i) => {
    const postMediaInPosts = mediaInPosts[i];
    const postMedias = medias.flat(); // Flatten medias array

    // Create a new array of medias where each media corresponds to a mediaInPost
    const correspondingMedias = postMediaInPosts.map((mediaInPost) => {
      return postMedias.find((media) => media!.id === mediaInPost.mediaId);
    });

    return {
      post: post,
      car: cars[i],
      price: prices[i],
      mediaInPosts: postMediaInPosts,
      medias: correspondingMedias,
    };
  });
}
