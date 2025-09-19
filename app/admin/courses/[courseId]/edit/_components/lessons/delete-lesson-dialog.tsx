import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { Loader, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteLesson } from "./actions";
import { toast } from "sonner";

interface iAppProps {
    courseId: string
    chapterId: string
    lessonId: string
}
export function DeleteLesson({
    courseId,
    chapterId,
    lessonId }
    : iAppProps) {
    const [open, setOpen] = useState(false)
    const [pending, startTransition] = useTransition();

    async function onSubmit() {
        startTransition(async () => {
            const { data, error } = await tryCatch(deleteLesson({ courseId, chapterId, lessonId }));
            if (error) {
                toast.error(error.message || "Something went wrong");
            }
            if (data?.status === "success") {
                toast.success(data.message || "Lesson deleted successfully");
            }
            if (data?.status === "error") {
                toast.error(data.message || "Something went wrong");
            }
            setOpen(false);
        })
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                    <Trash2 className="size-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure? </AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={onSubmit}>{
                        pending ?
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            :
                            "Delete"
                    }</Button>
                </AlertDialogFooter>
            </AlertDialogContent>

        </AlertDialog>
    )
}