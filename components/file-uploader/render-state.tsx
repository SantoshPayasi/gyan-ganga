import { cn } from "@/lib/utils"
import { CloudUploadIcon, ImageIcon } from "lucide-react"
import { Button } from "../ui/button"

interface Props {
    isDragActive: boolean
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