"use server"
import { requireAdmin } from "@/app/data/admin/require-admin";
import { Arcjet, detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { APiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = Arcjet.withRule(
    detectBot({
        mode: env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
        allow: [],

    })
).withRule(
    fixedWindow({
        mode: env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
        window: "1m",
        max: 5,
    })
)

export async function updateCourse(values: CourseSchemaType, id: string): Promise<APiResponse> {
    const session = await requireAdmin();
    try {
        const req = await request();
        const decision = await aj.protect(req, {
            fingerprint: session?.user.id as string
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: 'error',
                    message: "You have blocked due to rate limiting"
                }
            }
            else if (decision.reason.isBot()) {
                return {
                    status: 'error',
                    message: "You have blocked due to bot detection"
                }
            } else {
                return {
                    status: 'error',
                    message: "Looks like malicious user"
                }
            }
        }
        const validation = courseSchema.safeParse(values);
        if (!validation.success) {
            return {
                status: "error",
                message: validation.error.issues.map((issue) => issue.message).join(", ")
            }
        }
        const result = await prisma.course.update({
            where: {
                id: id
            },
            data: {
                ...values,
                userId: session.user.id
            }
        })
        return {
            status: "success",
            message: "Course Schema updated Successfully"
        }
    } catch (error) {
        return {
            status: "error",
            message: "Unable to update the course"
        }
    }
}


export async function reorderLessons(courseID: string, chapterId: string, lessons: { id: string, position: number }[]): Promise<APiResponse> {
    const session = await requireAdmin();
    try {
        const req = await request();
        const decision = await aj.protect(req, {
            fingerprint: session?.user.id as string
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: 'error',
                    message: "You have blocked due to rate limiting"
                }
            }
            else if (decision.reason.isBot()) {
                return {
                    status: 'error',
                    message: "You have blocked due to bot detection"
                }
            }
            else {
                return {
                    status: 'error',
                    message: "Looks like malicious user"
                }
            }
        }

        if (!lessons || lessons.length === 0) {
            return {
                status: "error",
                message: "No lessons to reorder."
            }
        }
        // Check if the course exists and belongs to the admin
        const course = await prisma.course.findFirst({
            where: {
                id: courseID,
                userId: session.user.id
            }
        });

        if (!course) {
            return {
                status: "error",
                message: "Course not found or you do not have permission to modify it."
            }
        }

        // Update lesson positions
        const updatePromises = lessons.map(lesson =>
            prisma.lesson.update({
                where: {
                    id: lesson.id,
                    chapterId: chapterId
                },
                data: {
                    position: lesson.position
                }
            })
        );

        await prisma.$transaction(updatePromises);

        revalidatePath(`/admin/courses/${courseID}/edit`);

        return {
            status: "success",
            message: "Lessons reordered successfully."
        }
    } catch (error) {
        return {
            status: "error",
            message: "Unable to reorder lessons."
        }
    }
}

export async function reorderChapter(courseID: string, chapters: { id: string, position: number }[]): Promise<APiResponse> {
    const session = await requireAdmin();
    try {
        const req = await request();
        const decision = await aj.protect(req, {
            fingerprint: session?.user.id as string
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: 'error',
                    message: "You have blocked due to rate limiting"
                }
            }
            else if (decision.reason.isBot()) {
                return {
                    status: 'error',
                    message: "You have blocked due to bot detection"
                }
            }
            else {
                return {
                    status: 'error',
                    message: "Looks like malicious user"
                }
            }
        }

        if (!chapters || chapters.length === 0) {
            return {
                status: "error",
                message: "No chapters to reorder."
            }
        }
        // Check if the course exists and belongs to the admin
        const course = await prisma.course.findFirst({
            where: {
                id: courseID,
                userId: session.user.id
            }
        });

        if (!course) {
            return {
                status: "error",
                message: "Course not found or you do not have permission to modify it."
            }
        }

        // Update lesson positions
        const updatePromises = chapters.map(chapter =>
            prisma.chapter.update({
                where: {
                    id: chapter.id,
                    courseId: courseID
                },
                data: {
                    position: chapter.position
                }
            })
        );

        await prisma.$transaction(updatePromises);
        revalidatePath(`/admin/courses/${courseID}/edit`);

        return {
            status: "success",
            message: "Chapters reordered successfully."
        }

    } catch (error) {
        return {
            status: "error",
            message: "Unable to reorder chapters."
        }
    }
}