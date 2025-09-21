import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const invoices = await prisma.invoice.findMany({
      where: { userId: user.userId },
      include: {
        services: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Get invoices error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { customerName, services } = await request.json()

    if (!customerName || !services || !Array.isArray(services)) {
      return NextResponse.json(
        { error: 'Customer name and services are required' },
        { status: 400 }
      )
    }

    // Get the next S.No
    const lastInvoice = await prisma.invoice.findFirst({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' }
    })

    const nextSNo = lastInvoice 
      ? (parseInt(lastInvoice.sNo) + 1).toString().padStart(3, '0')
      : '001'

    const total = services.reduce((sum: number, service: any) => sum + (service.rate || 0), 0)

    const invoice = await prisma.invoice.create({
      data: {
        userId: user.userId,
        sNo: nextSNo,
        customerName,
        date: new Date().toLocaleDateString('en-GB'),
        total,
        services: {
          create: services.map((service: any) => ({
            description: service.description,
            rate: service.rate || 0,
            amount: service.rate || 0
          }))
        }
      },
      include: {
        services: true
      }
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Create invoice error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
