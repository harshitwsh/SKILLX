/**
 * SKILLX - Built-in MongoDB CLI Inspector (Zero Extension Required)
 * Run in VS Code Terminal with: node view_db.js [collection_name]
 * Examples:
 *   node view_db.js           (shows summary of all collections)
 *   node view_db.js projects  (shows all projects in a table)
 *   node view_db.js users     (shows all users)
 *   node view_db.js apps      (shows all applications)
 */

require('dotenv').config();
const mongoose = require('mongoose');

const target = process.argv[2] ? process.argv[2].toLowerCase() : 'all';

async function inspectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env');
    process.exit(1);
  }

  console.log('🔄 Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  console.log(`✅ Connected to Cloud Database: [${mongoose.connection.name}]\n`);

  if (target === 'all') {
    const collections = await db.listCollections().toArray();
    console.log('====================================================');
    console.log('📊 MONGODB ATLAS DATABASE OVERVIEW');
    console.log('====================================================');

    const summary = [];
    for (const c of collections) {
      const count = await db.collection(c.name).countDocuments();
      summary.push({ 'Collection (Table)': c.name, 'Total Documents': count });
    }
    console.table(summary);

    console.log('\n💡 Tip: View detailed records by running:');
    console.log('   node view_db.js projects');
    console.log('   node view_db.js applications');
    console.log('   node view_db.js users');
    console.log('   node view_db.js profiles\n');

  } else if (target === 'projects' || target === 'project') {
    const projects = await db.collection('projects').find({}).toArray();
    console.log(`=== 📁 PROJECTS COLLECTION (${projects.length} records) ===`);
    const tableData = projects.map(p => ({
      ID: p.id,
      Title: p.title.length > 28 ? p.title.substring(0, 25) + '...' : p.title,
      Category: p.category,
      Budget: `₹${p.budget}`,
      Client: p.client ? p.client.name : 'Client',
      Applicants: p.applicants || 0
    }));
    console.table(tableData);

  } else if (target === 'applications' || target === 'apps' || target === 'app') {
    const apps = await db.collection('applications').find({}).toArray();
    console.log(`=== 📁 APPLICATIONS COLLECTION (${apps.length} records) ===`);
    const tableData = apps.map(a => ({
      ID: a.id,
      Project: a.projectTitle.length > 25 ? a.projectTitle.substring(0, 22) + '...' : a.projectTitle,
      Client: a.clientName,
      Budget: a.budget,
      Status: a.status,
      Submitted: new Date(a.submittedAt).toLocaleDateString()
    }));
    console.table(tableData);

  } else if (target === 'users' || target === 'user') {
    const users = await db.collection('users').find({}).toArray();
    console.log(`=== 📁 USERS COLLECTION (${users.length} records) ===`);
    const tableData = users.map(u => ({
      Name: u.name,
      Email: u.email,
      Role: u.role,
      Batch: u.batch || "Batch of '26",
      College: u.college || "Campus Engineering"
    }));
    console.table(tableData);

  } else if (target === 'profiles' || target === 'profile') {
    const profiles = await db.collection('profiles').find({}).toArray();
    console.log(`=== 📁 PROFILES COLLECTION (${profiles.length} records) ===`);
    console.log(JSON.stringify(profiles, null, 2));

  } else {
    console.log(`Unknown collection '${target}'. Try: projects, applications, users, profiles`);
  }

  await mongoose.disconnect();
}

inspectDb().catch(err => {
  console.error('❌ Error inspecting MongoDB:', err.message);
  process.exit(1);
});
