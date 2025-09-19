"use client"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldValues, Path } from "react-hook-form";

interface FormFieldsProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
    className?: string;
    label: string;
}


export default function FormFields<T extends FieldValues>({
    control,
    name,
    placeholder,
    className,
    type,
    label,
}: FormFieldsProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input type={type} placeholder={placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
