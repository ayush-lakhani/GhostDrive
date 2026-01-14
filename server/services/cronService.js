const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const File = require('../models/File');

const startCron = () => {
    // Run every 60 seconds
    cron.schedule('*/60 * * * * *', async () => {
        console.log('💀 The Reaper is checking for expired souls...');
        
        try {
            const now = new Date();
            
            // Find expired files
            const expiredFiles = await File.find({ expiryDate: { $lt: now } });

            if (expiredFiles.length > 0) {
                console.log(`Found ${expiredFiles.length} expired files. Executing...`);

                for (const file of expiredFiles) {
                    const filePath = path.join(__dirname, '../uploads', file.safeName);
                    
                    // 1. Delete physical file
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        console.log(`- Deleted physical file: ${file.safeName}`);
                    }

                    // 2. Delete database record
                    await File.deleteOne({ _id: file._id });
                    console.log(`- Deleted database record: ${file._id}`);
                }
            } else {
                console.log('No expired files found.');
            }

        } catch (err) {
            console.error('Error in Reaper service:', err);
        }
    });
};

module.exports = startCron;
