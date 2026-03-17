// src/app/components/NoticeTable.tsx
import React from 'react';
import { Notice } from '../constants/noticeData';
import Link from 'next/link'; // 1. Link 컴포넌트 추가

export default function NoticeTable({ notices }: { notices: Notice[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-t-2 border-gray-800 text-sm">
        <thead>
          <tr className="bg-gray-50 border-b text-gray-600">
            <th className="px-4 py-3 w-16 text-center">번호</th>
            <th className="px-4 py-3 text-left">제목</th>
            <th className="px-4 py-3 w-24 text-center">작성자</th>
            <th className="px-4 py-3 w-28 text-center">작성일</th>
            <th className="px-4 py-3 w-20 text-center">조회수</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {notices.length > 0 ? (
            notices.map((notice) => (
              <tr key={notice.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                <td className="px-4 py-4 text-center text-gray-500">{notice.id}</td>
                {/* 2. 제목 부분을 Link 태그로 감싸줍니다. */}
                <td className="px-4 py-4 font-medium text-blue-800 hover:underline">
                  <Link href={`/notice/${notice.id}`} className="block w-full">
                    {notice.title}
                  </Link>
                </td>
                <td className="px-4 py-4 text-center text-gray-600">{notice.author}</td>
                <td className="px-4 py-4 text-center text-gray-500">{notice.date}</td>
                <td className="px-4 py-4 text-center text-gray-500">{notice.views.toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-20 text-center text-gray-400">등록된 게시물이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* 하단 페이지네이션 (디자인용) */}
      <div className="flex justify-center space-x-2 mt-8">
        <button className="px-3 py-1 border rounded text-gray-400 hover:bg-gray-50">{"<"}</button>
        <button className="px-3 py-1 border rounded bg-blue-700 text-white">1</button>
        <button className="px-3 py-1 border rounded text-gray-400 hover:bg-gray-50">{">"}</button>
      </div>
    </div>
  );
}