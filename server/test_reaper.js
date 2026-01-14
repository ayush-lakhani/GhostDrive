const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

// Create a dummy file
const testFilePath = path.join(__dirname, 'test-ghost.txt');
fs.writeFileSync(testFilePath, 'This is a ghost file destined to die.');

const uploadFile = async () => {
    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(testFilePath));
        form.append('duration', '1'); // 1 minute

        console.log('📤 Uploading file...');
        const response = await axios.post('http://localhost:5000/api/upload', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log('✅ Upload Successful:', response.data);
        const safeName = response.data.file.safeName;

        console.log(`⏱️ Waiting for 70 seconds to verify deletion (Expiry: 1 min)...`);
        
        setTimeout(() => {
            // Check if file status via API
            axios.get(`http://localhost:5000/api/download/${safeName}`)
                .then(() => {
                    console.log('❌ Test Failed: File still exists and is downloadable.');
                })
                .catch(err => {
                    if (err.response && (err.response.status === 404 || err.response.status === 410)) {
                        console.log('✅ Test Passed: API returned 404/410.');
                    } else {
                        console.log('❓ Unexpected Error:', err.message);
                    }
                });
                
        }, 70000);

    } catch (err) {
        console.error('❌ Upload Failed:', err.message);
        if (err.response) console.error(err.response.data);
    }
};

// Wait for server to start roughly
setTimeout(uploadFile, 5000);
