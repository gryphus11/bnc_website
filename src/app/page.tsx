"use client";
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase'; // 설정한 클라이언트 불러오기

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import { PRODUCT_LIST } from './constants/productData';
import ProductCard from './components/ProductCard'; // 파일명 주의 (.tsx.tsx로 되어있다면 해당 이름으로)

import { NOTICE_LIST } from './constants/noticeData'; // 데이터 추가
import NoticeTable from './components/NoticeTable'; // 컴포넌트 추가

export default function HomePage() {
  const [currentCategory, setCurrentCategory] = useState("고객지원");
  const [currentSub, setCurrentSub] = useState("공지사항");
  
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    // DB에서 데이터 가져오는 함수
    const fetchNotices = async () => {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setNotices(data);
    };

    fetchNotices();
  }, []);

  const handleMenuChange = (menu: string, sub: string) => {
    setCurrentCategory(menu);
    setCurrentSub(sub);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      <Navbar onMenuClick={handleMenuChange} />

      {/* 배너 생략 (필요시 컴포넌트로 분리 가능) */}
      <div className="h-40 bg-slate-100 border-b flex items-center justify-center">
        <h2 className="text-3xl font-light text-gray-800">
          신뢰할 수 있는 기술과 품질로 <span className="font-bold">최고의 가치를 실현합니다.</span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto w-full flex flex-1 px-4 py-12">
        <Sidebar 
          currentCategory={currentCategory} 
          currentSub={currentSub} 
          onSubClick={(sub) => setCurrentSub(sub)} 
        />

        {/* HomePage 컴포넌트 내부의 메인 콘텐츠 영역 수정 */}
		<main className="flex-1 ml-12">
		  <div className="flex justify-between items-center border-b pb-4 mb-8">
			<h4 className="text-2xl font-semibold text-gray-800">{currentSub}</h4>
			<nav className="text-sm text-gray-400">홈 &gt; {currentCategory} &gt; {currentSub}</nav>
		  </div>
		  
		  <div className="min-h-[500px]">
			{/* 1. 제품소개 카테고리일 때 */}
			{currentCategory === "제품소개" ? (
			  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{PRODUCT_LIST
				  .filter(product => product.category === currentSub) // 서브 메뉴명이 제품의 카테고리와 일치해야 함
				  .map(product => (
					<ProductCard key={product.id} product={product} />
				  ))
				}
				{/* 필터링 결과가 없을 때 안내 문구 */}
				{PRODUCT_LIST.filter(p => p.category === currentSub).length === 0 && (
				  <div className="col-span-full py-20 text-center text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">
					[{currentSub}] 그룹의 제품 정보를 준비 중입니다.
				  </div>
				)}
			  </div>
			) : 
			/* 2. 공지사항이나 자료실 등 게시판 형태일 때 */
			["공지사항", "일반자료실", "기술자료실"].includes(currentSub) ? (
			  <NoticeTable notices={notices.filter(n => n.category === currentSub || currentSub === "공지사항")} />
			) : (
			  /* 3. 그 외 준비 중인 페이지 */
			  <div className="bg-white rounded-lg border p-6 text-center text-gray-500">
				[{currentSub}] 콘텐츠 준비 중입니다.
			  </div>
			)}
		  </div>
		</main>
      </div>
      
      {/* Footer도 별도 파일로 만들어 import 해서 사용하세요! */}
    </div>
  );
}