"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import dynamic from 'next/dynamic';

// 1. 에디터를 동적으로 로드하여 SSR 에러 방지 (중요!)
const RichEditor = dynamic(() => import('../../components/RichEditor'), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />
});

export default function AddProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Airfoil Group");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 상태 통합: 첨부용 파일들
  const [newAttachFiles, setNewAttachFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewAttachFiles(filesArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("제목과 내용을 입력해주세요.");
    setIsSubmitting(true);

    try {
      const attachmentUrls: string[] = [];

      // 2. Supabase Storage에 첨부파일들 업로드
      for (const file of newAttachFiles) {
        // 한글 파일명 깨짐 방지를 위해 타임스탬프 활용
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('board-images') // 버킷 이름 확인 (첨부파일용 버킷이 따로 있다면 수정)
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('board-images')
          .getPublicUrl(fileName);
        
        attachmentUrls.push(publicUrl);
      }

      // 3. DB에 최종 데이터 저장
      const { error } = await supabase
        .from('notices')
        .insert([{
          title,
          category,
          content, // 에디터의 HTML 내용
          attachments: attachmentUrls, // 'images' 대신 'attachments' 컬럼명이 맞는지 확인하세요
          author: "관리자 Jae Hoon Sim",
          views: 0,
          date: new Date().toISOString().split('T')[0]
        }]);

      if (error) throw error;

      alert("성공적으로 저장되었습니다!");
      router.push('/admin'); // 관리자 목록으로 이동
    } catch (err: any) {
      alert("오류 발생: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="새 게시글 등록">
      <div className="max-w-4xl bg-white rounded-xl shadow-sm p-8 mx-auto">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <input 
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="제목을 입력하세요" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
            <select 
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none" 
              value={category} 
              onChange={e => setCategory(e.target.value)}
            >
              <option value="Airfoil Group">Airfoil Group</option>
              <option value="Multi Blade Group">Multi Blade Group</option>
              <option value="Axial Group">Axial Group</option>
              <option value="Industrial Group">Industrial Group</option>
              <option value="Make Up Air Group">Make Up Air Group</option>
              <option value="Building Exhaust Group">Building Exhaust Group</option>
              <option value="주차장 환기 시스템">주차장 환기 시스템</option>
              <option value="터널환기&제연시스템">터널환기&제연시스템</option>
              <option value="Intake Air Filter & Silencer">Intake Air Filter & Silencer</option>
              <option value="공지사항">공지사항</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">상세 설명</label>
            {/* Tiptap 에디터 */}
            <RichEditor value={content} onChange={setContent} />
          </div>

          <div className="p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 mt-4">
            <label className="block text-sm font-bold mb-3 text-gray-700">
              📎 첨부파일 (PDF, 도면, 문서 등)
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {newAttachFiles.length > 0 && (
              <div className="mt-2 text-xs text-blue-600 font-medium">
                선택된 파일 {newAttachFiles.length}개
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-lg font-bold text-white shadow-md transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}`}
          >
            {isSubmitting ? "업로드 중..." : "게시글 저장하기"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}