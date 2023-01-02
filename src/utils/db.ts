import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["error", "warn"],
  errorFormat: "minimal",
});

export default prisma;
