// src/app/notice/[id]/page.tsx
"use client";

import React, { useEffect, useState } from 'react'; // import는 최상단에
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';

export default function NoticeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [notice, setNotice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      const { data } = await supabase
        .from('notices')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (data) setNotice(data);
      setLoading(false);
    };
    if (params.id) fetchDetail();
  }, [params.id]);

  if (!notice) return <div className="p-10 text-center">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar onMenuClick={() => router.push('/')} />
      
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* 제목 섹션 */}
        <div className="border-t-2 border-gray-800 border-b py-6 mb-8 bg-gray-50 px-6">
          <h1 className="text-2xl font-bold">{notice.title}</h1>
          <div className="flex text-sm text-gray-500 mt-4 space-x-4">
            <span>작성자: {notice.author}</span>
            <span>날짜: {notice.date}</span>
          </div>
        </div>

        {/* 본문 텍스트 */}
        <div className="px-6 mb-10 text-gray-700 leading-relaxed whitespace-pre-wrap">
          {notice.content}
        </div>

        {/* 이미지 리스트 (여러 장) */}
        {notice.images && notice.images.length > 0 && (
          <div className="px-6 mb-10 space-y-4">
            {notice.images.map((img, idx) => (
              <img key={idx} src={img} alt={`첨부이미지 ${idx+1}`} className="w-full rounded shadow-sm" />
            ))}
          </div>
        )}

        {/* 영상 (Youtube Embed) */}
        {notice.videoUrl && (
          <div className="px-6 mb-10">
            <div className="aspect-video w-full">
              <iframe 
                className="w-full h-full rounded"
                src={notice.videoUrl}
                title="Product Video"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* 첨부파일/링크 섹션 */}
        {notice.attachments && (
          <div className="mx-6 p-4 bg-gray-100 rounded-lg">
            <h5 className="font-bold text-sm mb-2 italic">첨부파일 다운로드</h5>
            {notice.attachments.map((file, idx) => (
              <a key={idx} href={file.url} className="text-blue-600 hover:underline block text-sm">
                💾 {file.name}
              </a>
            ))}
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="mt-12 flex justify-center">
          <button onClick={() => router.back()} className="px-8 py-2 bg-gray-800 text-white rounded">
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
}