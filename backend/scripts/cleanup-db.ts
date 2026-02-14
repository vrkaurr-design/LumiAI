import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupDatabase() {
    const args = process.argv.slice(2);
    const command = args[0]; // 'purge' or 'restore'

    if (!command) {
        console.error('Please specify a command: "purge" or "restore"');
        process.exit(1);
    }

    try {
        if (command === 'purge') {
            console.log('Permanently deleting inactive users and products...');

            const deletedUsers = await prisma.user.deleteMany({
                where: { isActive: false },
            });
            console.log(`Deleted ${deletedUsers.count} inactive users.`);

            const deletedProducts = await prisma.product.deleteMany({
                where: { isActive: false },
            });
            console.log(`Deleted ${deletedProducts.count} inactive products.`);

        } else if (command === 'restore') {
            console.log('Restoring all inactive users and products...');

            const restoredUsers = await prisma.user.updateMany({
                where: { isActive: false },
                data: { isActive: true },
            });
            console.log(`Restored ${restoredUsers.count} users.`);

            const restoredProducts = await prisma.product.updateMany({
                where: { isActive: false },
                data: { isActive: true },
            });
            console.log(`Restored ${restoredProducts.count} products.`);
        } else {
            console.error('Unknown command. Use "purge" or "restore".');
        }
    } catch (error) {
        console.error('Cleanup failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanupDatabase();
