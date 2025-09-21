"use client";

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useTransition } from "react";
import { enrollInCourseAction } from "../action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface iButtonProps {
    courseId: string
}
export function EnrollMentButton({ courseId }: iButtonProps) {
    const [pending, startTransition] = useTransition();


    function onSubmit() {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(enrollInCourseAction(courseId));

            if (error) {
                toast.error("An unexpected error occured, Please try again.")
            }

            if (result?.status == "success") {
                toast.success(result.message);
            }
        })
    }
    return (
        <Button className="w-full" onClick={onSubmit}>
            {
                pending ? (
                    <>
                        <Loader2 className="size-4 animate-spin" /> Loading...
                    </>
                ) : "Enroll Now"
            }
        </Button>
    )
}