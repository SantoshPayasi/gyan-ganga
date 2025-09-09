"use client"

import { Uploader } from "@/components/file-uploader/uploader"
import { RichTextEditor } from "@/components/rish-text-editor/Editor"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CourseSchemaType } from "@/lib/zodSchemas"
import { Control } from "react-hook-form"

interface FormTextAreaFieldsProps {
    control: Control<CourseSchemaType>,
    name: keyof CourseSchemaType,
    placeholder: string,
    className?: string,
    textAreaClassName?: string,
    label: string
}


export const FormFileUploaderField = ({ control, name, placeholder, className, textAreaClassName, label }: FormTextAreaFieldsProps) => {
    return (
        <>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem className={className}>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <Uploader />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}