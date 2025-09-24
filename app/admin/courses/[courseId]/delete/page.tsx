"use client"
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteCourse } from "./action";
import { Loader2, Trash2 } from "lucide-react";





export default function Page() {

    const { courseId } = useParams<{ courseId: string }>();
    const [pending, startTransition] = useTransition()
    const router = useRouter();
    async function onSubmit() {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(deleteCourse(courseId))

            if (error) {
                toast.error("An unexpected error occurred. Please try again.");
                return;
            }
            if (result.status === "success") {
                toast.success(result.message);
                router.push("/admin/courses");
                return;
            } else if (result.status === "error") {
                toast.error(result.message);
                return;
            }
        })
    }
    return (
        <div className="max-w-xl mx-auto w-full">
            <Card className="mt-32">
                <CardHeader>
                    <CardTitle>Are you sure you want to delete this course?</CardTitle>
                    <CardDescription>This action can&apos;t be undone</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <Link href={`admin/courses`} className={buttonVariants({ variant: "outline" })} >Cancel</Link>
                    <Button variant={"destructive"} disabled={pending} onClick={onSubmit}>{
                        pending ?
                            (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </>
                            ) :
                            (
                                <>
                                    <Trash2 /> Delete
                                </>
                            )
                    }
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}