
import ServerSidebar from "@/components/server/server-sidebar";
import currentProfile from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ServerLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: {serverId:string}
}>) {

    const profile = await currentProfile()
    const {serverId} = await params

    if(!profile){
        const {redirectToSignIn} = await auth()
        return redirectToSignIn()
    }

    const server = await prisma?.server.findUnique({
        where:{
            id:serverId,
            members:{
                some:{
                    profileId:profile.id
                }
            }
        }
    })

    if(!server){
        return redirect('/')
    }
  return (
    <div className="h-full">
          <div className="md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
            <ServerSidebar serverId={serverId}/>
          </div>
          <main className="md:pl-60 h-full">
            {children}
          </main>
    </div>
  );
}
