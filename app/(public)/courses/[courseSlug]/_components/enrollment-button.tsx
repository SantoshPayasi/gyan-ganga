"use client";

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useTransition } from "react";
import { enrollInCourseAction } from "../action";

interface iButtonProps {
    courseId: string
}
export function EnrollMentButton(courseId: string) {
    const [pending, startTransition] = useTransition();


    function onSubmit() {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(enrollInCourseAction(courseId));
        })
    }
    return (
        <Button className="w-full">
            Enroll Now
        </Button>
    )
}