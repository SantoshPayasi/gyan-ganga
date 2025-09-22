
"use client"

import React from 'react'
import { type Editor } from "@tiptap/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Toggle } from '../ui/toggle'
import { Bold, Heading1Icon, Heading2Icon, Heading3Icon, Italic, List, Strikethrough } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProvideMenuButtonItems, ProvideMenuItems, ProvideTextAlignMenuItems } from "./data"
import { Button } from '../ui/button'

interface iAppProps {
    editor: Editor | null
}

const MenuBar = ({ editor }: iAppProps) => {
    const [_, setEditorState] = React.useState(0)

    React.useEffect(() => {
        if (!editor) return

        const update = () => {
            setEditorState(prev => prev + 1)
        }

        editor.on('transaction', update)

        return () => {
            editor.off('transaction', update)
        }
    }, [editor])

    if (!editor) {
        return null
    }

    return (
        <div className='border border-input border-top-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center'>
            <TooltipProvider>
                <div className='flex flex-wrap gap-1'>
                    {
                        ProvideMenuItems(editor).map((item) => {
                            return (
                                <Tooltip key={item.label}>
                                    <TooltipTrigger asChild>
                                        <Toggle
                                            size="sm"
                                            pressed={item.isActive()}
                                            onPressedChange={item.action}
                                            className={cn(
                                                {
                                                    "bg-muted text-muted-foreground": item.isActive(),
                                                }
                                            )}
                                        >
                                            <item.icon />
                                        </Toggle>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            )
                        })
                    }

                </div>
                <div className='w-px h-6 bg-border mx-2'></div>
                <div className='flex flex-wrap gap-1'>
                    {
                        ProvideTextAlignMenuItems(editor).map((item) => {
                            return (
                                <Tooltip key={item.label}>
                                    <TooltipTrigger asChild>
                                        <Toggle
                                            size="sm"
                                            pressed={item.isActive()}
                                            onPressedChange={item.action}
                                            className={cn(
                                                {
                                                    "bg-muted text-muted-foreground": item.isActive(),
                                                }
                                            )}
                                        >
                                            <item.icon />
                                        </Toggle>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            )
                        })
                    }

                </div>
                <div className='w-px h-6 bg-border mx-2'></div>
                <div className='flex flex-wrap gap-1'>
                    {
                        ProvideMenuButtonItems(editor).map((item) => {
                            return (
                                <Tooltip key={item.label}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            disabled={item.disabled()}
                                            onClick={item.action}
                                            type='button'
                                            variant={'ghost'}
                                        >
                                            <item.icon />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            )
                        })
                    }
                </div>
            </TooltipProvider>
        </div>
    )
}

export default MenuBar

