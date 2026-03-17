"use client";

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// SSR 방지를 위해 dynamic import 사용
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <p className="p-4 border rounded">에디터 로딩 중...</p>
});

interface RichEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function RichEditor({ value, onChange }: RichEditorProps) {
  
  // 에디터 툴바 설정
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'image', 'video'], // 이미지, 영상 삽입 가능
        ['clean']
      ],
    }
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'link', 'image', 'video', 'color', 'background'
  ];

  return (
    <div className="bg-white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="h-96 mb-12" // 에디터 본체 높이 조절
      />
    </div>
  );
}