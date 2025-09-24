import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CourseSchemaType } from "@/lib/zodSchemas";
import { Control, Form, useFormContext } from "react-hook-form";

interface FormFieldsProps {
    control: Control<CourseSchemaType>,
    name: keyof CourseSchemaType,
    placeholder: string,
    type: "text" | "password" | "number",
    className?: string,
    label: string
}

interface FormTextAreaFieldsProps {
    control: Control<CourseSchemaType>,
    name: keyof CourseSchemaType,
    placeholder: string,
    className?: string,
    textAreaClassName?: string,
    label: string
}


export default function FormFields({ control, name, placeholder, className, type, label }: FormFieldsProps) {
    // const form = useFormContext();
    return (
        <>
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
        </>
    )
}


export const FormTextAreaField = ({ control, name, placeholder, className, textAreaClassName, label }: FormTextAreaFieldsProps) => {
    return (
        <>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem className={className}>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <Textarea placeholder={placeholder} className={textAreaClassName} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}