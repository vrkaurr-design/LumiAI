import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function resetDatabase() {
    console.log('Resetting database...');
    try {
        // Check if we are in production
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Cannot reset database in production environment!');
        }

        // Run prisma migrate reset
        await execAsync('npx prisma migrate reset --force');
        console.log('Database reset complete.');
    } catch (error) {
        console.error('Reset failed:', error);
    }
}

resetDatabase().catch(console.error);
