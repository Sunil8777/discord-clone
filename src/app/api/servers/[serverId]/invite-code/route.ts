import currentProfile from "@/lib/current-profile"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function PATCH(req:Request,{params}:{params:{serverId:string}}) {
    const {serverId} = await params
    const profile = await currentProfile()
    try {

        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }

        if(!serverId){
            return new NextResponse("Server ID Missing",{status:400})
        }

        const updateInviteCode = await prisma?.server.update({
            where:{
                id:serverId,
                profileId: profile.id
            },
            data:{
                inviteCode: uuidv4()
            }
        })

        return NextResponse.json(updateInviteCode,{status:200})
    } catch (error) {
        console.log("Error in invite api",error)
        return new NextResponse("Internal Error",{status:500})
    }
    
}