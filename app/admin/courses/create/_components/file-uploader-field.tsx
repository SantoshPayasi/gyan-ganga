"use client"

import { Uploader } from "@/components/file-uploader/uploader"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CourseSchemaType } from "@/lib/zodSchemas"
import { Control } from "react-hook-form"

interface FormTextAreaFieldsProps {
    control: Control<CourseSchemaType>,
    name: keyof CourseSchemaType,
    className?: string,
    label: string,
    placeholder?: string,
}


export const FormFileUploaderField = ({ control, name, className, label, placeholder }: FormTextAreaFieldsProps) => {
    return (
        <>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem className={className}>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <Uploader
                                onChange={(val: string) => field.onChange(val)}
                                value={typeof field.value === "string" ? field.value : field.value !== undefined ? String(field.value) : undefined}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}