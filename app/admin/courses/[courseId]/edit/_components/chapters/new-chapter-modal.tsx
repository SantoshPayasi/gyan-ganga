"use client";

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react';
import React, { useState, useTransition } from 'react'
import NewChapterForm from './new-chapter-form';
import { chapterSchema, ChapterSchemaType } from '@/lib/zodSchemas';
import { tryCatch } from '@/hooks/try-catch';
import { createChapter } from '../../action';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface iAppProps {
    courseId: string;
}
const NewChapterModal = ({ courseId }: iAppProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [pending, startTransition] = useTransition();


    const form = useForm<ChapterSchemaType>({
        resolver: zodResolver(chapterSchema),
        defaultValues: {
            name: '',
            courseId: courseId
        }
    });

    function onSubmit(values: ChapterSchemaType) {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(createChapter(values));
            if (error) {
                toast.error(error.message || "Something went wrong");
            }
            if (result?.status === "success") {
                toast.success(result.message || "Chapter created successfully");
                setIsOpen(false);
            } else if (result?.status === "error") {
                toast.error(result.message || "Something went wrong");
            }

        });
    }

    function handleOpenChange(open: boolean) {
        setIsOpen(open);
    }



    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant={"outline"} className='gap-2' size={"sm"}>
                    <Plus className="size-4" /> New Chapter
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Create new chapter</DialogTitle>
                    <DialogDescription>Would you like to name your chapter ?</DialogDescription>
                </DialogHeader>
                <NewChapterForm courseId={courseId} onSubmit={onSubmit} pending={pending} form={form} />
            </DialogContent>
        </Dialog>
    )
}

export default NewChapterModal
