import currentProfile from "@/lib/current-profile"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

export async function PATCH(req:Request,{params}:{params:{serverId:string}}) {
    const {serverId} = await params
    const profile = await currentProfile()

    try {
        if(!profile){
            return new NextResponse("Unauthorized request",{status:401})
        }

        if(!serverId){
            return new NextResponse("ServerId is missing",{status:400})
        }

        const leaveServer = await prisma?.server.update({
            where:{
                id:serverId,
                profileId:{
                    not:profile.id
                },
                members:{
                    some:{
                        profileId: profile.id,
                    }
                }
            },
            data:{
                members:{
                    deleteMany:{
                        profileId:profile.id
                    }
                }
            }
        })

        return NextResponse.json(leaveServer,{status:200})
    } catch (error) {
        console.log("leave server",error)
        return new NextResponse("Leave server",{status:500})
    }
}   