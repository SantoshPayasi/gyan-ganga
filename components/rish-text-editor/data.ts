import { AlignCenter, AlignLeft, AlignRight, Bold, Heading1, Heading2, Heading3, IconNode, Italic, List, ListOrdered, LucideIcon, Redo, Strikethrough, Undo } from "lucide-react";
import { type Editor } from "@tiptap/react"
import { Icon } from "@tabler/icons-react";

interface MenuItems {
    property: string,
    action: () => void,
    isActive: () => boolean
    label: string,
    icon: LucideIcon
}

interface MenuButtonItems {
    property: string,
    action: () => void,
    disabled: () => boolean
    label: string,
    icon: LucideIcon
}
export function ProvideMenuItems(editor: Editor): MenuItems[] {
    return [
        {
            property: 'bold',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive('bold'),
            label: 'Bold',
            icon: Bold
        },
        {
            property: 'italic',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive('italic'),
            label: 'Italic',
            icon: Italic
        },
        {
            property: 'strike',
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: () => editor.isActive('strike'),
            label: 'Strike',
            icon: Strikethrough
        },
        {
            property: 'heading',
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => editor.isActive('heading', { level: 1 }),
            label: 'Heading 1',
            icon: Heading1
        },

        {
            property: "heading",
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive('heading', { level: 2 }),
            label: 'Heading 2',
            icon: Heading2
        },
        {
            property: "heading",
            action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: () => editor.isActive('heading', { level: 3 }),
            label: 'Heading 3',
            icon: Heading3
        },
        {
            property: "bulletList",
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: () => editor.isActive('bulletList'),
            label: 'Bullet List',
            icon: List
        },
        {
            property: "orderedList",
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive('orderedList'),
            label: 'Ordered List',
            icon: ListOrdered
        }

    ]

}

export function ProvideTextAlignMenuItems(editor: Editor): MenuItems[] {
    return [
        {
            property: 'left',
            action: () => editor.chain().focus().setTextAlign('left').run(),
            isActive: () => editor.isActive({ textAlign: 'left' }),
            label: 'Left',
            icon: AlignLeft
        },
        {
            property: 'center',
            action: () => editor.chain().focus().setTextAlign('center').run(),
            isActive: () => editor.isActive({ textAlign: 'center' }),
            label: 'Center',
            icon: AlignCenter
        },
        {
            property: 'right',
            action: () => editor.chain().focus().setTextAlign('right').run(),
            isActive: () => editor.isActive({ textAlign: 'right' }),
            label: 'Right',
            icon: AlignRight
        }
    ]
}


export function ProvideMenuButtonItems(editor: Editor): MenuButtonItems[] {
    return [
        {
            property: 'undo',
            action: () => editor.chain().focus().undo().run(),
            disabled: () => !editor.can().undo(),
            label: 'Undo',
            icon: Undo
        },
        {
            property: 'redo',
            action: () => editor.chain().focus().redo().run(),
            disabled: () => !editor.can().redo(),
            label: 'Redo',
            icon: Redo
        }
    ]
}