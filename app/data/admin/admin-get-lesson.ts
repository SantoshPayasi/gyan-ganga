import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";


interface Params {
    id: string
}
export async function adminGetLesson({ id }: Params) {
    await requireAdmin();

    const data = await prisma.lesson.findUnique({
        where: {
            id: id
        },
        select: {
            title: true,
            videoKey: true,
            description: true,
            thumbnailKey: true,
            id: true,
            position: true
        }
    })

    if (!data) {
        throw notFound();
    }

    return data
}



export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;