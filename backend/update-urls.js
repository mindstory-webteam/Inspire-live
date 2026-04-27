const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/inspire');

const collections = ['services', 'teams', 'blogs', 'banners', 'events', 'resourcepeople', 'testimonials'];

function replaceUrls(obj) {
  if (typeof obj === 'string') {
    return obj.replace(/https:\/\/res\.cloudinary\.com\/[^\s"']+/g, (match) => {
      const filename = match.split('/').pop().split('?')[0];
      return `http://187.127.151.100:5000/uploads/${filename}`;
    });
  }
  if (Array.isArray(obj)) return obj.map(replaceUrls);
  if (obj && typeof obj === 'object' && !mongoose.Types.ObjectId.isValid(obj)) {
    const result = {};
    for (const key of Object.keys(obj)) {
      result[key] = replaceUrls(obj[key]);
    }
    return result;
  }
  return obj;
}

async function run() {
  await new Promise(r => mongoose.connection.once('open', r));
  const db = mongoose.connection;

  for (const col of collections) {
    const docs = await db.collection(col).find({}).toArray();
    for (const doc of docs) {
      const id = doc._id;
      delete doc._id;
      const updated = replaceUrls(doc);
      await db.collection(col).updateOne({ _id: id }, { $set: updated });
      console.log(`✅ Updated ${col}: ${id}`);
    }
  }
  console.log('✅ All URLs updated!');
  process.exit(0);
}

run().catch(console.error);






