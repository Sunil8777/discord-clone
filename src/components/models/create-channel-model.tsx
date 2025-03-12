'use client'
import { object, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import toast from 'react-hot-toast'
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useModel } from "../../../hooks/use-model-store"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { channelType } from "@prisma/client"

export default function CreateChannelModel() {
    const {isOpen,onClose,type} = useModel()
    const router = useRouter()
    const params = useParams()

    const isModelOpen = isOpen && type === "createChannel"

    const formSchema = z.object({
        name: z.string().min(1, {
          message: "Channel name is required",
        }).refine(
            name => name !== 'general',
            {
                message: "Channel name can't be 'general'"
            }
        ),
        type: z.nativeEnum(channelType)
      })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          type:channelType.TEXT
        },
      })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post('/api/channels',{...values,serverId:params?.serverId});
            toast.success("Server created");
            form.reset()
            onClose()
            router.refresh()  
            
        } catch (error) {
            toast.error("Something went wrong")
            console.log("Error in initial-model",error)
        }
    }

    const handleOpenChange = () =>{
        form.reset()
        onClose()
    }
    
  return (
    <Dialog open={isModelOpen} onOpenChange={handleOpenChange}>
        <DialogContent className='bg-white text-black p-0 overflow-hidden '>
            <DialogHeader className='pt-8 px-6'>
            <DialogTitle className='text-2xl text-center font-bold'>Create Channel</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-8 px-6">
                        
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Channel name</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isLoading} className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" placeholder="Enter channel name"/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Channel Type</FormLabel>
                                <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                        <SelectValue placeholder="Select a channel type"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.values(channelType).map((type)=>(
                                        <SelectItem key={type} value={type} className="capitalize">
                                            {type.toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    </div>
                    <DialogFooter className="bg-gray-100 px-6 py-4">
                        <Button type="submit" disabled={isLoading} variant= "primary">
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}