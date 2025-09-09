import { cn } from "@/lib/utils"
import { CloudUploadIcon, ImageIcon, XIcon } from "lucide-react"
import { Button } from "../ui/button"
import Image from "next/image"
import { IconLoader2 } from "@tabler/icons-react"

interface Props {
    isDragActive: boolean
}

interface UploadCompletedProps {
    previewUrl: string,
    isDeleting: boolean,
    handleRemoveFile: () => void
}


interface ProgressProps {
    progress: number,
    file: File
}

export function RenderEmptyState(
    { isDragActive }: Props
) {
    return (
        <div className="text-center">
            <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-muted mb-4">
                <CloudUploadIcon className={
                    cn(
                        "size-6 text-muted-foreground",
                        isDragActive && "text-primary"
                    )
                } />
            </div>
            <p className="text-base font-semibold text-foreground">Drop your files Here or <span className="text-primary font-bold cursor-pointer">click to upload</span></p>
            <Button type="button" className="mt-4">Select Files</Button>
        </div>
    )
}


export function RenderErrorState() {
    return (
        <div className="text-destructive text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
                <ImageIcon className="size-10 mx-auto mb-3" />
            </div>
            <p className="text-base font-semibold">Upload failed</p>
            <p className="text-xs mt-1 text-muted-foreground">Something went wrong</p>
            <Button type="button" className="mt-4">Retry file selection</Button>
        </div>
    )
}


export function RenderUploadedState({ previewUrl, isDeleting, handleRemoveFile }: UploadCompletedProps) {
    return (
        <div className="text-center">
            <Image src={previewUrl} alt="Uploaded Image" fill className="object-contain p-2" />
            <Button variant={"destructive"} size={"icon"} className={cn(
                'absolute top-4 right-4'
            )}
                onClick={handleRemoveFile}
                disabled={isDeleting}

            >
                {
                    isDeleting ? (
                        <IconLoader2 className="size-4 animate-spin" />
                    ) : (
                        <XIcon className="size-4" />
                    )
                }
            </Button>
        </div>
    )
}


export function RenderUploadingState({ progress, file }: ProgressProps) {
    return (
        <div className="text-center flex justify-center items-center flex-col">
            <p>{progress}%</p>
            <p className="text-sm mt-2 font-medium text-foreground">Uploading...</p>
            <p className="mt-1 text-sm text-muted-foreground truncate mx-w-xs">{file.name}</p>
        </div>
    )
}