import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { company, product, productDescription, industry } = await request.json()
    console.log('Received data:', { company, product, productDescription, industry })

    // Update database
    const updatedUser = await db.user.update({
      where: { clerkId: userId },
      data: { company, product, productDescription, industry },
    })
    console.log('Updated user in database:', updatedUser)

    // Update Clerk metadata
    const updatedClerkUser = await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        company,
        product,
        productDescription,
        industry
      },
    })
    console.log('Updated Clerk user:', updatedClerkUser.publicMetadata)

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Error updating user data:', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}