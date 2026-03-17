"use client";

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

interface RichEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function RichEditor({ value, onChange }: RichEditorProps) {
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
    // SSR 시점의 불일치를 방지하기 위해 내용 업데이트 방식을 개선
    onUpdate: ({ editor }: any) => { 
        onChange(editor.getHTML()); 
      },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none border rounded-b-lg bg-white p-4 min-h-[350px] overflow-y-auto',
      },
    },
  });

  // Hydration Error 방지: 서버와 클라이언트의 첫 렌더링을 일치시킴
  if (!isMounted || !editor) {
    return (
      <div className="h-[400px] bg-gray-50 border rounded-lg flex items-center justify-center text-gray-400">
        에디터를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm flex flex-col">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 sticky top-0 z-10">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : ''}`}
        >
          <b>B</b>
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('이미지 URL을 입력하세요:');
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          className="p-2 hover:bg-gray-200 rounded"
        >
          🖼️ 이미지
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}