import React from "react";

import { redirect } from "next/navigation";


import { getOrCreateConversation } from "@/lib/conversation";

import { MediaRoom } from "@/components/media-room";
import currentProfile from "@/lib/current-profile";
import { RedirectToSignIn } from "@clerk/nextjs";
import { ChatHeader } from "@/components/chat /ChateHeader";
import { ChatMessages } from "@/components/chat /chat-message";
import { ChatInput } from "@/components/chat /chat-input";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

export default async function MemberIdPage({
  params,
  searchParams
}: MemberIdPageProps) {
  const {memberId, serverId} = await params
  const {video} = await searchParams
  const profile = await currentProfile();

  if (!profile) return RedirectToSignIn;

  const currentMember = await prisma!.member.findFirst({
    where: {
      serverId,
      profileId: profile.id
    },
    include: {
      profile: true
    }
  });

  if (!currentMember) return redirect("/");

  const conversation = await getOrCreateConversation(
    currentMember.id,
    memberId
  );

  if (!conversation) return redirect(`/servers/${serverId}`);

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.profileImage}
        name={otherMember.profile.name}
        serverId={serverId}
        type="conversation"
      />
      {video && <MediaRoom chatId={conversation.id} video audio />}
      {!video && (
        <>
          <ChatMessages
            member={currentMember}
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
  );
}