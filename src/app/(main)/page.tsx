import prisma from '@/lib/db'
import { ModeToggle } from "@/components/ui/mode-toggle";
import { initialProfile } from "@/lib/initial-profile";
import { UserButton } from "@clerk/nextjs";
import { redirect } from 'next/navigation';
import InitialModel from '@/components/models/initial-model';

export default async function Home() {
  
  const profile = await initialProfile()

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
      <InitialModel/>
    </div>
  );
}
