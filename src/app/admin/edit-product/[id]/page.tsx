"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import AdminLayout from '../../../components/admin/AdminLayout';
import RichEditor from '../../../components/RichEditor';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  
  // 상태 관리 (등록 페이지와 동일하게 구성)
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Airfoil Group");
  const [author, setAuthor] = useState("관리자");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  
  // 미디어 관련 상태
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<any[]>([]);
  const [newAttachFiles, setNewAttachFiles] = useState<File[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []); // 선택된 파일들을 배열로 변환
    setNewAttachFiles(files); // 상태에 저장
    console.log("선택된 파일들:", files); // 디버깅용
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
        setAuthor(data.author || "관리자");
        setContent(data.content);
        setVideoUrl(data.videoUrl || "");
        setExistingImages(data.images || []);
        setExistingAttachments(data.attachments || []);
      }
    };
    if (params.id) fetchDetail();
  }, [params.id]);

  // 2. 수정 데이터 저장 (등록 로직과 동일하게 업로드 처리)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 새로운 이미지가 있다면 업로드, 없으면 기존 유지
      let finalImages = [...existingImages];
      if (newImageFiles.length > 0) {
        const uploadedImgUrls = [];
        for (const file of newImageFiles) {
          const fileName = `${Date.now()}_${file.name}`;
          const { error: err } = await supabase.storage.from('board-images').upload(fileName, file);
          if (err) throw err;
          const { data: { publicUrl } } = supabase.storage.from('board-images').getPublicUrl(fileName);
          uploadedImgUrls.push(publicUrl);
        }
        finalImages = uploadedImgUrls; // 새 이미지로 교체 (또는 추가 로직 가능)
      }

      // 새로운 첨부파일 업로드
      let finalAttach = [...existingAttachments];
      if (newAttachFiles.length > 0) {
        const uploadedFiles = [];
        for (const file of newAttachFiles) {
          const fileName = `files/${Date.now()}_${file.name}`;
          await supabase.storage.from('board-images').upload(fileName, file);
          const { data: { publicUrl } } = supabase.storage.from('board-images').getPublicUrl(fileName);
          uploadedFiles.push({ name: file.name, url: publicUrl });
        }
        finalAttach = [...finalAttach, ...uploadedFiles];
      }

      // DB 업데이트
      const { error } = await supabase
        .from('notices')
        .update({
          title,
          category,
          author,
          content,
          videoUrl,
          images: finalImages,
          attachments: finalAttach,
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
          {/* 기본 정보 입력 (등록 페이지와 동일 디자인) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">제목</label>
              <input className="w-full border p-3 rounded-lg" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">카테고리</label>
              <select className="w-full border p-3 rounded-lg" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Airfoil Group">Airfoil Group</option>
                <option value="Multi Blade Group">Multi Blade Group</option>
                <option value="공지사항">공지사항</option>
                <option value="일반자료실">일반자료실</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">내용 수정 (에디터)</label>
            <RichEditor value={content} onChange={setContent} />
          </div>

          <div className="p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <label className="block text-sm font-bold mb-3 text-gray-700">
              📎 첨부파일 (PDF, ZIP, 엑셀, 도면 등)
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-400 mt-2">* 본문 내용 외에 별도로 제공할 파일을 선택해 주세요.</p>
          </div>

          <div className="flex gap-4 pt-6">
            <button type="button" onClick={() => router.back()} className="flex-1 py-4 bg-gray-100 rounded-lg font-bold">취소</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-blue-600 text-white rounded-lg font-bold">
              {isSubmitting ? "수정 저장 중..." : "수정 완료"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}