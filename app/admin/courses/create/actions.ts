"use server"

import { requireAdmin } from "@/app/data/admin/require-admin";
import { Arcjet, detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { APiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { env } from "@/lib/env";
import { request } from "@arcjet/next";


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

export async function CreateCourse(data: CourseSchemaType): Promise<APiResponse> {
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
        const validation = courseSchema.safeParse(data);
        // const {} =  await auth.api.getSession({headers:await headers()});
        if (!validation.success) {
            return {
                status: 'error',
                message: validation.error.issues.map((issue) => issue.message).join(", ")
            }
        }

        const result = await prisma.course.create({
            data: {
                ...validation.data,
                userId: session?.user.id as string
            }
        })

        return {
            status: 'success',
            message: 'course created successfully'
        }

    } catch (error: any) {
        return {
            status: 'error',
            message: error.toString()
        }
    }
}