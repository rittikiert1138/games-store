import 'dotenv/config';
import { db } from '../db';
import { admins } from '../db/schema';
import { hashPassword } from '../lib/auth';

async function main() {
    const email = 'admin@gmail.com';
    const password = 'Secret123';
    const hashedPassword = await hashPassword(password);

    await db.insert(admins).values({
        email,
        password: hashedPassword,
        isActive: true,
    });

    console.log(`Admin created: ${email} / ${password}`);
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
