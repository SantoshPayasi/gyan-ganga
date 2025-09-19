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

interface iDeleteChapter {
    chapterId: string
    courseId: string
}

export async function deleteChapter({ chapterId, courseId }: iDeleteChapter): Promise<APiResponse> {
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


        const courseWithChapters = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            select: {
                chapter: {
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



        if (!courseWithChapters) {
            return {
                status: "error",
                message: "Course not found"
            }
        }


        const chapters = courseWithChapters.chapter;

        const chapterTodelete = chapters.find((chapter) => chapter.id === chapterId);

        if (!chapterTodelete) {
            return {
                status: "error",
                message: "Chapter not found in the course"
            }
        }


        const remainingChapters = chapters.filter((chapter) => chapter.id !== chapterId);

        const updates = remainingChapters.map((chapter, index) => {
            return prisma.chapter.update({
                where: {
                    id: chapter.id
                },
                data: { position: index + 1 }
            })
        });

        await prisma.$transaction([
            ...updates,
            prisma.chapter.delete({
                where: {
                    id: chapterId,
                    courseId: courseId
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
            message: "Failed to delete chapter"
        }
    }
}