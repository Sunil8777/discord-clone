import { getAuth } from '@clerk/nextjs/server'
import { NextApiRequest } from 'next'

export default async function currentProfilePage(req: NextApiRequest) {
  const {userId} = await getAuth(req)

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
