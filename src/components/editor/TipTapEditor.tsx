import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { EditorMenuBar } from './EditorMenuBar';

interface TipTapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

export const TipTapEditor = ({
  content = '',
  onChange,
  placeholder = 'Start writing...',
}: TipTapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none max-w-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      <EditorMenuBar editor={editor} />
      <div className="flex-1 overflow-auto p-6">
        <EditorContent editor={editor} className="min-h-full focus:outline-none" />
      </div>
    </div>
  );
};
