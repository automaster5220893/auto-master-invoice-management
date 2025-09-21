import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const workshopInfo = await prisma.workshopInfo.findUnique({
      where: { userId: user.userId }
    })

    if (!workshopInfo) {
      return NextResponse.json({ error: 'Workshop info not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...workshopInfo,
      services: JSON.parse(workshopInfo.services)
    })
  } catch (error) {
    console.error('Get workshop info error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { services, ...otherData } = data

    const workshopInfo = await prisma.workshopInfo.upsert({
      where: { userId: user.userId },
      update: {
        ...otherData,
        services: JSON.stringify(services || [])
      },
      create: {
        userId: user.userId,
        ...otherData,
        services: JSON.stringify(services || [])
      }
    })

    return NextResponse.json({
      ...workshopInfo,
      services: JSON.parse(workshopInfo.services)
    })
  } catch (error) {
    console.error('Update workshop info error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
