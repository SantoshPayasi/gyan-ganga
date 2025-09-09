"use client";

import { courseCategory, courseLevel, courseSchema, CourseSchemaType, courseStatus } from "@/lib/zodSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FormFields, { FormTextAreaField } from "./form-fields";
import { Button } from "@/components/ui/button";
import { PlusIcon, SparkleIcon } from "lucide-react";
import slugify from "slugify";
import { Select, SelectTrigger } from "@/components/ui/select";
import { SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { SelectField } from "@/components/form-select";

export default function CreateCourseForm() {
    const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: "",
            description: "",
            fileKey: "",
            price: 0,
            duration: 0,
            level: "Beginner",
            category: "Development",
            smallDescription: "",
            slug: "",
            status: "Draft",
        },
    })

    async function onSubmit(data: CourseSchemaType) {
        console.log(data);
    }
    return (
        <>
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormFields
                        control={form.control}
                        name="title"
                        label="Title"
                        placeholder="Please Enter course title"
                        type="text"
                    />
                    <div className="flex gap-4 items-end">
                        <FormFields
                            control={form.control}
                            className="w-full"
                            name="slug"
                            label="Slug"
                            placeholder="slug"
                            type="text"
                        />
                        <Button type="button" className="w-fit" onClick={() => {
                            const titleValue = form.getValues("title");
                            const slugValue = slugify(titleValue);
                            form.setValue("slug", slugValue, { shouldValidate: true });
                        }
                        }>
                            Generate Slug <SparkleIcon className="ml-1" size={16} />
                        </Button>
                    </div>

                    <FormTextAreaField
                        control={form.control}
                        name="smallDescription"
                        label="Small Description"
                        placeholder="Please Enter course small description"
                        className="w-full"
                        textAreaClassName="min-h-[120px]"
                    />

                    <FormTextAreaField
                        control={form.control}
                        name="description"
                        label="Description"
                        placeholder="Please Enter course description"
                        className="w-full"
                        textAreaClassName="min-h-[120px]"
                    />

                    <FormFields
                        control={form.control}
                        name="fileKey"
                        label="Thumbnail Image"
                        placeholder="thumbnail url"
                        className="w-full"
                        type="text"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <SelectField
                            control={form.control}
                            name="category"
                            label="Category"
                            placeholder="Select a category"
                            options={courseCategory}
                        />


                        <SelectField
                            control={form.control}
                            name="level"
                            label="Level"
                            placeholder="Select a level"
                            options={courseLevel}
                        />

                        <FormFields
                            control={form.control}
                            name="duration"
                            label="Please enter course duration"
                            placeholder="0"
                            className="w-full"
                            type="number"
                        />

                        <FormFields
                            control={form.control}
                            name="price"
                            label="Please enter course price, ($)"
                            placeholder="0"
                            className="w-full"
                            type="number"
                        />
                    </div>



                    <SelectField
                        control={form.control}
                        name="status"
                        label="Status"
                        placeholder="Select a status"
                        options={courseStatus}
                    />
                    <Button>
                        Create Course <PlusIcon className="ml-1" size={16} />
                    </Button>
                </form>
            </Form>
        </>
    )

}


