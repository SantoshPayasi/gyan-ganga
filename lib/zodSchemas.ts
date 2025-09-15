import z from "zod";

// constants
export const courseLevel = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseStatus = ["Draft", "Published", "Archived"] as const;
export const courseCategory = [
    'Development',
    'Business',
    'IT',
    'Design',
    'Marketing',
    'Finance',
    'Health & Fitness',
    'Science',
    'Personal Development',
    'Others',
    'Music'
] as const;


// schema
export const courseSchema = z.object({
    title: z.string()
        .min(3, { message: "Title must be at least 3 characters" })
        .max(100, { message: "Title must be less than 100 characters" }),
    description: z.string()
        .min(3, { message: "Description must be at least 3 characters" }),
    fileKey: z.string().min(1, { message: "File key is required" }),
    price: z.transform(Number).pipe(z.number().min(1, { message: "Price must be at least 1" })),
    duration: z.transform(Number).pipe(z.number().min(1, { message: "Duration must be at least 1 hour" }).max(100, { message: "Duration must be less than 100 hours" })),
    level: z.enum(courseLevel, { message: "Level is required" }),
    category: z.enum(courseCategory, { message: "Category is required" }),
    smallDescription: z.string()
        .min(3, { message: "Small description must be at least 3 characters" })
        .max(200, { message: "Small description must be less than 200 characters" }),
    slug: z.string().min(3, { message: "Slug must be at least 3 characters" }),
    status: z.enum(courseStatus, { message: "Status is required" }),
});

export const chapterSchema = z.object({
    name: z.string().min(3, { message: "Chapter name must be at least 3 characters" }).max(100, { message: "Chapter name must be less than 100 characters" }),
    courseId: z.string().uuid({ message: "Invalid course ID" }),
})


export type CourseSchemaType = z.infer<typeof courseSchema>

export type ChapterSchemaType = z.infer<typeof chapterSchema>