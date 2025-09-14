"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContext, DragEndEvent, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core";

import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { AdminCourseDetailType } from "@/app/data/admin/admin-get-course";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronUp, FileText, GripVertical, GripVerticalIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollapsibleContent } from "@/components/ui/collapsible";
import Link from "next/link";


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

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
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
            <CardHeader className="flex flex-row items-center justify-between border-b border-border">
                <CardTitle>Chapters</CardTitle>
            </CardHeader>
            <CardContent className="py-6">
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
                                                <Button variant={"outline"} size={"icon"}>
                                                    <Trash2 className="size-4" />
                                                </Button>
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
                                                                            <Button variant={"outline"} size={"icon"}>
                                                                                <Trash2 className="size-4" />
                                                                            </Button>
                                                                        </div>
                                                                    )
                                                                    }
                                                                </SortableItem>
                                                            ))
                                                        }
                                                    </SortableContext>
                                                    <div className="p-2">
                                                        <Button variant={"outline"} className="w-full">
                                                            Create New Lesson
                                                        </Button>
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
