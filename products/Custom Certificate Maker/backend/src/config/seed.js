const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Template = require('../models/Template');
const Certificate = require('../models/Certificate');
const VerificationLog = require('../models/VerificationLog');
const generateCertId = require('../utils/generateCertId');
const { generateQRCodeDataUrl } = require('../utils/qrcode');

dotenv.config({ path: './.env' });

const templatesData = [
  {
    name: 'Canva Modern Blue & Gold',
    category: 'Achievement',
    stylePreset: 'canva-modern-blue-gold',
    orientation: 'landscape',
    isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80',
    designData: {
      background: '#0B192C',
      borderColor: '#D4AF37',
      borderStyle: 'double',
      elements: [
        { type: 'text', text: 'GLOBAL ACADEMY OF EXCELLENCE', font: 'Montserrat', fontSize: 16, color: '#D4AF37', top: 120, left: 960, align: 'center', tracking: 5, bold: true },
        { type: 'text', text: 'CERTIFICATE OF ACHIEVEMENT', font: 'Cinzel', fontSize: 46, color: '#FCD34D', top: 180, left: 960, align: 'center', bold: true },
        { type: 'text', text: 'THIS CERTIFICATE IS PROUDLY PRESENTED TO', font: 'Montserrat', fontSize: 13, color: '#94A3B8', top: 270, left: 960, align: 'center', tracking: 6 },
        { type: 'text', text: '{{recipientName}}', font: 'Playfair Display', fontSize: 58, color: '#F59E0B', top: 340, left: 960, align: 'center', bold: true },
        { type: 'text', text: '{{courseName}}', font: 'Montserrat', fontSize: 32, color: '#FCD34D', top: 550, left: 960, align: 'center', bold: true }
      ]
    }
  },
  {
    name: 'Canva Elegant Gold Frame',
    category: 'Academic',
    stylePreset: 'canva-elegant-gold-frame',
    orientation: 'landscape',
    isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    designData: {
      background: '#FFFDF7',
      borderColor: '#B45309',
      borderStyle: 'ornate-gold',
      elements: [
        { type: 'text', text: 'DIPLOMA OF HIGH EXCELLENCE', font: 'Cinzel', fontSize: 44, color: '#B45309', top: 180, left: 960, align: 'center', bold: true },
        { type: 'text', text: '{{recipientName}}', font: 'Great Vibes', fontSize: 68, color: '#78350F', top: 340, left: 960, align: 'center' },
        { type: 'text', text: '{{courseName}}', font: 'Cinzel', fontSize: 32, color: '#B45309', top: 550, left: 960, align: 'center', bold: true }
      ]
    }
  },
  {
    name: 'Canva Minimalist Crest',
    category: 'Appreciation',
    stylePreset: 'canva-minimal-crest-appreciation',
    orientation: 'landscape',
    isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    designData: {
      background: '#FFFFFF',
      borderColor: '#1E3A8A',
      borderStyle: 'double',
      elements: [
        { type: 'text', text: 'CERTIFICATE OF APPRECIATION', font: 'Montserrat', fontSize: 42, color: '#0F172A', top: 180, left: 960, align: 'center', bold: true },
        { type: 'text', text: '{{recipientName}}', font: 'Montserrat', fontSize: 54, color: '#0F172A', top: 340, left: 960, align: 'center', bold: true },
        { type: 'text', text: '{{courseName}}', font: 'Montserrat', fontSize: 32, color: '#1E3A8A', top: 550, left: 960, align: 'center', bold: true }
      ]
    }
  },
  {
    name: 'Classic Gold Academic',
    category: 'Academic',
    stylePreset: 'classic-gold',
    orientation: 'landscape',
    isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80',
    designData: {
      background: '#FDFBF7',
      borderColor: '#D4AF37',
      borderStyle: 'double',
      elements: [
        { type: 'text', text: 'TECH ACADEMY INSTITUTE OF EDUCATION', font: 'Montserrat', fontSize: 16, color: '#1B365D', top: 120, left: 960, align: 'center', tracking: 4, bold: true },
        { type: 'text', text: 'CERTIFICATE OF ACHIEVEMENT', font: 'Cinzel', fontSize: 44, color: '#D4AF37', top: 180, left: 960, align: 'center', bold: true },
        { type: 'text', text: '{{recipientName}}', font: 'Playfair Display', fontSize: 56, color: '#1B365D', top: 340, left: 960, align: 'center', bold: true },
        { type: 'text', text: '{{courseName}}', font: 'Montserrat', fontSize: 32, color: '#D4AF37', top: 550, left: 960, align: 'center', bold: true }
      ]
    }
  },
  {
    name: 'Luxury Obsidian & Gold',
    category: 'Luxury',
    stylePreset: 'luxury-gold',
    orientation: 'landscape',
    isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    designData: {
      background: '#0F172A',
      borderColor: '#F59E0B',
      borderStyle: 'ornate-gold',
      elements: [
        { type: 'text', text: 'EXECUTIVE DIPLOMA OF HONOR', font: 'Cinzel', fontSize: 44, color: '#FCD34D', top: 180, left: 960, align: 'center', bold: true },
        { type: 'text', text: '{{recipientName}}', font: 'Great Vibes', fontSize: 68, color: '#F59E0B', top: 340, left: 960, align: 'center' },
        { type: 'text', text: '{{courseName}}', font: 'Cinzel', fontSize: 32, color: '#FCD34D', top: 550, left: 960, align: 'center', bold: true }
      ]
    }
  }
];

