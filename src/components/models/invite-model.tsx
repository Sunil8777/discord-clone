'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { useModel } from "../../../hooks/use-model-store"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Check, Copy, RefreshCcw } from "lucide-react"
import useOrigin from "../../../hooks/use-Origin"
import { useState } from "react"
import axios from "axios"

export default function InviteModel() {
    const {onOpen,isOpen,onClose,type,data} = useModel()
    const origin = useOrigin()

    const [isCopied,setIsCopied] = useState(false)
    const [isLoading,setIsLoading] = useState(false)


    const inviteUrl = `${origin}/invite/${data?.inviteCode}`

    const isModelOpen = isOpen && type === "invite"

    const onCopy = () =>{
        navigator.clipboard.writeText(inviteUrl)
        setIsCopied(true)

        setTimeout(()=>{
            setIsCopied(false)
        },1000)
    }

    const onNew = async () =>{
        try {
            setIsLoading(true)

            const response = await axios.patch(`/api/servers/${data?.id}/invite-code`)

            onOpen('invite',response.data)
            
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false)
        }
    }

    
  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
        <DialogContent className='bg-white text-black p-0 overflow-hidden '>
            <DialogHeader className='pt-8 px-6'>
            <DialogTitle className='text-2xl text-center font-bold'>Invite Friends</DialogTitle>
            </DialogHeader>
            <div className="p-6">
                <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Server invite link</Label>
                <div className="flex items-center mt-2 gap-x-2">
                    <Input disabled={isLoading} className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:offset-0" value={inviteUrl} readOnly/>
                    <Button disabled={isLoading} onClick={onCopy} size="icon">
                        {isCopied ? (
                            <Check className="w-4 h-4"/>
                        ) :(
                            <Copy className="w-4 h-4"/>
                        )}
                        
                    </Button>
                </div>
                <Button onClick={onNew} disabled={isLoading} className="text-xs text-zinc-500 mt-4">
                    Generate a new link
                    <RefreshCcw className="w-4 h-4 ml-2"/>
                </Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}