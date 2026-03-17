import React from 'react';
import { Product } from '../constants/productData';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      {/* 제품 이미지 */}
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="group-hover:scale-105 transition-transform duration-300 object-cover w-full h-full"
        />
      </div>
      
      {/* 제품 설명 */}
      <div className="p-5">
        <span className="text-xs text-blue-600 font-bold uppercase">{product.category}</span>
        <h5 className="text-lg font-bold mt-1 mb-2">{product.name}</h5>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{product.description}</p>
        
        {/* 간이 사양표 */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b text-center text-[10px] bg-gray-50 uppercase font-semibold text-gray-600">
          <div>
            <div className="text-gray-400">풍량</div>
            <div>{product.spec.volume}</div>
          </div>
          <div>
            <div className="text-gray-400">정압</div>
            <div>{product.spec.pressure}</div>
          </div>
          <div>
            <div className="text-gray-400">동력</div>
            <div>{product.spec.power}</div>
          </div>
        </div>
        
        <button className="w-full mt-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-blue-700 transition-colors">
          상세보기
        </button>
      </div>
    </div>
  );
}