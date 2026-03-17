// src/app/components/Sidebar.tsx

export default function Sidebar({ category, subMenus = [], activeSub, onSubClick }: any) {
  // subMenus가 없을 경우를 위해 기본값을 []로 설정하거나 아래처럼 체크합니다
  if (!subMenus || subMenus.length === 0) {
    return <aside className="w-64">메뉴가 없습니다.</aside>;
  }

  return (
    <aside className="w-64">
      <h3 className="text-xl font-bold mb-6">{category}</h3>
      <ul className="space-y-2">
        {subMenus.map((sub: string) => (
          <li 
            key={sub}
            onClick={() => onSubClick(sub)}
            className={`cursor-pointer p-2 rounded ${activeSub === sub ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
          >
            {sub}
          </li>
        ))}
      </ul>
    </aside>
  );
}