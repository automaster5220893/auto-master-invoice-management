const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createWorkshopInfo() {
  try {
    // Find the admin user
    const admin = await prisma.user.findUnique({
      where: {
        email: 'latif2016@gmail.com'
      }
    });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }
    
    // Check if workshop info already exists
    const existingWorkshopInfo = await prisma.workshopInfo.findUnique({
      where: {
        userId: admin.id
      }
    });
    
    if (existingWorkshopInfo) {
      console.log('✅ Workshop info already exists for admin user');
      return;
    }
    
    // Create workshop info for admin
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
    
    console.log('✅ Workshop info created successfully:', {
      id: workshopInfo.id,
      name: workshopInfo.name,
      userId: workshopInfo.userId
    });
    
  } catch (error) {
    console.error('Error creating workshop info:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createWorkshopInfo();
