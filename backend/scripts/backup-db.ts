import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

async function backupDatabase() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups');
    const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);

    // Ensure backup directory exists
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error('DATABASE_URL is not defined');
        return;
    }

    console.log(`Starting backup to ${backupFile}...`);

    try {
        // Use pg_dump. NOTE: Requires pg_dump to be in PATH.
        // Extracts connection info from URL or passes it directly if valid for pg_dump
        // A simple way is to pass the URL to pg_dump using user:password@host...

        // CAUTION: Passing password on command line can be insecure. 
        // Ideally use .pgpass or PGPASSWORD env var.

        await execAsync(`pg_dump "${dbUrl}" > "${backupFile}"`, {
            env: { ...process.env } // Pass env to ensure PGPASSWORD would work if set separately
        });

        console.log(`Database successfully backed up to: ${backupFile}`);
    } catch (error) {
        console.error('Backup failed:', error);
    }
}

backupDatabase().catch(console.error);
