import { Channel, channelType, Server } from '@prisma/client'
import  {create} from 'zustand'

export type ModelType = "createServer" | "invite" | "editServer" | "members" | "createChannel" | "leaveServer" | "deleteServer" | "deleteChannel" | "messageFile" | "deleteMessage"

interface ModelData {
    server?: Server,
    channelTypes?: channelType,
    channel?: Channel
    apiUrl?: string;
    query?: Record<string, any>;
}

interface ModelStore {
    type: ModelType | null,
    data?: ModelData,
    isOpen: boolean,
    onOpen: (type: ModelType,data?:ModelData) => void,
    onClose: () => void
}

export const useModel = create<ModelStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type,data) => set({isOpen:true,type,data}),
    onClose: () => set({type:null,isOpen:false})
  }))