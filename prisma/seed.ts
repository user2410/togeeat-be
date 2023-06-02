import { PrismaClient } from "@prisma/client";
import seedMatchings from "./seedings/matching";

const prisma = new PrismaClient();

async function main() {
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