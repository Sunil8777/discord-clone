import currentProfile from "@/lib/current-profile"
import { RedirectToSignIn } from "@clerk/nextjs";
import prisma from '@/lib/db'
import { redirect } from "next/navigation";
import { getOrCreateConversation } from "@/lib/conversation";
import { ChatHeader } from "@/components/chat /ChateHeader";
import { ChatInput } from "@/components/chat /chat-input";
import { ChatMessages } from "@/components/chat /chat-message";

interface MemberIdProps {
    params:{
        serverId : string,
        memberId: string
    }
}

const MemberIdPage = async ({params}:MemberIdProps) => {
    const profile = await currentProfile();
    const {memberId,serverId} = await params

    if(!profile){
        return RedirectToSignIn
    }

    const currentMember = await prisma.member.findFirst({
        where:{
            serverId: params.serverId,
            profileId:profile.id,
        },
        include:{
            profile:true
        }
    })

    if(!currentMember){
        redirect('/')
    }

    const conversation = await getOrCreateConversation(currentMember.id,params.memberId)

    if(!conversation){
        return redirect(`/servers/${serverId}`)
    }

    const {memberOne,memberTwo} = conversation

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return(
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={serverId}
        type="conversation"
      />
      {video && <MediaRoom chatId={conversation.id} video audio />}
      {!video && (
        <>
          <ChatMessages
            member={currentMember } 
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id
            }}
          />
        </>
      )}
    </div>
    )
}
export default MemberIdPage