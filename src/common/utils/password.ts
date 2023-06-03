import { genSalt, compare, hash } from 'bcrypt';

const SALT_ROUNDS: number = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10;

export async function hashPassword(plainTextPassword: string): Promise<string> {
	const salt = await genSalt(SALT_ROUNDS);
	return await hash(plainTextPassword, salt);
}

export async function verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
	return compare(plainTextPassword, hashedPassword);
}