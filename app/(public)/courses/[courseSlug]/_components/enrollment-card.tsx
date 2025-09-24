import { PublicSingleCourseType } from '@/app/data/course/get-course'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { IconBook, IconCategory, IconChartBar, IconClock } from '@tabler/icons-react'
import { CheckIcon, Link } from 'lucide-react'
import React from 'react'
import { EnrollMentButton } from './enrollment-button'

interface iAppProps {
    course: PublicSingleCourseType,
    isEnrolled: boolean
}
const EnrollmentCard = ({ course, isEnrolled }: iAppProps) => {
    return (
        <div className="order-2 lg:col-span-1">
            <div className="sticky top-20">
                <Card className="py-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-lg font-medium">Price:</span>
                            <span className="text-2xl font-bold text-primary">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(course.price)}</span>
                        </div>


                        <div className="mb-6 space-y-3 rounded-lg bg-muted p-4">
                            <h4 className="font-medium">What you will get:</h4>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <IconClock className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Course Duration</p>
                                        <p className="text-sm text-muted-foreground">{course.duration} hours</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <IconChartBar className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Course Level</p>
                                        <p className="text-sm text-muted-foreground">{course.level}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <IconCategory className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Course Category</p>
                                        <p className="text-sm text-muted-foreground">{course.category}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <IconBook className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Course Duration</p>
                                        <p className="text-sm text-muted-foreground">{
                                            course.chapter.reduce((total, chapter) => total + chapter.lessons.length, 0)
                                        } Lesson
                                            {course.chapter.length > 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <IconClock className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Course Duration</p>
                                        <p className="text-sm text-muted-foreground">{course.duration} hours</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-6 space-y-3">
                            <h4>This course includes:</h4>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm">
                                    <div className="rounded-full bg-green-500/10 text-green-500">
                                        <CheckIcon className="size-3" />
                                    </div>
                                    <span>Full lifetime access</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <div className="rounded-full bg-green-500/10 text-green-500">
                                        <CheckIcon className="size-3" />
                                    </div>
                                    <span>Access on mobile and desktop</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <div className="rounded-full bg-green-500/10 text-green-500">
                                        <CheckIcon className="size-3" />
                                    </div>
                                    <span>Certificate after completion</span>
                                </li>
                            </ul>
                        </div>
                        {
                            isEnrolled ?
                                (
                                    <Link href={"/dashboard"} className={buttonVariants({ className: "w-full" })}>
                                        Watch Course
                                    </Link>
                                ) :
                                (
                                    <EnrollMentButton courseId={course.id} />
                                )
                        }


                        <p className="text-xs mt-3 text-muted-foreground text-center ">30 day money back guarantee</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default EnrollmentCard
