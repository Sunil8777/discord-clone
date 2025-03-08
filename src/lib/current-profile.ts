import { auth } from '@clerk/nextjs/server'

export default async function currentProfile() {
  const {userId} = await auth()

  if(!userId){
    return null
  }

  const profile = await prisma?.profile.findUnique({
    where:{
        userId:userId
    }
  })

  return profile
}
