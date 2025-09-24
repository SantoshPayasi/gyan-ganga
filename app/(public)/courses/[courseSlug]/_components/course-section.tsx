import { PublicSingleCourseType } from "@/app/data/course/get-course";
import { RenderDescription } from "@/components/rish-text-editor/render-description";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useConstructUrl } from "@/hooks/use-construct-url";

import { IconCategory, IconChartBar, IconChevronDown, IconClock } from "@tabler/icons-react";
import Image from "next/image";

interface iAppProps {
    course: PublicSingleCourseType
}

export function CourseSection({ course }: iAppProps) {
    const thumbnailUrl = useConstructUrl(course.fileKey);
    return (
        <div className="order-1 lg:col-span-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                <Image src={thumbnailUrl} alt="Thumbnail Image of course" className="object-cover" fill priority />
                <div className="absolute inset-0 bg-gradient-to-t  from-green/20 to-transparent">

                </div>
            </div>
            <div className="mt-8 space-y-6">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>
                    <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">{course.smallDescription}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Badge className="flex items-center gap-1 px-3 py-1 ">
                        <IconChartBar className="size-4" />
                        <span>{course.level}</span>
                    </Badge>

                    <Badge className="flex items-center gap-1 px-3 py-1 ">
                        <IconCategory className="size-4" />
                        <span>{course.category}</span>
                    </Badge>

                    <Badge className="flex items-center gap-1 px-3 py-1 ">
                        <IconClock className="size-4" />
                        <span>{course.duration} hours</span>
                    </Badge>
                </div>
                <Separator className="my-8" />
                <div className="space-y-6">
                    <h2 className="text-3xl font-semibold tracking-tight">Course Description</h2>

                    <RenderDescription json={JSON.parse(course.description)} />

                </div>
            </div>
            <div className="mt-12 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-semibold tracking-tight">Course Content</h2>
                    <div>
                        {course.chapter.length} chapters | {" "}
                        {
                            course.chapter.reduce((total, chapter) => {
                                return total + chapter.lessons.length;
                            }, 0) || 0
                        } lessons

                    </div>
                </div>
                <div className="space-y-4 mb-5">
                    {
                        course.chapter.map((chapter, index) => (
                            <Collapsible key={chapter.id} defaultOpen={index === 0}>
                                <Card className="p-0 overflow-hidden border-2 transition-all duration-200 hover:shadow-md gap-0">
                                    <CollapsibleTrigger>
                                        <div>
                                            <CardContent className="p-6 hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <p className="flex size-10 justify-center items-center rounded-full bg-primary/10 text-primary font-semibold">
                                                            {index + 1}
                                                        </p>
                                                        <div>
                                                            <h3 className="text-xl font-semibold text-left">
                                                                {chapter.title}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground">{chapter.lessons.length} lesson

                                                                {chapter.lessons.length > 1 ? "s" : ""}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant={"outline"} className="text-xs">
                                                            {chapter.lessons.length} lesson
                                                            {chapter.lessons.length > 1 ? "s" : ""}
                                                        </Badge>

                                                        <IconChevronDown className="size-5 text-muted-foreground " />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="border-5 bg-muted/20">
                                            <div className="p-6 pt-4 space-y-3">
                                                {
                                                    chapter.lessons.map((lesson, lessonIndex) => (
                                                        <div key={lesson.id} className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent transition-colors group">
                                                            <div className="flex size-8 items-center justify-center rounded-full  bg-background border-2 border-primary/20">
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-medium text-sm">{lesson.title}</p>
                                                                <p className="text-xs text-muted-foreground mt-1">Lesson {lessonIndex + 1}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </Card>
                            </Collapsible>
                        ))
                    }
                </div>

            </div>
        </div>
    )
}