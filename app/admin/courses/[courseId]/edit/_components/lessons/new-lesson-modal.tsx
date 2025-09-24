"use client";

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react';
import React, { useState, useTransition } from 'react'
import NewLessonForm from './new-lesson-form';
import { lessonSchema, LessonSchemaType } from '@/lib/zodSchemas';
import { tryCatch } from '@/hooks/try-catch';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createNewLesson } from './actions';

interface iAppProps {
    courseId: string;
    chapterId: string;
}
const NewLeesonModal = ({ courseId, chapterId }: iAppProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [pending, startTransition] = useTransition();


    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            title: '',
            courseId: courseId,
            chapterId: chapterId
        }
    });

    function onSubmit(values: LessonSchemaType) {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(createNewLesson(values));
            if (error) {
                toast.error(error.message || "Something went wrong");
            }
            if (result?.status === "success") {
                form.reset();
                toast.success(result.message || "Lesson created successfully");
                setIsOpen(false);
            } else if (result?.status === "error") {
                toast.error(result.message || "Something went wrong");
            }

        });
    }

    function handleOpenChange(open: boolean) {
        if (open) {
            form.reset();
        }
        setIsOpen(open);
    }



    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant={"outline"} className='w-full justify-center gap-1' size={"sm"}>
                    <Plus className="size-4" /> New Lesson
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Create new Lesson</DialogTitle>
                    <DialogDescription>Would you like to name your lesson ?</DialogDescription>
                </DialogHeader>
                <NewLessonForm onSubmit={onSubmit} pending={pending} form={form} />
            </DialogContent>
        </Dialog>
    )
}

export default NewLeesonModal
