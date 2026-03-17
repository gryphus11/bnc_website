"use client";
import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { PRODUCT_LIST } from '../constants/productData';

export default function AdminPage() {
  return (
    <AdminLayout title="제품 관리 목록">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg">등록된 제품 ({PRODUCT_LIST.length})</h3>
          <button 
            onClick={() => window.location.href = '/admin/add-product'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + 새 제품 등록
          </button>
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">제품명</th>
              <th className="px-6 py-4">카테고리</th>
              <th className="px-6 py-4">풍량 (m³/min)</th>
              <th className="px-6 py-4">정압 (mmAq)</th>
              <th className="px-6 py-4">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {PRODUCT_LIST.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                <td className="px-6 py-4">{product.spec.volume}</td>
                <td className="px-6 py-4">{product.spec.pressure}</td>
                <td className="px-6 py-4 space-x-3">
                  <button className="text-blue-600 hover:underline">수정</button>
                  <button className="text-red-500 hover:underline">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}