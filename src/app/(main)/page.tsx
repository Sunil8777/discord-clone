import prisma from '@/lib/db'
import { initialProfile } from "@/lib/initial-profile";
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
    return redirect(`/servers/${server.id}`)
  }
  
  return (
    <div>
      <InitialModel/>
    </div>
  );
}
