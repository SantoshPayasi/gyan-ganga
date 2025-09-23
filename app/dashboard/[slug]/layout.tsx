import React, { ReactNode } from 'react'
import CourseSideBar from '../_components/course-sidebar'
import { getCourseSidebarData } from '@/app/data/course/get-course-sidebar-data';

interface iAppProps {
    params: Promise<{ slug: string }>,
    children: ReactNode
}

export default async function CourseLayout({ children, params }: iAppProps) {
    const { slug } = await params;

    const courseData = await getCourseSidebarData(slug);
    return (
        <div className='flex flex-1'>

            <div className='w-80 border-r border-border shrink-0'>
                <CourseSideBar courseData={courseData.course} />
            </div>

            <div className='flex-1 overflow-hidden'>
                {children}
            </div>

        </div>
    )
}


