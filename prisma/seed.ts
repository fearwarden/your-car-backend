import { PrismaClient, Car } from "@prisma/client";
import { cars } from "../src/resources/cars";

const prisma = new PrismaClient();

async function main() {
  const payload = await prisma.car.createMany({
    data: cars,
  });
  console.log(payload);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
