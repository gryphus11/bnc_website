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

          <div>
            <label className="block text-sm font-bold mb-2">내용</label>
            <textarea className="w-full border p-3 rounded-lg h-64" value={content} onChange={e => setContent(e.target.value)} required />
          </div>

          {/* 이미지 수정 섹션 */}
          <div className="p-4 bg-gray-50 rounded-lg border border-dashed">
            <label className="block text-sm font-bold mb-2">제품 이미지 (새로 선택 시 기존 이미지 대체)</label>
            {existingImages.length > 0 && (
              <div className="flex gap-2 mb-3">
                {existingImages.map((url, i) => <img key={i} src={url} className="w-20 h-20 object-cover rounded border" />)}
              </div>
            )}
            <input type="file" multiple accept="image/*" onChange={e => setNewImageFiles(Array.from(e.target.files || []))} />
          </div>

          {/* 유튜브 및 첨부파일 (등록 페이지와 동일하게 추가) */}
          <div>
            <label className="block text-sm font-bold mb-2">YouTube 링크</label>
            <input className="w-full border p-3 rounded-lg" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://youtube.com/..." />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">첨부파일 추가</label>
            <input type="file" multiple onChange={e => setNewAttachFiles(Array.from(e.target.files || []))} />
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