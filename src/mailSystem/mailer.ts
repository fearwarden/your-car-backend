import nodemailer from "nodemailer";
import { template } from "./template";

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT!),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail(
  from: string,
  to: string,
  subject: string,
  link: string
) {
  await transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: template(to, link),
  });
}
