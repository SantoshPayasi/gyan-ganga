import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { chapterSchema, ChapterSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm, UseFormReturn } from "react-hook-form";

interface iAppProps {
    courseId: string;
    onSubmit: (values: ChapterSchemaType) => void;
    pending?: boolean;
    form: UseFormReturn<ChapterSchemaType>;
}

export default function NewChapterForm({ courseId, onSubmit, pending, form }: iAppProps) {


    return (
        <Form {...form} >
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Chapter Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <Button type="submit" className="btn btn-primary w-full" disabled={pending}>{
                        pending ?
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            :
                            "Create Chapter"
                    }</Button>
                </DialogFooter>
            </form>
        </Form>
    )
}