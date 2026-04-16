const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/inspire');

const collections = ['services', 'teams', 'blogs', 'banners', 'events', 'resourcepeople', 'testimonials'];

function downloadFile(fileUrl, dest) {
  return new Promise((resolve) => {
    if (!fileUrl || !fileUrl.includes('cloudinary')) return resolve();
    const file = fs.createWriteStream(dest);
    const protocol = fileUrl.startsWith('https') ? https : http;
    protocol.get(fileUrl, res => {
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', () => { fs.unlink(dest, () => {}); resolve(); });
  });
}

async function run() {
  await new Promise(r => mongoose.connection.once('open', r));
  const db = mongoose.connection;
  const uploadDir = '/var/www/Inspire-live/backend/public/uploads';
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  for (const col of collections) {
    const docs = await db.collection(col).find({}).toArray();
    for (const doc of docs) {
      const str = JSON.stringify(doc);
      const matches = str.match(/https:\/\/res\.cloudinary\.com\/[^"\\]+/g) || [];
      for (const imgUrl of matches) {
        const filename = path.basename(imgUrl.split('?')[0]);
        const dest = `${uploadDir}/${filename}`;
        if (!fs.existsSync(dest)) {
          console.log('Downloading:', filename);
          await downloadFile(imgUrl, dest);
        } else {
          console.log('Already exists:', filename);
        }
      }
    }
  }
  console.log('✅ Done!');
  process.exit(0);
}

run().catch(console.error);
