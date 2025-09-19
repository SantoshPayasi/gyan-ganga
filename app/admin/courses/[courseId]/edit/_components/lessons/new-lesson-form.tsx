import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { chapterSchema, ChapterSchemaType, LessonSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm, UseFormReturn } from "react-hook-form";

interface iAppProps {
    onSubmit: (values: LessonSchemaType) => void;
    pending?: boolean;
    form: UseFormReturn<LessonSchemaType>;
}

export default function NewLessonForm({ onSubmit, pending, form }: iAppProps) {


    return (
        <Form {...form} >
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Lesson title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <Button type="submit" className="btn btn-primary " disabled={pending}>{
                        pending ?
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            :
                            "Create Lesson"
                    }</Button>
                </DialogFooter>
            </form>
        </Form>
    )
}