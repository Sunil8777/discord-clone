import currentProfile from "@/lib/current-profile"
import axios from "axios"
import { NextResponse } from "next/server"

export async function PATCH(req:Request,{params}:{params:{memberId:string}}) {
    const {serverId,role} = await req.json()
    const {memberId} = await params
    const profile = await currentProfile()

    try {
        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }
    
        if(!memberId || !serverId || !role){
            return new NextResponse("Bad Request",{status:400})
        }
    
        const updateRole = await prisma?.server.update({
            where:{
                id:serverId,
                profileId:profile.id
            },
            data:{
                members:{
                    update:{
                        where:{
                            id:memberId,
                            profileId:{
                                not:profile.id
                            }
                        },
                        data:{
                            role
                        }
                    }
                }
            },
            include:{
                members:{
                    include:{
                        profile:true
                    },
                    orderBy:{
                        role: "asc"
                    }
                }
            }
        })
    
        return NextResponse.json(updateRole,{status:200})
    } catch (error) {
        console.log("Internal Error",error)
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{memberId:string}}) {
    const profile = await currentProfile()

    const {searchParams} = new URL(req.url)
    const serverId = searchParams.get("serverId")
    const {memberId} = await params

    console.log(serverId)

    try {
        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }

        if(!memberId || !serverId ){
            return new NextResponse("Bad Request",{status:400})
        }

        const deleteMember = await prisma?.server.update({
            where:{
                id:serverId,
                profileId:profile.id
            },
            data:{
                members:{
                    delete:{
                        id:memberId,
                        profileId:{
                            not:profile.id
                        }
                    } 
                }
            },
            include:{
                members:{
                    include:{
                        profile:true
                    },
                    orderBy:{
                        role: "asc"
                    }
                }
            }
        })

        return NextResponse.json(deleteMember,{status:200})
    } catch (error) {
        console.log("Internal Error",error)
        return new NextResponse("Internal Error",{status:500})
    }

}