const seedDB = async () => {
  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/TemplateMaker';
    const conn = await mongoose.connect(dbUri);
    console.log(`[Seed Script] Connected to DB: ${conn.connection.host} / ${conn.connection.name}`);

    // Clear existing collections
    await User.deleteMany({});
    await Organization.deleteMany({});
    await Template.deleteMany({});
    await Certificate.deleteMany({});
    await VerificationLog.deleteMany({});

    console.log('[Seed] Cleared old data.');

    // 1. Create Super Admin
    const adminUser = await User.create({
      name: 'Super Admin',
      email: 'admin@certmaker.com',
      password: 'Admin@123',
      role: 'admin',
      status: 'active'
    });
    console.log('[Seed] Created Super Admin: admin@certmaker.com / Admin@123');

    // 2. Create Organization Owner & Profile
    const orgOwner = await User.create({
      name: 'Dr. Robert Vance',
      email: 'org@techacademy.com',
      password: 'Org@123',
      role: 'organization',
      status: 'active'
    });

    const orgProfile = await Organization.create({
      owner: orgOwner._id,
      name: 'Tech Academy Institute of Software Engineering',
      logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      website: 'https://techacademy.example.com',
      address: '100 Innovation Boulevard, Silicon Valley, CA',
      contactEmail: 'contact@techacademy.com',
      issuerName: 'Dr. Robert Vance',
      issuerDesignation: 'Director of Education',
      signature: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/John_Hancock_signature.svg'
    });

    orgOwner.organizationId = orgProfile._id;
    await orgOwner.save();

    console.log('[Seed] Created Organization: org@techacademy.com / Org@123');

    // 3. Create Recipient User
    const recipientUser = await User.create({
      name: 'Muhammad Ali',
      email: 'student@example.com',
      password: 'Student@123',
      role: 'recipient',
      status: 'active'
    });

    console.log('[Seed] Created Recipient: student@example.com / Student@123');

    // 4. Seed Presets Templates
    const createdTemplates = [];
    for (const t of templatesData) {
      const createdT = await Template.create({
        ...t,
        createdBy: adminUser._id
      });
      createdTemplates.push(createdT);
    }
    console.log(`[Seed] Created ${createdTemplates.length} Canva-style Certificate Templates.`);

    // 5. Issue Demo Certificate to Recipient
    const certId1 = generateCertId();
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const qrUrl1 = await generateQRCodeDataUrl(`${clientUrl}/verify/${certId1}`);

    const issuedCert = await Certificate.create({
      certificateId: certId1,
      organization: orgProfile._id,
      recipient: recipientUser._id,
      recipientName: recipientUser.name,
      recipientEmail: recipientUser.email,
      template: createdTemplates[0]._id,
      title: 'Certificate of Excellence in Web Engineering',
      courseName: 'Full-Stack MERN Web Development',
      description: 'Demonstrated outstanding proficiency in building modern cloud-native web applications.',
      issueDate: new Date('2026-08-15'),
      status: 'Issued',
      designData: createdTemplates[0].designData,
      qrCodeUrl: qrUrl1
    });

    // Verification Log
    await VerificationLog.create({
      certificateId: certId1,
      result: 'VALID',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    });

    console.log(`[Seed] Issued Demo Certificate ${certId1} to ${recipientUser.name}`);

    console.log('=================================================');
    console.log('✅ DATABASE SEED COMPLETE IN TemplateMaker DB!');
    console.log('Credentials Summary:');
    console.log('  - Super Admin:   admin@certmaker.com / Admin@123');
    console.log('  - Organization:  org@techacademy.com / Org@123');
    console.log('  - Recipient:     student@example.com / Student@123');
    console.log('=================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDB();
