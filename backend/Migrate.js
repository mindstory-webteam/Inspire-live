require('dotenv').config();
const mongoose = require('mongoose');
const slugify = require('slugify');
const Career = require('./src/models/Career');

async function run() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const careers = await Career.find({
    $or: [{ slug: { $exists: false } }, { slug: '' }, { slug: null }]
  });
  console.log('Found', careers.length, 'careers without slugs');

  for (const c of careers) {
    let base = slugify(c.title, { lower: true, strict: true });
    let slug = base;
    let count = 1;
    while (await Career.exists({ slug, _id: { $ne: c._id } })) {
      slug = base + '-' + count++;
    }
    c.slug = slug;
    await c.save({ validateModifiedOnly: true });
    console.log('  Done:', c.title, '->', slug);
  }

  console.log('Migration complete!');
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });