const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getCurrentTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-');
}

function createBackupDirectory() {
    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }
    return backupDir;
}

function getNextBackupNumber(backupDir) {
    const backups = fs.readdirSync(backupDir);
    const numbers = backups
        .map(b => parseInt(b.split('_')[0]))
        .filter(n => !isNaN(n));
    return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
}

function backupProject() {
    try {
        const backupDir = createBackupDirectory();
        const nextNumber = getNextBackupNumber(backupDir);
        const timestamp = getCurrentTimestamp();
        const backupName = `${nextNumber}_${timestamp}`;
        const backupPath = path.join(backupDir, backupName);

        // Create backup directory
        fs.mkdirSync(backupPath);

        // Copy all files except node_modules and backups
        const excludes = ['node_modules', 'backups', '.git'];
        const projectRoot = path.join(__dirname, '..');
        
        fs.readdirSync(projectRoot).forEach(item => {
            if (!excludes.includes(item)) {
                const sourcePath = path.join(projectRoot, item);
                const targetPath = path.join(backupPath, item);
                
                if (fs.lstatSync(sourcePath).isDirectory()) {
                    execSync(`xcopy "${sourcePath}" "${targetPath}" /E /I /H /Y`);
                } else {
                    fs.copyFileSync(sourcePath, targetPath);
                }
            }
        });

        console.log(`Backup created successfully: ${backupName}`);
        return true;
    } catch (error) {
        console.error('Backup failed:', error);
        return false;
    }
}

function revertToBackup(backupName) {
    try {
        const backupDir = createBackupDirectory();
        const backupPath = path.join(backupDir, backupName);
        const projectRoot = path.join(__dirname, '..');

        if (!fs.existsSync(backupPath)) {
            console.error('Backup not found:', backupName);
            return false;
        }

        // Create temporary backup of current state
        const tempBackup = `temp_${getCurrentTimestamp()}`;
        const tempPath = path.join(backupDir, tempBackup);
        fs.mkdirSync(tempPath);

        // Backup current state (excluding node_modules and backups)
        const excludes = ['node_modules', 'backups', '.git'];
        fs.readdirSync(projectRoot).forEach(item => {
            if (!excludes.includes(item)) {
                const sourcePath = path.join(projectRoot, item);
                const targetPath = path.join(tempPath, item);
                
                if (fs.lstatSync(sourcePath).isDirectory()) {
                    execSync(`xcopy "${sourcePath}" "${targetPath}" /E /I /H /Y`);
                } else {
                    fs.copyFileSync(sourcePath, targetPath);
                }
            }
        });

        // Remove current files (except excluded ones)
        fs.readdirSync(projectRoot).forEach(item => {
            if (!excludes.includes(item)) {
                const itemPath = path.join(projectRoot, item);
                if (fs.lstatSync(itemPath).isDirectory()) {
                    fs.rmSync(itemPath, { recursive: true });
                } else {
                    fs.unlinkSync(itemPath);
                }
            }
        });

        // Copy backup files to project root
        fs.readdirSync(backupPath).forEach(item => {
            const sourcePath = path.join(backupPath, item);
            const targetPath = path.join(projectRoot, item);
            
            if (fs.lstatSync(sourcePath).isDirectory()) {
                execSync(`xcopy "${sourcePath}" "${targetPath}" /E /I /H /Y`);
            } else {
                fs.copyFileSync(sourcePath, targetPath);
            }
        });

        console.log(`Successfully reverted to backup: ${backupName}`);
        console.log(`Previous state backed up as: ${tempBackup}`);
        return true;
    } catch (error) {
        console.error('Revert failed:', error);
        return false;
    }
}

// Execute based on command
const command = process.argv[2];

switch (command) {
    case 'backup':
        backupProject();
        break;
    case 'list':
        const backupDir = createBackupDirectory();
        const backups = fs.readdirSync(backupDir);
        console.log('Available backups:');
        backups.forEach(b => console.log(b));
        break;
    case 'remove':
        const backupToRemove = process.argv[3];
        if (!backupToRemove) {
            console.error('Please specify backup to remove');
            break;
        }
        const bDir = createBackupDirectory();
        const backupPath = path.join(bDir, backupToRemove);
        if (fs.existsSync(backupPath)) {
            fs.rmSync(backupPath, { recursive: true });
            console.log(`Removed backup: ${backupToRemove}`);
        } else {
            console.error('Backup not found');
        }
        break;
    case 'revert':
        const backupName = process.argv[3];
        if (!backupName) {
            console.error('Please specify backup name to revert to');
            break;
        }
        revertToBackup(backupName);
        break;
    default:
        console.log('Unknown command. Use: backup, list, remove, or revert');
}
