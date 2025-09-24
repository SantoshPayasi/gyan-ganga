"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContext, DragEndEvent, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core";

import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { AdminCourseDetailType } from "@/app/data/admin/admin-get-course";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronUp, FileText, GripVertical, GripVerticalIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollapsibleContent } from "@/components/ui/collapsible";
import Link from "next/link";
import { toast } from "sonner";
import { reorderChapter, reorderLessons } from "../action";
import NewChapterModal from "./chapters/new-chapter-modal";
import NewLeesonModal from "./lessons/new-lesson-modal";
import { DeleteLesson } from "./lessons/delete-lesson-dialog";
import { DeleteChapter } from "./chapters/delete-chapter-dialog";


interface iAppProps {
    data: AdminCourseDetailType
}

interface SortableItemProps {
    id: string;
    children: (listeners: DraggableSyntheticListeners) => React.ReactNode;
    className?: string;
    data?: {
        type: 'chapter' | 'lesson',
        chapterId?: string,  //only relevant for lessons
    };
}

export function CourseStructure({ data }: iAppProps) {

    const initialItems = data.chapter.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        position: chapter.position,
        lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            position: lesson.position
        })),
        isOpen: false
    })) || [];

    const [items, setItems] = useState(initialItems);

    useEffect(() => {
        setItems((prevItems) => {
            const updatedItems = data.chapter.map((chapter) => {
                const existingChapter = prevItems.find(item => item.id === chapter.id);
                return {
                    id: chapter.id,
                    title: chapter.title,
                    position: chapter.position,
                    lessons: chapter.lessons.map((lesson) => ({
                        id: lesson.id,
                        title: lesson.title,
                        position: lesson.position
                    })),
                    isOpen: existingChapter ? existingChapter.isOpen : false
                }
            }) || [];
            return updatedItems;
        })
    }, [data]);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || over.id == active.id) return;

        const activeId = active.id;
        const overId = over.id;

        const activeType = active.data.current?.type as 'chapter' | 'lesson';
        const overType = over.data.current?.type as 'chapter' | 'lesson';

        const courseID = data.id;

        if (activeType === 'chapter') {
            let targetChapterId = null;
            if (overType === 'chapter') {
                targetChapterId = overId as string;
            } else if (overType === 'lesson') {
                targetChapterId = over.data.current?.chapterId ?? null;
            }

            if (!targetChapterId) {
                toast.error("Could not determine target chapter for reordering.");
                return;
            };


            const oldIndex = items.findIndex(item => item.id === activeId);
            const newIndex = items.findIndex(item => item.id === targetChapterId);

            if (oldIndex === -1 || newIndex === -1) {
                toast.error("Could not find chapter to reorder.");
                return;
            }

            const newItems = arrayMove(items, oldIndex, newIndex);

            const previousItems = [...items];

            const updatedChapterForState = newItems.map((item, index) => ({
                ...item,
                position: index + 1
            }))



            setItems(updatedChapterForState);

            if (!courseID) return;

            const chapterToUpdate = updatedChapterForState.map((chapter) => ({ id: chapter.id, position: chapter.position }));

            const reorderChapterPromise = () => reorderChapter(courseID, chapterToUpdate);

            toast.promise(
                reorderChapterPromise(),
                {
                    loading: "Reordering chapters...",
                    success: (result) => {
                        if (result.status === "success") {
                            return "Chapters reordered successfully."
                        } else {
                            throw new Error(result.message || "Failed to reorder chapters.")
                        }
                    },
                    error: (error) => {
                        setItems(previousItems);
                        return error.message || "Failed to reorder chapters."
                    }
                }
            )

            return;
        }

        if (activeType === 'lesson' && overType === 'lesson') {
            const sourceChapterId = active.data.current?.chapterId;
            const targetChapterId = over.data.current?.chapterId;

            if (!sourceChapterId || !targetChapterId || sourceChapterId !== targetChapterId) {
                toast.error("Lesson move between different chapters or invalid chapters ID is ont allowed");
                return;
            };
            const chapterIndex = items.findIndex(item => item.id === sourceChapterId);
            if (chapterIndex === -1) {
                toast.error("Could not find chapter for reordering lessons.");
                return;
            }

            const lessons = items[chapterIndex].lessons;
            const oldIndex = lessons.findIndex(lesson => lesson.id === activeId);
            const newIndex = lessons.findIndex(lesson => lesson.id === overId);

            if (oldIndex === -1 || newIndex === -1) {
                toast.error("Could not find lesson to reorder.");
                return;
            }

            const newLessons = arrayMove(lessons, oldIndex, newIndex);

            const updatedItems = [...items];

            const updatedlessonsForState = newLessons.map((lesson, index) => ({
                ...lesson,
                position: index + 1
            }))
            updatedItems[chapterIndex] = {
                ...updatedItems[chapterIndex],
                lessons: updatedlessonsForState
            };

            setItems(updatedItems);

            if (courseID) {
                const lessonToUpdate = updatedlessonsForState.map((lesson) => ({ id: lesson.id, position: lesson.position }));

                const reorderLessonPromise = () => reorderLessons(courseID, sourceChapterId, lessonToUpdate);

                toast.promise(
                    reorderLessonPromise(),
                    {
                        loading: "Reordering lessons...",
                        success: (result) => {
                            if (result.status === "success") {
                                return "Lessons reordered successfully."
                            } else {
                                throw new Error(result.message || "Failed to reorder lessons.")
                            }
                        },
                        error: (error) => {
                            setItems(updatedItems);
                            return error.message || "Failed to reorder lessons."
                        }
                    }
                )
            }

            return;

        }
    }

    function toggleChapterOpen(chapterId: string) {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === chapterId ? { ...item, isOpen: !item.isOpen } : item
            )
        );
    }
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor,
            {
                coordinateGetter: sortableKeyboardCoordinates
            }
        )
    )

    function SortableItem({ id, data, children, className }: SortableItemProps) {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging
        } = useSortable({ id: id, data: data });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        return (
            <div ref={setNodeRef} style={style} {...attributes} className={cn(
                "touch-none",
                className,
                isDragging ? 'z-10' : ''
            )}>
                {children(listeners)}
            </div>
        );
    }

    return (
        <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd} sensors={sensors}>
            <CardHeader className="flex flex-row items-center justify-between border-b border-border mb-6">
                <CardTitle>Chapters</CardTitle>
                <NewChapterModal courseId={data.id} />
            </CardHeader>
            <CardContent className="space-y-8">
                <SortableContext
                    strategy={verticalListSortingStrategy}
                    items={items}
                >
                    {
                        items.map((chapter) => (
                            <SortableItem key={chapter.id} id={chapter.id} data={{ type: 'chapter' }}>
                                {(listeners) => (
                                    <Card>
                                        <Collapsible
                                            open={chapter.isOpen}
                                            onOpenChange={() => toggleChapterOpen(chapter.id)}
                                        >
                                            <div className="flex items-center justify-between p-3 border-b border-border">
                                                <div className="flex items-center gap-2">
                                                    <Button {...listeners} size={'icon'} variant="ghost">
                                                        <GripVerticalIcon className="size-4" />
                                                    </Button>
                                                    <CollapsibleTrigger asChild>
                                                        <Button className="flex items-center" size={'icon'} variant="ghost">
                                                            {chapter.isOpen ?
                                                                <ChevronDown className="size-4" /> :
                                                                <ChevronUp className="size-4" />}
                                                        </Button>
                                                    </CollapsibleTrigger>
                                                    <p className="cursor-pointer hover:text-primary">{chapter.title}</p>
                                                </div>
                                                <DeleteChapter chapterId={chapter.id} courseId={data.id} />
                                            </div>
                                            <CollapsibleContent>
                                                <div className="p-1">
                                                    <SortableContext
                                                        items={chapter.lessons.map(lesson => lesson.id)}
                                                        strategy={verticalListSortingStrategy}
                                                    >
                                                        {
                                                            chapter.lessons.map((lesson) => (
                                                                <SortableItem key={lesson.id} id={lesson.id} data={{ type: 'lesson', chapterId: chapter.id }}>
                                                                    {(lessonListeners) => (
                                                                        <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                                                            <div className="flex items-center gap-2">
                                                                                <Button variant={"ghost"} size={"icon"} {...lessonListeners}>
                                                                                    <GripVertical className="size-4" />
                                                                                </Button>
                                                                                <FileText className="size-4" />
                                                                                <Link
                                                                                    href={`/admin/courses/${data.id}/${chapter.id}/${lesson.id}`}
                                                                                >
                                                                                    {lesson.title}
                                                                                </Link>
                                                                            </div>
                                                                            <DeleteLesson chapterId={chapter.id} courseId={data.id} lessonId={lesson.id} />
                                                                        </div>
                                                                    )
                                                                    }
                                                                </SortableItem>
                                                            ))
                                                        }
                                                    </SortableContext>
                                                    <div className="p-2">
                                                        <NewLeesonModal courseId={data.id} chapterId={chapter.id} />
                                                    </div>
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </Card>
                                )}
                            </SortableItem>
                        ))
                    }
                </SortableContext>
            </CardContent>
        </DndContext>
    )
}

