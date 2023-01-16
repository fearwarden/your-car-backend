import * as bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}

export function generateLink(id: number | string, action: string) {
  if (typeof id === "number") {
    id = id.toString();
  }
  const link = `${process.env.WEBSITE_URL}/${action}/${id}`;
  return link;
}
