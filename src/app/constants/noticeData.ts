// src/app/constants/noticeData.ts
export interface Notice {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  category: "공지사항" | "일반자료실" | "기술자료실";
  content: string;
  images?: string[];     // 여러 이미지 경로
  videoUrl?: string;     // 유튜브 등 영상 링크
  attachments?: { name: string; url: string }[]; // 첨부파일(PDF 등)
}

export const NOTICE_LIST: Notice[] = [
  { 
    id: 3, 
    title: "AIRFOIL SISW, DIDW 모델 AMCA SEAL 인증", 
    author: "(주)BnC", 
    date: "2012/05/03", 
    views: 5674, 
    category: "공지사항",
    content: "BnC의 주요 모델들이 AMCA 인증을 획득했습니다. 아래 인증서 이미지와 소개 영상을 확인하세요.",
    images: ["/images/cert1.jpg", "/images/cert2.jpg"], 
    videoUrl: "https://www.youtube.com/embed/실제영상코드", 
    attachments: [{ name: "AMCA_인증서.pdf", url: "/files/cert.pdf" }]
  },
];