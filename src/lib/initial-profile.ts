import prisma from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { currentUser } from '@clerk/nextjs/server'

export async function initialProfile () {
    const user = await currentUser()

    const { redirectToSignIn } = await auth()

    if(!user){
        return redirectToSignIn()
    }

    const profile = await prisma.profile.findUnique({
        where:{
            userId:user.id
        }
    })

    if(profile){
        return profile
    }

    const newProfile = await prisma.profile.create({
        data:{
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            profileImage: user.imageUrl
        }
    })

    return newProfile
}