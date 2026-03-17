// app/constants/productData.ts
export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  spec: {
    volume: string;     // 풍량 (m³/min)
    pressure: string;   // 정압 (mmAq)
    power: string;      // 동력 (kW)
  };
  imageUrl: string;
}

export const PRODUCT_LIST: Product[] = [
  {
	id: 1,
    name: "AF-100", 
    category: "Airfoil Group", // MENU_DATA의 리스트 항목과 일치
    description: "고성능 에어포일 송풍기입니다.",
    spec: { volume: "50 ~ 200", pressure: "10 ~ 100", power: "0.75 ~ 15" },
    imageUrl: "http://www.bncblower.co.kr/file/product/AIRFOILDIDW(1).JPG"
  },
  {
    id: 2,
    name: "Sirocco Fan",
	category: "Multi Blade Group", // MENU_DATA의 리스트 항목과 일치
    description: "작은 공간에서 고풍량을 내며 주방 환기 및 일반 배기에 최적화되어 있습니다.",
    spec: { volume: "10 ~ 500", pressure: "10 ~ 100", power: "0.4 ~ 30" },
    imageUrl: "http://www.bncblower.co.kr/file/product/SIROCCO%20DIDW.JPG"
  },
  {
	id: 3,
    name: "AF-200", 
    category: "Airfoil Group", // MENU_DATA의 리스트 항목과 일치
    description: "고성능 에어포일 송풍기입니다.",
    spec: { volume: "50 ~ 200", pressure: "10 ~ 100", power: "0.75 ~ 15" },
    imageUrl: "http://www.bncblower.co.kr/file/product/AIRFOILDIDW(1).JPG"
  },
];