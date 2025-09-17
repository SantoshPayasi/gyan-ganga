"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RichTextEditor } from "@/components/rish-text-editor/Editor";

interface FormRichTextAreaFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    placeholder?: string;
    className?: string;
    textAreaClassName?: string;
    label: string;
}

export function FormRichTextAreaField<T extends FieldValues>({
    control,
    name,
    placeholder,
    className,
    textAreaClassName,
    label,
}: FormRichTextAreaFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <RichTextEditor field={field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
