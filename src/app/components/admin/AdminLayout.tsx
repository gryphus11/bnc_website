import React from 'react';

export default function AdminLayout({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* 관리자 사이드바 */}
      <aside className="w-64 bg-slate-800 text-white p-6">
        <h2 className="text-xl font-bold mb-8">BnC Admin</h2>
        <nav className="space-y-4">
          <div className="text-blue-400 text-xs uppercase font-bold tracking-widest">Management</div>
          <a href="/admin" className="block p-2 hover:bg-slate-700 rounded transition">제품 관리</a>
          <a href="#" className="block p-2 hover:bg-slate-700 rounded transition">고객지원/AS 관리</a>
          <a href="#" className="block p-2 hover:bg-slate-700 rounded transition">자료실 관리</a>
        </nav>
      </aside>

      {/* 메인 영역 */}
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">관리자 Jae Hoon Sim님</span>
            <button className="bg-white border px-3 py-1 rounded text-sm hover:bg-gray-50">로그아웃</button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}