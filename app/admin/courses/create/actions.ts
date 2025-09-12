"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { APiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
// import { headers } from "next/headers";

export async function CreateCourse(data: CourseSchemaType): Promise<APiResponse> {
    try {
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
                userId: "OvOFV3B67zLP7A1BJNYpdJ3qIeAsMvuZ"
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