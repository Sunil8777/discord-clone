import currentProfile from "@/lib/current-profile"
import { channelType, MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

export async function POST(req:Request) {
    const {name,type,serverId} = await req.json()
    const profile = await currentProfile()

    try {
        if(!type || !serverId){
            return new NextResponse("Bad request",{status:400})
        }

        if(name === "general"){
            return new NextResponse("name can't be 'general' ",{status:400})
        }

        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }

        const createChannel = await prisma?.server.update({
            where:{
                id:serverId,
                members:{
                    some:{
                        profileId:profile.id,
                        role:{
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data:{
                channels:{
                    create:{
                        profileId: profile.id,
                        name,
                        type
                    }
                }
            }
        })

        return NextResponse.json(createChannel,{status:200})
    } catch (error) {
        console.log("Internal Error",error)
        return new NextResponse("Internal Error",{status:500})
    }
}