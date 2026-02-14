import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

async function restoreDatabase() {
    const backupDir = path.join(process.cwd(), 'backups');

    if (!fs.existsSync(backupDir)) {
        console.error('No backups folder found');
        return;
    }

    // Find latest backup
    const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.sql'));
    if (files.length === 0) {
        console.error('No backup files found');
        return;
    }

    // Sort by name (timestamp) descending
    const latestBackup = files.sort().reverse()[0];
    const backupPath = path.join(backupDir, latestBackup);

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error('DATABASE_URL is not defined');
        return;
    }

    console.log(`Restoring from ${backupPath}...`);
    console.log('WARNING: This will overwrite current data.');

    try {
        // Use psql to restore
        await execAsync(`psql "${dbUrl}" < "${backupPath}"`);
        console.log('Database successfully restored.');
    } catch (error) {
        console.error('Restore failed:', error);
    }
}

restoreDatabase().catch(console.error);
