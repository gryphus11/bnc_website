"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase'; // 경로 확인 필요
import AdminLayout from '../components/admin/AdminLayout';

export default function AdminDashboard() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]); // DB에서 가져올 데이터 상태
  const [loading, setLoading] = useState(true);

  // 1. 실제 DB 데이터 불러오기
  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('id', { ascending: false }); // 최신글이 위로

      if (error) {
        console.error("데이터 로드 에러:", error.message);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };

    fetchAdminData();
  }, []);

  // 2. 게시글 삭제 함수 (실제 DB에서 삭제)
  const handleDelete = async (id: number) => {
    if (!confirm("정말로 삭제하시겠습니까?")) return;

    try {
      // [수정] await를 사용하여 DB 삭제가 완료될 때까지 기다립니다.
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id);

      if (error) {
        // 정책(RLS) 문제 등으로 삭제가 거부된 경우 에러 출력
        alert("삭제 실패: " + error.message);
        return;
      }

      // DB 삭제가 성공한 경우에만 화면(State)에서 제거합니다.
      alert("성공적으로 삭제되었습니다.");
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert("알 수 없는 에러가 발생했습니다.");
    }
  };

  return (
    <AdminLayout title="게시글 관리">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg">전체 게시글 목록 ({items.length})</h3>
          <button
            onClick={() => router.push('/admin/add-product')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            + 새 제품/공지 등록
          </button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4">카테고리</th>
              <th className="p-4">제목</th>
              <th className="p-4">작성일</th>
              <th className="p-4 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={4} className="p-10 text-center text-gray-400">데이터를 불러오는 중...</td></tr>
            ) : items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-gray-800">{item.title}</td>
                  <td className="p-4 text-sm text-gray-500">{item.date}</td>
                  <td className="p-4 text-center space-x-2">
                    <button
                      onClick={() => router.push(`/notice/${item.id}`)}
                      className="text-gray-500 hover:text-blue-600 text-sm"
                    >
                      보기
                    </button>
                    <button
                      onClick={() => router.push(`/admin/edit-product/${item.id}`)} // 수정 페이지 연결
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)} // 기존 삭제 함수
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="p-10 text-center text-gray-400">등록된 게시글이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}