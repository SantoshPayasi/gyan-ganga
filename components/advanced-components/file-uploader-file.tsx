"use client"

import { Uploader } from "@/components/file-uploader/uploader"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Control, FieldValues, Path } from "react-hook-form"

interface FormFileUploaderFieldProps<T extends FieldValues> {
    control: Control<T>
    name: Path<T>
    className?: string
    label: string
    placeholder?: string;
    fileTypeAccepted: "image" | "video"
}

export const FormFileUploaderField = <T extends FieldValues>({
    control,
    name,
    className,
    label,
    fileTypeAccepted
}: FormFileUploaderFieldProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Uploader
                            onChange={field.onChange}
                            value={typeof field.value === "string" ? field.value : field.value ? String(field.value) : undefined}
                            fileTypeAccepted={fileTypeAccepted}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
