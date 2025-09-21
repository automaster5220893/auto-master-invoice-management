const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('AutoMaster@2025!', 10);
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'latif2016@gmail.com',
        password: hashedPassword,
      },
    });
    
    console.log('Admin user created successfully:', {
      id: admin.id,
      username: admin.username,
      email: admin.email,
    });
    
    // Create default workshop info for admin
    const workshopInfo = await prisma.workshopInfo.create({
      data: {
        name: 'AUTO MASTER',
        tagline: 'MAINTENANCE CENTER',
        referenceNo: '5220893',
        vendorNo: '30305421',
        strn: '327787615816',
        services: JSON.stringify(['Denting', 'Painting', 'Mechanic', 'A.C', 'Auto Electrician', 'Computer Scanner']),
        contactPerson: 'Latif Ur Rehman',
        phone: '0312-9790076',
        email: 'latif2016@gmail.com',
        address: 'Opposite Suzuki Motors Ring Road Peshawar',
        facebook: 'accidentmaster',
        instagram: 'Accident Master',
        userId: admin.id,
      },
    });
    
    console.log('Workshop info created successfully:', {
      id: workshopInfo.id,
      name: workshopInfo.name,
    });
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('Admin user already exists');
    } else {
      console.error('Error creating admin user:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
