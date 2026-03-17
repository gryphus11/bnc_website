"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase'; //
import AdminLayout from '../../components/admin/AdminLayout';

export default function AddProductPage() {
  const router = useRouter();
  
  // 1. 입력 데이터를 관리할 상태(State) 선언
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("공지사항");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. 저장 버튼 클릭 시 실행될 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Supabase 'notices' 테이블에 데이터 삽입
      const { error } = await supabase
        .from('notices')
        .insert([
          { 
            title: title, 
            category: category, 
            content: content,
            author: "관리자 Jae Hoon Sim", // 작성자 고정
            views: 0
          }
        ]);

      if (error) throw error;

      alert("게시글이 성공적으로 저장되었습니다!");
      router.push('/'); // 저장 후 메인 페이지(목록)로 이동
    } catch (error: any) {
      alert("저장 중 오류가 발생했습니다: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="새 게시글 등록">
      <div className="max-w-4xl bg-white rounded-xl shadow-sm p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold">제목</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="게시글 제목을 입력하세요" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold">카테고리</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="공지사항">공지사항</option>
                <option value="일반자료실">일반자료실</option>
                <option value="기술자료실">기술자료실</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold">내용</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border p-2 rounded h-64" 
              placeholder="게시글 내용을 입력하세요."
            ></textarea>
          </div>

          <div className="pt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={() => router.back()} 
              className="px-6 py-2 border rounded-lg hover:bg-gray-100"
            >
              취소
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-6 py-2 text-white rounded-lg shadow-lg ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? "저장 중..." : "게시글 저장하기"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}