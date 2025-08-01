import { ChatInput } from "@/components/chat /chat-input";
import { ChatMessages } from "@/components/chat /chat-message";
import { ChatHeader } from "@/components/chat /ChateHeader";
import { MediaRoom } from "@/components/media-room";
import currentProfile from "@/lib/current-profile";
import { RedirectToSignIn } from "@clerk/nextjs";

import { channelType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";


interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

export default async function ChannelIdPage({
  params: { channelId, serverId }
}: ChannelIdPageProps) {
  const profile = await currentProfile();

  if (!profile) return RedirectToSignIn;

  const channel = await prisma!.channel.findUnique({
    where: { id: channelId }
  });

  const member = await prisma!.member.findFirst({
    where: { serverId: serverId, profileId: profile.id }
  });

  if (!channel || !member) return redirect("/");

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel" 
      />
      {channel.type === channelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId
            }}
          />
        </>
      )}
      {channel.type === channelType.AUDIO && (
        <MediaRoom chatId={channel.id} video={false} audio={true} />
      )}
      {channel.type === channelType.VIDEO && (
        <MediaRoom chatId={channel.id} video={true} audio={true} />
      )}
    </div>
  );
}