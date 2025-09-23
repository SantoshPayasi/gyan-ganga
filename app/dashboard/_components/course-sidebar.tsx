import { CourseSidebarData } from '@/app/data/course/get-course-sidebar-data'
import { Progress } from '@/components/ui/progress'
import { Play } from 'lucide-react'
import React from 'react'

interface iAppProps {
    courseData: CourseSidebarData["course"]
}

const CourseSideBar = ({ courseData }: iAppProps) => {
    return (
        <div className='flex flex-col h-full'>
            <div className='pb-4 pr-4 border-b border-border'>
                <div className='flex items-center gap-3 mb-2'>
                    <div className='size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'>
                        <Play className='size-5 text-primary' />
                    </div>
                    <div className='flex-1 min-w-0'>
                        <h1 className='font-semibold text-base leading-tight truncate'>{courseData.title}</h1>
                        <p className='text-xs text-muted-foreground mt-1 truncate'>{courseData.category}</p>
                    </div>
                </div>
                <div className='space-y-2'>
                    <div className='flex justify-between text-xs'>
                        <span className='text-muted-foreground'>Progress</span>
                        <span className='font-medium'>4/10 lessons</span>
                    </div>
                    <Progress value={55} className='h-1.5' />
                    <p className='text-xs text-muted-foreground'>55% complete</p>
                </div>
            </div>
        </div>
    )
}

export default CourseSideBar
