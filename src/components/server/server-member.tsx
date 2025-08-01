'use client'

import { cn } from "@/lib/utils"
import { Member, MemberRole, Profile, Server } from "@prisma/client"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { redirect, useParams, useRouter } from "next/navigation"
import { UserAvatar } from "../ui/user-avatar"

interface ServerMemberProps {
    member:Member & {profile: Profile},
    server: Server
}

const roleIconMap = {
    [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 mr-2 text-rose-500 '/>,
    [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4 mr-2 text-indigo-500 '/>,
    [MemberRole.GUEST]: null

}

export default function ServerMember({member,server}:ServerMemberProps) {
    const params = useParams()
    const router = useRouter()

    const icon = roleIconMap[member.role]

    const handleClick = () => {
        console.log(member.id)
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
    }
  return (
    <button onClick={handleClick} className={cn(
        "group px-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
    )}>
        <UserAvatar src={member.profile.profileImage} className="h-8 w-8 md:h-8 md:w-8"/>
        <p className={cn(
            "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
            params.channelId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}>
            {member.profile.name}
        </p>
        {icon}
    </button>
  )
}
