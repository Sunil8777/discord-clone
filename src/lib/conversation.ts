import prisma from '@/lib/db'

export const getOrCreateConversation = async (memberOneId:string,memberTwoId:string) => {
    let conversation = await findConversation(memberOneId,memberTwoId) || await findConversation(memberTwoId,memberOneId)

    if(!conversation){
        conversation = await createNewConversation(memberOneId,memberTwoId)
    }

    return conversation
}

const findConversation = async (memberOneId:string,memberTwoId:string) => {
    try {
        const response = await prisma.conversation.findFirst(
            {
                where:{
                    AND: [
                            { memberOneId: memberOneId },
                            { memberTwoId: memberTwoId }
                        ]
                },
                include:{
                    memberOne:{
                        include:{
                            profile:true
                        }
                    },
                    memberTwo:{
                        include:{
                            profile:true
                        }
                    }
                }
            }
        )
        return response;
    } catch (error) {
        console.error("Conversation Error: ",error)
    }
}

const createNewConversation = async (memberOneId:string,memberTwoId:string) => {
    try {
        console.log(memberOneId,memberTwoId)
        const response = await prisma.conversation?.create({
            data:{
                memberOneId:memberOneId,
                memberTwoId:memberTwoId
            },
            include:{
                memberOne:{
                    include:{
                        profile:true
                    }
                },
                memberTwo:{
                    include:{
                        profile:true
                    }
                }
            }
        })
        return response
    } catch (error) {
        console.error("Conversation Error: ",error)
    }
}