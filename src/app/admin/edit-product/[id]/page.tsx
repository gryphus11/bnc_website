"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import AdminLayout from '../../../components/admin/AdminLayout';
import dynamic from 'next/dynamic'; // 추가

// 1. 에디터를 동적으로 로드 (SSR 에러 방지)
const RichEditor = dynamic(() => import('../../../components/RichEditor'), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />
});

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Airfoil Group");
  const [author, setAuthor] = useState("관리자 Jae Hoon Sim");
  const [content, setContent] = useState("");
  
  // 미디어 관련 상태
  const [existingAttachments, setExistingAttachments] = useState<string[]>([]);
  const [newAttachFiles, setNewAttachFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewAttachFiles(files);
  };

  // 1. 기존 데이터 불러오기
  useEffect(() => {
    const fetchDetail = async () => {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (data) {
        setTitle(data.title);
        setCategory(data.category);
        setAuthor(data.author || "관리자 Jae Hoon Sim");
        setContent(data.content);
        setExistingAttachments(data.attachments || []); // 기존 첨부파일 URL들
      }
    };
    if (params.id) fetchDetail();
  }, [params.id]);

  // 2. 수정 데이터 저장
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("제목과 내용을 입력해주세요.");
    setIsSubmitting(true);

    try {
      let finalAttachments = [...existingAttachments];

      // 새로운 첨부파일이 있다면 업로드
      if (newAttachFiles.length > 0) {
        const uploadedUrls = [];
        for (const file of newAttachFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('board-images')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('board-images')
            .getPublicUrl(fileName);
          
          uploadedUrls.push(publicUrl);
        }
        // 기존 파일 유지 + 새 파일 추가 (또는 새 파일로 교체하려면 finalAttachments = uploadedUrls)
        finalAttachments = [...finalAttachments, ...uploadedUrls];
      }

      // DB 업데이트
      const { error } = await supabase
        .from('notices')
        .update({
          title,
          category,
          author,
          content,
          attachments: finalAttachments,
          date: new Date().toISOString().split('T')[0]
        })
        .eq('id', params.id);

      if (error) throw error;

      alert("수정 완료되었습니다.");
      router.push('/admin');
    } catch (err: any) {
      alert("수정 중 오류 발생: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="게시글 수정">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">제목</label>
              <input 
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">카테고리</label>
              <select 
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
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
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">내용 수정 (에디터)</label>
            <RichEditor value={content} onChange={setContent} />
          </div>

          <div className="p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <label className="block text-sm font-bold mb-3 text-gray-700">
              📎 새 첨부파일 추가 (PDF, 도면 등)
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {existingAttachments.length > 0 && (
              <p className="mt-3 text-xs text-gray-500 italic">
                * 현재 {existingAttachments.length}개의 기존 파일이 등록되어 있습니다.
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              type="button" 
              onClick={() => router.back()} 
              className="flex-1 py-4 bg-gray-100 rounded-lg font-bold hover:bg-gray-200 transition"
            >
              취소
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className={`flex-1 py-4 bg-blue-600 text-white rounded-lg font-bold shadow-md transition ${isSubmitting ? 'bg-gray-400' : 'hover:bg-blue-700'}`}
            >
              {isSubmitting ? "수정 저장 중..." : "수정 완료"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}