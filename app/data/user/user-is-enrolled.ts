import "server-only";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function checkIsCourseBought(courseId: string): Promise<boolean> {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !session.user) {
        return false;
    }
    try {
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: courseId
                }
            },
            select: {
                status: true
            }
        })

        if (!enrollment) {
            return false;
        }

        return enrollment.status === "Active" ? true : false;

    } catch (error) {
        return false
    }
}