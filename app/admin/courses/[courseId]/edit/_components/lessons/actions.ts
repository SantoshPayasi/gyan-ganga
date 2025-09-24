"use server"

import { requireAdmin } from "@/app/data/admin/require-admin";
import { Arcjet, detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { APiResponse } from "@/lib/types";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";
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

export async function createNewLesson(data: LessonSchemaType): Promise<APiResponse> {
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

        const result = lessonSchema.safeParse(data);

        if (!result.success) {
            return {
                status: "error",
                message: result.error.issues.map((issue) => issue.message).join(", ")
            }
        }

        await prisma.$transaction(async (tx) => {
            const maxPosition = await tx.lesson.findFirst({
                where: {
                    chapterId: result.data.chapterId
                },
                select: { position: true },
                orderBy: {
                    position: 'desc'
                }
            });

            await tx.lesson.create({
                data: {
                    title: result.data.title,
                    description: result.data.description,
                    chapterId: result.data.chapterId,
                    thumbnailKey: result.data.thumbnailKey,
                    videoKey: result.data.videoKey,
                    position: maxPosition ? maxPosition.position + 1 : 1,
                }
            });
        }
        );

        revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

        return {
            status: "success",
            message: "Lesson created successfully"
        }
    } catch (error) {
        return {
            status: "error",
            message: "Something went wrong"
        }
    }
}

export async function deleteLesson({ chapterId, courseId, lessonId }: { chapterId: string, courseId: string, lessonId: string }): Promise<APiResponse> {
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


        const chapterwithLessons = await prisma.chapter.findUnique({
            where: {
                id: chapterId
            },
            select: {
                lessons: {
                    orderBy: {
                        position: "asc"
                    },
                    select: {
                        id: true,
                        position: true
                    }
                }
            }
        });



        if (!chapterwithLessons) {
            return {
                status: "error",
                message: "Chapter not found"
            }
        }


        const lesson = chapterwithLessons.lessons;

        const lessonTodelete = lesson.find((lesson) => lesson.id === lessonId);

        if (!lessonTodelete) {
            return {
                status: "error",
                message: "Lesson not found"
            }
        }


        const remainingLesson = lesson.filter((lesson) => lesson.id !== lessonId);

        const updates = remainingLesson.map((lesson, index) => {
            return prisma.lesson.update({
                where: {
                    id: lessonId
                },
                data: { position: index + 1 }
            })
        });

        await prisma.$transaction([
            ...updates,
            prisma.lesson.delete({
                where: {
                    id: lessonId,
                    chapterId: chapterId
                }
            })
        ])

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Lesson deleted successfully"
        }
    } catch (error) {
        return {
            status: "error",
            message: "Failed to delete the lesson"
        }
    }
}