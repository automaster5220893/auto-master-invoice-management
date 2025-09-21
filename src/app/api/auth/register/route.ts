// Registration API route commented out - registration disabled
/*
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    })

    // Create default workshop info
    await prisma.workshopInfo.create({
      data: {
        userId: user.id,
        name: "AUTO MASTER",
        tagline: "MAINTENANCE CENTER",
        referenceNo: "5220893",
        vendorNo: "30305421",
        strn: "327787615816",
        contactPerson: "Latif Ur Rehman",
        phone: "0312-9790076",
        email: "latif2016@gmail.com",
        address: "Opposite Suzuki Motors Ring Road Peshawar",
        facebook: "accidentmaster",
        instagram: "Accident Master",
        services: JSON.stringify(["Denting", "Painting", "Mechanic", "A.C", "Auto Electrician", "Computer Scanner"])
      }
    })

    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username
    })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
*/
