"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { APiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function markLessonComplete(lessonId: string, slug: string): Promise<APiResponse> {
    const user = await requireUser();

    try {

        await prisma.lessonProgrss.upsert({
            where: {
                userId_lessonId: {
                    userId: user.id,
                    lessonId: lessonId
                }
            },
            update: {
                completed: true
            },
            create: {
                userId: user.id,
                lessonId: lessonId,
                completed: true
            }
        })

        revalidatePath(`/dashboard/${slug}`);

        return {
            status: "success",
            message: "Lesson marked as complete"
        }
    } catch (error) {
        return {
            status: "error",
            message: "Failed to mark as lesson complete"
        }
    }
}