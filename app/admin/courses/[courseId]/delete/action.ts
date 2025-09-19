"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import { Arcjet } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { APiResponse } from "@/lib/types";
import { detectBot, fixedWindow, request } from "@arcjet/next";
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

export async function deleteCourse(courseId: string): Promise<APiResponse> {
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


        if (!courseId) {
            return {
                status: 'error',
                message: 'Invalid course id'
            }
        }

        await prisma.course.delete({
            where: {
                id: courseId
            }
        })

        revalidatePath("/admin/courses")
        return {
            status: 'success',
            message: "Course deleted successfully"
        }

    } catch (error: any) {

        return {
            status: 'error',
            message: error.message || "Something went wrong"
        }
    }
}