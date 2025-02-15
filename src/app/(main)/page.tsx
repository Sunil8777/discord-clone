import prisma from '@/lib/db'
import { ModeToggle } from "@/components/ui/mode-toggle";
import { initialProfile } from "@/lib/initial-profile";
import { UserButton } from "@clerk/nextjs";
import { redirect } from 'next/navigation';

export default async function Home() {
  
  const profile = await initialProfile()
  console.log(profile.id)

  const server = await prisma.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id, 
        }
      }
    }
  });
  
  if(server){
    return redirect(`/server/${server.id}`)
  }
  
  return (
    <div>
      <UserButton/>
      <ModeToggle/>
    </div>
  );
}
