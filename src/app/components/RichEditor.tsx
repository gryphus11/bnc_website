// src/app/components/RichEditor.tsx
"use client";

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="h-40 border rounded bg-gray-50 animate-pulse" />
});

export default function RichEditor({ value, onChange }: { value: string; onChange: (content: string) => void }) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), []);

  return (
    <div className="bg-white pb-12"> {/* 하단 툴바 겹침 방지 여백 */}
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        modules={modules}
        style={{ height: '300px' }} // 에디터 높이 설정
      />
    </div>
  );
}