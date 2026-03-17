"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AddProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Airfoil Group"); // 기본값 변경
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("제목과 내용을 입력해주세요.");
    setIsSubmitting(true);

    try {
      const imageUrls = [];

      // 1. 이미지 Storage 업로드
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data, error: uploadError } = await supabase.storage
          .from('board-images') // 생성하신 버킷 이름
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('board-images')
          .getPublicUrl(fileName);
        
        imageUrls.push(publicUrl);
      }

      // 2. DB 저장
      const { error } = await supabase
        .from('notices')
        .insert([{
          title,
          category,
          content,
          images: imageUrls, // URL 배열 저장
          author: "관리자 Jae Hoon Sim",
          views: 0,
          date: new Date().toISOString().split('T')[0]
        }]);

      if (error) throw error;

      alert("게시글이 성공적으로 등록되었습니다.");
      router.push('/'); 
    } catch (err: any) {
      alert("오류 발생: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="새 게시글 등록">
      <form onSubmit={handleSubmit} className="max-w-4xl bg-white p-8 rounded-xl shadow-sm space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <input 
            className="border p-2 rounded" 
            placeholder="제목" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
          />
          <select 
            className="border p-2 rounded" 
            value={category} 
            onChange={e => setCategory(e.target.value)}
          >
            {/* 개편된 9개 그룹을 옵션으로 제공 */}
            <option value="Airfoil Group">Airfoil Group</option>
            <option value="Multi Blade Group">Multi Blade Group</option>
            <option value="Axial Group">Axial Group</option>
            <option value="Industrial Group">Industrial Group</option>
            {/* ... 나머지 그룹 추가 */}
          </select>
        </div>
        <textarea 
          className="w-full border p-2 rounded h-40" 
          placeholder="내용" 
          value={content} 
          onChange={e => setContent(e.target.value)} 
        />
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={e => setFiles(Array.from(e.target.files || []))} 
        />
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold"
        >
          {isSubmitting ? "처리 중..." : "게시글 저장하기"}
        </button>
      </form>
    </AdminLayout>
  );
}