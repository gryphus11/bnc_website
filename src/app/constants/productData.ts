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
    name: "Airfoil Fan (AF 시리즈)",
    category: "원심형 송풍기",
    description: "고효율 및 저소음 설계로 대형 공조 및 산업용으로 적합합니다.",
    spec: { volume: "50 ~ 2,500", pressure: "50 ~ 350", power: "0.75 ~ 150" },
    imageUrl: "http://www.bncblower.co.kr/file/product/AIRFOILDIDW(1).JPG"
  },
  {
    id: 2,
    name: "Sirocco Fan (SF 시리즈)",
    category: "원심형 송풍기",
    description: "작은 공간에서 고풍량을 내며 주방 환기 및 일반 배기에 최적화되어 있습니다.",
    spec: { volume: "10 ~ 500", pressure: "10 ~ 100", power: "0.4 ~ 30" },
    imageUrl: "http://www.bncblower.co.kr/file/product/SIROCCO%20DIDW.JPG"
  },
  {
    id: 3,
    name: "Turbo Fan (TF 시리즈)",
    category: "고압용 송풍기",
    description: "고압의 공기 이송이 필요한 집진 시설 및 산업 공정에 사용됩니다.",
    spec: { volume: "20 ~ 1,000", pressure: "300 ~ 1,200", power: "2.2 ~ 200" },
    imageUrl: "http://www.bncblower.co.kr/file/product/turbo-fan.JPG"
  }
];