import * as bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}

export function generateLink(id: string, action: string) {
  const link = `${process.env.WEBSITE_URL}/${action}/${id}`;
  return link;
}
