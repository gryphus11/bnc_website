"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import AdminLayout from '../../../components/admin/AdminLayout';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  
  // 상태 관리
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]); // 기존 이미지
  const [newFiles, setNewFiles] = useState<File[]>([]); // 새 이미지 파일
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. 기존 데이터 불러오기
  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from('notices')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (data) {
        setTitle(data.title);
        setCategory(data.category);
        setContent(data.content);
        setVideoUrl(data.videoUrl || "");
        setExistingImages(data.images || []);
      }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  // 2. 수정 데이터 저장
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrls = [...existingImages];

      // 새 이미지가 선택되었다면 Storage에 업로드
      if (newFiles.length > 0) {
        const uploadedUrls = [];
        for (const file of newFiles) {
          const fileName = `${Date.now()}_${file.name}`;
          const { error: uploadError } = await supabase.storage.from('board-images').upload(fileName, file);
          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage.from('board-images').getPublicUrl(fileName);
          uploadedUrls.push(publicUrl);
        }
        finalImageUrls = uploadedUrls; // 새 이미지로 교체
      }

      // DB 업데이트 실행
      const { error } = await supabase
        .from('notices')
        .update({ 
          title, 
          category, 
          content, 
          videoUrl,
          images: finalImageUrls
        })
        .eq('id', params.id);

      if (error) throw error;

      alert("성공적으로 수정되었습니다.");
      router.push('/admin');
    } catch (err: any) {
      alert("수정 실패: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="게시글/제품 수정">
      <div className="max-w-4xl bg-white rounded-xl shadow-sm p-8">
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* 제목 및 카테고리 */}
          <div className="grid grid-cols-2 gap-4">
            <input className="border p-3 rounded" value={title} onChange={e => setTitle(e.target.value)} placeholder="제품명/제목" />
            <select className="border p-3 rounded" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="Airfoil Group">Airfoil Group</option>
              <option value="공지사항">공지사항</option>
              {/* 추가 카테고리... */}
            </select>
          </div>

          {/* 내용 및 영상 링크 */}
          <textarea className="w-full border p-3 rounded h-64" value={content} onChange={e => setContent(e.target.value)} />
          <input className="w-full border p-3 rounded" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="YouTube 영상 주소 (선택)" />

          {/* 이미지 수정 섹션 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-bold mb-3">이미지 수정</p>
            {existingImages.length > 0 && (
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {existingImages.map((url, i) => (
                  <img key={i} src={url} className="h-20 w-20 object-cover rounded border" alt="기존 이미지" />
                ))}
              </div>
            )}
            <input type="file" multiple accept="image/*" onChange={e => setNewFiles(Array.from(e.target.files || []))} className="text-sm" />
            <p className="text-xs text-gray-400 mt-2">* 새로운 파일을 선택하면 기존 이미지가 교체됩니다.</p>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">
            {isSubmitting ? "수정 중..." : "수정 내용 저장하기"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}