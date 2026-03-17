"use client"; // 최상단에 반드시 있어야 합니다.

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
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // 내용이 바뀔 때마다 부모 상태 업데이트
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[300px] p-4 border rounded-b-lg',
      },
    },
  });

  if (!editor) return null;

  // 툴바 버튼 컴포넌트
  const MenuButton = ({ onClick, isActive, children }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 px-3 rounded hover:bg-gray-200 transition ${isActive ? 'bg-blue-100 text-blue-600 font-bold' : 'text-gray-600'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* 툴바 영역 */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>B</MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>I</MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>S</MenuButton>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>• List</MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>1. List</MenuButton>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('이미지 URL을 입력하세요:');
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded"
        >
          🖼️ Image
        </button>
      </div>

      {/* 에디터 본문 */}
      <EditorContent editor={editor} />
    </div>
  );
}