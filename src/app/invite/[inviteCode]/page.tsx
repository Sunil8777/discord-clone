
import currentProfile from "@/lib/current-profile"
import { RedirectToSignIn } from "@clerk/nextjs"
import { redirect} from "next/navigation"

interface inviteCodeProps{
    params:{
        inviteCode: string
    }
}

export default async function page({params}:inviteCodeProps) {
    
    const {inviteCode} = params
    console.log(inviteCode)
    const profile = await currentProfile()

    if(!profile){
        return <RedirectToSignIn/>
    }

    const existingServer = await prisma?.server.findFirst({
        where:{
            inviteCode:inviteCode as string,
            members:{
                some:{
                    profileId:profile.id
                }
            }
        }
    })

    if(existingServer){
        return redirect(`/servers/${existingServer.id}`)
    }

    const server = await prisma?.server.update({
        where:{
            inviteCode:inviteCode as string
        },
        data:{
            members:{
                create:[
                    {profileId: profile.id}
                ]
            }
        }
    })

    if(server){
        return redirect(`/servers/${server.id}`)
    }
  return (
    <div>
      hello
    </div>
  )
}
