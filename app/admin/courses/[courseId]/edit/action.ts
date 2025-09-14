"use server"
import { requireAdmin } from "@/app/data/admin/require-admin";
import { Arcjet, detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { APiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";

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