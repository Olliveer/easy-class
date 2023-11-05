const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Music" },
        { name: "Fitness" },
        { name: "Photography" },
        { name: "Accounting" },
        { name: "Filming" },
      ],
    });

    console.log("Seeding completed");
  } catch (error) {
    console.error("Error seeding database", error);
  } finally {
    await database.$disconnect();
  }
}

main();
