// components/markdown-editor.tsx
import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'
import { Toggle } from '@/components/ui/toggle'
import { Bold, Heading2, List } from 'lucide-react'

type Props = {
  value: string
  onChange: (md: string) => void
  onReady?: (md: string) => void
}

export function MarkdownEditor({ value, onChange, onReady}: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    content: value,
    contentType: 'markdown',
    immediatelyRender: false, 
    shouldRerenderOnTransaction: true,
    onCreate: ({ editor }) => onReady?.(editor.getMarkdown()),
    onUpdate: ({ editor }) => onChange(editor.getMarkdown()),
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none min-h-[200px] p-3  focus:outline-none',
      },
    },
  })

  if (!editor) return null

  return (
    <div className="w-full rounded-md border border-input bg-transparent">
      {/* <div className="flex gap-1 border-b border-input p-1">
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Toggle>
      </div> */}
      <EditorContent editor={editor} />
    </div>
  )
}