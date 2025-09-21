const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyAdmin() {
  try {
    // Check if admin user exists
    const admin = await prisma.user.findUnique({
      where: {
        email: 'latif2016@gmail.com'
      },
      include: {
        workshopInfo: true
      }
    });
    
    if (admin) {
      console.log('✅ Admin user found:');
      console.log({
        id: admin.id,
        username: admin.username,
        email: admin.email,
        hasWorkshopInfo: !!admin.workshopInfo
      });
      
      if (admin.workshopInfo) {
        console.log('✅ Workshop info found:');
        console.log({
          name: admin.workshopInfo.name,
          tagline: admin.workshopInfo.tagline,
          contactPerson: admin.workshopInfo.contactPerson,
          phone: admin.workshopInfo.phone
        });
      }
    } else {
      console.log('❌ Admin user not found');
    }
    
  } catch (error) {
    console.error('Error verifying admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAdmin();
