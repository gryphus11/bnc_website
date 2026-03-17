"use client";

import React, { useEffect, useState } from 'react';
// @ts-ignore
import { useEditor, EditorContent } from '@tiptap/react';

// @ts-ignore
import StarterKit from '@tiptap/starter-kit';

// @ts-ignore
import Link from '@tiptap/extension-link';

// @ts-ignore
import Image from '@tiptap/extension-image';

// 에디터 스타일을 위한 최소한의 CSS (파일 상단 혹은 전역 CSS에 추가 권장)
const editorStyles = `
  .ProseMirror {
    min-height: 300px;
    padding: 1rem;
    outline: none;
  }
  .ProseMirror p { margin-bottom: 0.5rem; }
  .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; }
  .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; }
`;

export default function RichEditor({ value, onChange }: { value: string; onChange: (content: string) => void }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none border rounded-b-lg bg-white',
      },
    },
  });

  if (!isMounted || !editor) return <div className="h-[350px] bg-gray-50 border rounded-lg animate-pulse" />;

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <style>{editorStyles}</style>
      {/* 툴바 */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : ''}`}><b>B</b></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : ''}`}><i>I</i></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : ''}`}>• List</button>
        <button type="button" onClick={() => {
          const url = window.prompt('이미지 URL을 입력하세요:');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }} className="p-2">🖼️</button>
      </div>
      {/* 에디터 본체 */}
      <EditorContent editor={editor} />
    </div>
  );
}