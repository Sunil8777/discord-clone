import { v4 as uuidv4 } from 'uuid';
import currentProfile from '@/lib/current-profile'
import { NextResponse } from 'next/server'
import { MemberRole } from '@prisma/client';


export async function POST(req:Request) {
    const profile = await currentProfile()
    const {imageUrl,name} = await req.json()

    try {
        if(!profile){
            return NextResponse.json(
                {message: "Unauthorized"},
                {status:401}
            )
            }
    
        if(!imageUrl || !name){
            return NextResponse.json(
                {message: "Error in imageUrl and name "},
                {status:400}
            )
        }
    
        const createServer = await prisma?.server.create({
            data:{
                profileId:profile?.id,
                serverImage: imageUrl,
                inviteCode: uuidv4(),
                name,
                channels:{
                    create:[
                        { name:"General", profileId:profile.id }
                    ]
                },
                members:{
                    create:[
                        { role: MemberRole.ADMIN ,profileId:profile.id }
                    ]
                }
            },
        })
    
        return NextResponse.json(createServer);
    } catch (error) {
        return NextResponse.json(
            {message:"Internal error occur"},
            {status:500}
        )
    }
}
