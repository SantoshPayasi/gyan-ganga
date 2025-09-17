"use client";

import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import FormFields from "./form-field";
import { FormRichTextAreaField } from "@/components/advanced-components/rich-text-editor";
import { FormFileUploaderField } from "@/components/advanced-components/file-uploader-file";


interface iAppProps {
    data: AdminLessonType,
    chapterId: string,
    courseId: string

}


export function LessonForm(
    {
        data,
        chapterId,
        courseId
    }: iAppProps
) {
    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            title: data.title,
            description: data.description ?? undefined,
            videoKey: data.videoKey ?? undefined,
            thumbnailKey: data.thumbnailKey ?? undefined,
            chapterId: chapterId,
            courseId: courseId
        }
    })
    return (
        <div>
            <Link href={`/admin/courses/${courseId}/chapters/${chapterId}`} className={buttonVariants({ variant: 'outline', className: 'mb-6' })}>
                <ArrowLeft className="size-4" />
                <span>Go Back</span>
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle>Lesson Configuration</CardTitle>
                    <CardDescription>Configure the video and description for this lesson</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form className="space-y-6">
                            <FormFields<LessonSchemaType>
                                control={form.control}
                                name="title"
                                placeholder="Lesson Name"
                                type="text"
                                label="Lesson Name"
                            />
                            <FormRichTextAreaField<LessonSchemaType>
                                control={form.control}
                                label="Description"
                                name="description"
                                placeholder="Lesson Description"
                            />

                            <FormFileUploaderField<LessonSchemaType>
                                control={form.control}
                                name="thumbnailKey"
                                label="Thumbnail key"
                                fileTypeAccepted="image"
                            />

                            <FormFileUploaderField<LessonSchemaType>
                                control={form.control}
                                name="videoKey"
                                label="Video key"
                                fileTypeAccepted="video"
                            />

                            <Button type="submit">
                                Save Lesson
                            </Button>

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}