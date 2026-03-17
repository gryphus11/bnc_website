"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AddProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Airfoil Group");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]); // 파일들을 담을 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("제목과 내용을 입력해주세요.");
    setIsSubmitting(true);

    try {
      const imageUrls: string[] = [];

      // 1. Supabase Storage에 이미지들 업로드
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('board-images') // 생성하신 버킷 이름
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // 업로드된 파일의 공개 URL 가져오기
        const { data: { publicUrl } } = supabase.storage
          .from('board-images')
          .getPublicUrl(fileName);
        
        imageUrls.push(publicUrl);
      }

      // 2. DB에 최종 데이터 저장 (이미지 URL 배열 포함)
      const { error } = await supabase
        .from('notices')
        .insert([{
          title,
          category,
          content,
          images: imageUrls, // 추출된 URL 배열 저장
          author: "관리자 Jae Hoon Sim",
          views: 0,
          date: new Date().toISOString().split('T')[0]
        }]);

      if (error) throw error;

      alert("성공적으로 저장되었습니다!");
      router.push('/'); 
    } catch (err: any) {
      alert("오류 발생: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="새 게시글 등록">
      <div className="max-w-4xl bg-white rounded-xl shadow-sm p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <input 
              className="border p-2 rounded w-full" 
              placeholder="제목을 입력하세요" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
            <select 
              className="border p-2 rounded w-full" 
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
          <textarea 
            className="w-full border p-2 rounded h-64" 
            placeholder="내용을 입력하세요" 
            value={content} 
            onChange={e => setContent(e.target.value)} 
          />
          <div className="space-y-2">
            <label className="block text-sm font-bold">이미지 첨부 (여러 장 가능)</label>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={e => setFiles(Array.from(e.target.files || []))} 
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-bold text-white shadow-lg ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? "데이터 처리 중..." : "게시글 저장하기"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}