"use client"
import { UploadDropzone } from "@/lib/uploadthing"
import { X } from "lucide-react"
import Image from "next/image"
import "@uploadthing/react/styles.css"
interface fileUploadProps {
    onChange: (url?:string) => void
    value: string
    endPoint: "serverImage" | "messageFile"
}

export default function FileUpload({onChange,value,endPoint}:fileUploadProps) {
    const fileTpye = value?.split(".").pop()

    if(value && fileTpye!=="pdf"){
        return(
            <div className="relative h-20 w-20">
                <Image
                    fill
                    src={value}
                    alt="Upload"
                    className="rounded-full"
                />
                <button onClick={()=>onChange("")} className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm " type="button">
                    <X className="h-4 w-4"></X>
                </button>
        </div>
        )
    }
  return (
    <UploadDropzone
        endpoint = {endPoint}
        onClientUploadComplete={(res)=>{
            onChange(res?.[0].ufsUrl)
        }}
        onUploadError={(error:Error)=>{
            console.log(error)
        }}
    />
  )
}
