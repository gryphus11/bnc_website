"use client";

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

export default function RichEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({ allowBase64: true }),
    ],
    content: value,
    onUpdate: ({ editor }: any) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none border rounded-b-lg bg-white p-4 min-h-[350px]',
      },
    },
  });

  if (!isMounted || !editor) {
    return <div className="h-[400px] bg-gray-100 border rounded-lg animate-pulse flex items-center justify-center text-gray-400">에디터 엔진 시동 중...</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded ${editor.isActive('bold') ? 'bg-blue-100' : ''}`}><b>B</b></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-blue-100' : ''}`}>• List</button>
        <button type="button" onClick={() => {
          const url = window.prompt('이미지 URL:');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }} className="p-2">🖼️</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}