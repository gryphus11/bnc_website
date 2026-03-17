"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProductCard from './components/ProductCard';
import { MENU_DATA } from './constants/menuData';

export default function Home() {
  const [currentCategory, setCurrentCategory] = useState("제품소개");
  const [currentSub, setCurrentSub] = useState("Airfoil Group");
  const [products, setProducts] = useState<any[]>([]); // DB에서 가져온 제품들
  const [loading, setLoading] = useState(false);

  // 메뉴 클릭 시 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('category', currentSub) // 현재 선택된 서브메뉴(그룹명)와 일치하는 것만
        .order('id', { ascending: false });

      if (error) {
        console.error("데이터 로드 실패:", error.message);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    if (currentCategory === "제품소개") {
      fetchProducts();
    }
  }, [currentSub, currentCategory]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar onMenuClick={(cat, sub) => { setCurrentCategory(cat); setCurrentSub(sub); }} />

      <div className="max-w-7xl mx-auto flex py-12 px-6">
        <Sidebar
          category={currentCategory}
          // MENU_DATA[currentCategory]가 없을 경우를 대비해 || [] 를 추가합니다
          subMenus={MENU_DATA[currentCategory] || []}
          activeSub={currentSub}
          onSubClick={setCurrentSub}
        />

        <main className="flex-1 ml-12">
          <div className="flex justify-between items-center border-b pb-4 mb-8">
            <h4 className="text-2xl font-semibold text-gray-800">{currentSub}</h4>
            <nav className="text-sm text-gray-400">홈 &gt; {currentCategory} &gt; {currentSub}</nav>
          </div>

          // src/app/page.tsx 내 main 콘텐츠 렌더링 부분 수정

          <div className="min-h-[500px]">
            {loading ? (
              <div className="text-center py-20 text-gray-400">데이터를 불러오는 중입니다...</div>
            ) : products.length > 0 ? (
              /* 1. 카테고리가 공지사항계열일 때 테이블로 표시 */
              ["공지사항", "일반자료실", "기술자료실"].includes(currentSub) ? (
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="p-4 font-bold text-gray-600">번호</th>
                        <th className="p-4 font-bold text-gray-600">제목</th>
                        <th className="p-4 font-bold text-gray-600">작성일</th>
                        <th className="p-4 font-bold text-gray-600">조회수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((item, idx) => (
                        <tr
                          key={item.id}
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => router.push(`/notice/${item.id}`)} // 상세페이지 연결
                        >
                          <td className="p-4 text-gray-500">{products.length - idx}</td>
                          <td className="p-4 font-medium">{item.title}</td>
                          <td className="p-4 text-gray-500 text-sm">{item.date}</td>
                          <td className="p-4 text-gray-500 text-sm">{item.views}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* 2. 제품 카테고리일 때 기존처럼 카드 형식으로 표시 */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((item) => (
                    <ProductCard
                      key={item.id}
                      product={{
                        id: item.id,
                        name: item.title,
                        category: item.category,
                        description: item.content.substring(0, 50) + "...",
                        imageUrl: item.images && item.images.length > 0 ? item.images[0] : "/images/no-image.jpg"
                      }}
                    />
                  ))}
                </div>
              )
            ) : (
              /* 데이터가 없을 때 */
              <div className="col-span-full py-20 text-center text-gray-400 bg-white rounded-lg border-2 border-dashed">
                [{currentSub}] 그룹에 등록된 내용이 없습니다.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}