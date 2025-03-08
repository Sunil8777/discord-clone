import currentProfile from '@/lib/current-profile'
import { auth } from '@clerk/nextjs/server'
import { channelType } from '@prisma/client'
import { channel } from 'diagnostics_channel'
import { redirect } from 'next/navigation'
import React from 'react'
import ServerHeader from './server-header'

interface ServerSidebarProps{
    serverId:string
}
export default async function ServerSidebar({serverId}:ServerSidebarProps) {

    const profile = await currentProfile()

    if(!profile){
        const {redirectToSignIn} = await auth()
        return redirectToSignIn()
    }

    const server = await prisma?.server.findUnique({
        where:{
            id:serverId
        },
        include:{
            channels:{
                orderBy:{
                    createdAt:'asc'
                }
            },
            members:{
                include:{
                    profile:true
                },
                orderBy:{
                    role: "asc"
                }
            }    
        },
        
    })

    if(!server){
        return redirect('/')
    }

    const textChannels = server.channels.filter((channel)=>channel.type === channelType.TEXT)
    const audioChannels = server.channels.filter((channel)=>channel.type === channelType.AUDIO)
    const videoChannels = server.channels.filter((channel)=>channel.type === channelType.VIDEO)

    const members = server.members.filter((member)=> member.profileId !== profile.id)
    
    const role = server.members.find((member)=> member.profileId === profile.id)?.role
    
  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
      <ServerHeader server={server} role={role}/>
    </div>
  )
}
