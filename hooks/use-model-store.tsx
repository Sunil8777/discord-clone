import { Server } from '@prisma/client'
import  {create} from 'zustand'

export type ModelType = "createServer" | "invite" | "editServer" | "members"

interface ModelStore {
    type: ModelType | null,
    data?:Server
    isOpen: boolean,
    onOpen: (type: ModelType,data:Server) => void,
    onClose: () => void
}

export const useModel = create<ModelStore>((set) => ({
    type: null,
    data: undefined,
    isOpen: false,
    onOpen: (type,data) => set({isOpen:true,type,data}),
    onClose: () => set({type:null,isOpen:false,data:undefined})
  }))