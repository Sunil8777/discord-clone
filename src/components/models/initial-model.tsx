'use client'
import { z } from "zod"
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
import FileUpload from "../file-upload"
import toast from 'react-hot-toast'
import axios from "axios"
import { useRouter } from "next/navigation"

export default function InitialModel() {
    const router = useRouter()

    const formSchema = z.object({
        name: z.string().min(1, {
          message: "Server name is required",
        }),
        imageUrl: z.string().min(2,{
            message:"Server image is required"
        })
      })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          imageUrl: ""
        },
      })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post('/api/servers',values);
            toast.success("Server created");
            form.reset()
            router.refresh()
            window.location.reload()
            
        } catch (error) {
            toast.error("Something went wrong")
            console.log("Error in initial-model",error)
        }
    }
    
  return (
    <Dialog open>
        <DialogContent className='bg-white text-black p-0 overflow-hidden'>
            <DialogHeader className='pt-8 px-6'>
            <DialogTitle className='text-2xl text-center font-bold'>Customize your server</DialogTitle>
            <DialogDescription className='text-center text-zinc-500'>
                Give your server a personality with a name and an image. You can always change it later
            </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-8 px-6">
                        <div className="flex items-center justify-center text-center">
                            <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <FileUpload endPoint = "serverImage" onChange={field.onChange} value={field.value}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            />
                        </div>
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Server name</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isLoading} className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" placeholder="Enter server name"/>
                                </FormControl>
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
