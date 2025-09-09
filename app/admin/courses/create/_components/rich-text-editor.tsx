"use client"

import { RichTextEditor } from "@/components/rish-text-editor/Editor"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
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


export const FormRichTextAreaField = ({ control, name, placeholder, className, textAreaClassName, label }: FormTextAreaFieldsProps) => {
    return (
        <>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem className={className}>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            {/* <Textarea placeholder={placeholder} className={textAreaClassName} {...field} /> */}
                            <RichTextEditor field={field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}