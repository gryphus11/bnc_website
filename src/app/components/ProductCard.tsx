// src/app/components/ProductCard.tsx
import Link from 'next/link';

export default function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/notice/${product.id}`}> {/* 상세 페이지 연결 */}
      <div className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer bg-white">
        <div className="w-full h-[200px] bg-gray-100 flex items-center justify-center overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="group-hover:scale-105 transition-transform duration-300 object-cover w-full h-full"
          />
        </div>
        <div className="p-4">
          <p className="text-xs text-blue-600 font-semibold mb-1">{product.category}</p>
          <h5 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{product.name}</h5>
          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        </div>
      </div>
    </Link>
  );
}