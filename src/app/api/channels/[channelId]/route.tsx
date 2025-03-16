import currentProfile from "@/lib/current-profile"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

export async function DELETE(req:Request,{params}:{params:{channelId:string}}) {
    const {channelId} = await params
    const {searchParams} = new URL(req.url)
    const serverId = searchParams.get('serverId')
    const profile = await currentProfile()

    try {
        if(!profile){
            return new NextResponse("Unauthorized Request",{status:401})
        }

        if(!serverId){
            return new NextResponse("Server Id missing",{status:400}) 
        }

        if(!channelId){
            return new NextResponse("channel Id missing",{status:400}) 
        }

        const deleteChannel = await prisma?.server.update({
            where:{
                id:serverId,
                members:{
                    some:{
                        profileId:profile.id,
                        role:{ 
                            not: MemberRole.GUEST
                        }
                    }
                }
            },
            data:{
                channels:{
                    delete:{
                        id:channelId,
                        name:{
                            not: "General"
                        }
                    }
                }
            }
        })

        return NextResponse.json(deleteChannel,{status:200})
    } catch (error) {
        console.log("Channel Id Delete",error)
        return new NextResponse("Channel Id Delete",{status:500})
    }
}

