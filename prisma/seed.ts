import { PrismaClient } from "@prisma/client";
import seedMatchings from "./seedings/matching";
import seedUsers from "./seedings/user";

const prisma = new PrismaClient();

async function main() {
	await seedUsers(prisma);
	await seedMatchings(prisma);
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		// close Prisma Client at the end
		await prisma.$disconnect();
	});