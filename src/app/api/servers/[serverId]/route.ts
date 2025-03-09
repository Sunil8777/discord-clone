import currentProfile from "@/lib/current-profile"
import { NextResponse } from "next/server"

export async function PATCH(req:Request,{params}:{params:{serverId:string}}) {
    try {
        const {name,imageUrl} = await req.json()
        const {serverId} = await params
        const profile = await currentProfile()

        if(!profile){
            return new NextResponse("Unauthorized request",{status:401})
        }

        if(!serverId){
            return new NextResponse("Unauthorized request",{status:401})
        }

        const updatedServer = await prisma?.server.update({
            where:{
                id:serverId
            },
            data:{
                name,
                serverImage:imageUrl
            }
        })

        if(!updatedServer){
            return new NextResponse("Bad request",{status:400})
        }

        return NextResponse.json(updatedServer,{status:200})

    } catch (error) {
        console.log("Internal Error",error)
        return new NextResponse("Internal Error",{status:500})
    }
}