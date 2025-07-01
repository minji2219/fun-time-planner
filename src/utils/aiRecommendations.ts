
// AI 추천 기능을 위한 유틸리티 함수들

interface RecommendationData {
  name: string;
  description: string;
  url?: string;
}

// 각 지역별 카테고리별 추천 데이터
const recommendations: { [location: string]: { [category: string]: RecommendationData[] } } = {
  "제주도": {
    restaurant: [
      { name: "흑돼지 맛집 돈사돈", description: "제주 흑돼지 전문점으로 유명한 현지 맛집", url: "https://example.com" },
      { name: "제주 전복죽", description: "신선한 전복으로 만든 제주 전통 죽", url: "https://example.com" },
      { name: "고기국수", description: "제주 대표 향토음식 고기국수 맛집", url: "https://example.com" },
      { name: "해산물뷔페", description: "제주 바다에서 갓 잡은 싱싱한 해산물", url: "https://example.com" },
    ],
    accommodation: [
      { name: "제주 신라호텔", description: "바다 전망이 아름다운 럭셔리 호텔", url: "https://example.com" },
      { name: "파크 하얏트 제주", description: "현대적이고 세련된 리조트 호텔", url: "https://example.com" },
      { name: "제주 게스트하우스", description: "현지인과 소통할 수 있는 아늑한 게스트하우스", url: "https://example.com" },
      { name: "애월 펜션", description: "애월 해변 근처의 조용한 펜션", url: "https://example.com" },
    ],
    attraction: [
      { name: "한라산 등반", description: "제주의 상징 한라산 백록담 등반", url: "https://example.com" },
      { name: "우도", description: "아름다운 산호사 해변이 있는 작은 섬", url: "https://example.com" },
      { name: "성산일출봉", description: "일출로 유명한 제주 대표 관광지", url: "https://example.com" },
      { name: "만장굴", description: "세계 자연유산 용암동굴", url: "https://example.com" },
    ],
    activity: [
      { name: "스쿠버다이빙", description: "제주 바다 속 아름다운 세계 탐험", url: "https://example.com" },
      { name: "승마체험", description: "제주 목장에서 즐기는 승마 체험", url: "https://example.com" },
      { name: "카약", description: "제주 해안을 따라 즐기는 카약 투어", url: "https://example.com" },
      { name: "ATV 체험", description: "제주 오름을 달리는 짜릿한 ATV", url: "https://example.com" },
    ]
  },
  "부산": {
    restaurant: [
      { name: "광안리 횟집", description: "신선한 회와 바다 전망을 즐길 수 있는 맛집", url: "https://example.com" },
      { name: "부산 밀면", description: "부산의 대표 향토음식 밀면 전문점", url: "https://example.com" },
      { name: "자갈치 시장", description: "부산 대표 수산시장에서 즐기는 해산물", url: "https://example.com" },
      { name: "돼지국밥", description: "부산 전통 돼지국밥 맛집", url: "https://example.com" },
    ],
    accommodation: [
      { name: "해운대 그랜드호텔", description: "해운대 해변이 보이는 호텔", url: "https://example.com" },
      { name: "광안리 펜션", description: "광안대교 야경이 아름다운 펜션", url: "https://example.com" },
      { name: "남포동 게스트하우스", description: "부산 중심가의 편리한 게스트하우스", url: "https://example.com" },
      { name: "기장 리조트", description: "조용한 해변가의 휴양지", url: "https://example.com" },
    ],
    attraction: [
      { name: "해운대 해수욕장", description: "부산 대표 해수욕장", url: "https://example.com" },
      { name: "광안대교", description: "부산의 랜드마크 광안대교 야경", url: "https://example.com" },
      { name: "감천문화마을", description: "알록달록한 산토리니 같은 마을", url: "https://example.com" },
      { name: "태종대", description: "부산의 절경을 감상할 수 있는 명소", url: "https://example.com" },
    ],
    activity: [
      { name: "해운대 서핑", description: "부산 해운대에서 즐기는 서핑", url: "https://example.com" },
      { name: "요트 투어", description: "부산 바다를 즐기는 요트 체험", url: "https://example.com" },
      { name: "온천", description: "동래온천에서 즐기는 휴식", url: "https://example.com" },
      { name: "기장 죽성드림세트장", description: "드라마 촬영지에서 즐기는 체험", url: "https://example.com" },
    ]
  },
  "서울": {
    restaurant: [
      { name: "명동 칼국수", description: "서울 대표 칼국수 맛집", url: "https://example.com" },
      { name: "이태원 맛집", description: "다양한 세계 요리를 즐길 수 있는 이태원", url: "https://example.com" },
      { name: "광장시장 먹거리", description: "전통 한식을 맛볼 수 있는 시장", url: "https://example.com" },
      { name: "강남 고급 레스토랑", description: "특별한 날을 위한 고급 레스토랑", url: "https://example.com" },
    ],
    accommodation: [
      { name: "명동 호텔", description: "쇼핑과 관광에 편리한 명동 호텔", url: "https://example.com" },
      { name: "강남 비즈니스 호텔", description: "현대적인 시설의 강남 호텔", url: "https://example.com" },
      { name: "홍대 게스트하우스", description: "젊고 활기찬 홍대의 게스트하우스", url: "https://example.com" },
      { name: "한옥 스테이", description: "전통 한옥에서의 특별한 경험", url: "https://example.com" },
    ],
    attraction: [
      { name: "경복궁", description: "조선왕조 대표 궁궐", url: "https://example.com" },
      { name: "남산타워", description: "서울의 랜드마크 남산타워", url: "https://example.com" },
      { name: "한강공원", description: "서울 시민의 휴식처 한강", url: "https://example.com" },
      { name: "명동 쇼핑거리", description: "서울 대표 쇼핑 명소", url: "https://example.com" },
    ],
    activity: [
      { name: "한강 자전거", description: "한강을 따라 즐기는 자전거 라이딩", url: "https://example.com" },
      { name: "한복 체험", description: "전통 한복을 입고 궁궐 투어", url: "https://example.com" },
      { name: "찻집 투어", description: "서울의 아름다운 전통 찻집 탐방", url: "https://example.com" },
      { name: "야경 투어", description: "서울의 아름다운 야경 감상", url: "https://example.com" },
    ]
  }
};

// 기본 추천 데이터 (지역이 없을 때)
const defaultRecommendations: { [category: string]: RecommendationData[] } = {
  restaurant: [
    { name: "현지 맛집 탐방", description: "그 지역만의 특색있는 맛집을 찾아보세요" },
    { name: "전통 음식 체험", description: "지역 전통 음식을 맛보는 특별한 경험" },
  ],
  accommodation: [
    { name: "현지 호텔", description: "편안하고 깨끗한 현지 호텔" },
    { name: "펜션/게스트하우스", description: "아늑하고 경제적인 숙박 시설" },
  ],
  attraction: [
    { name: "대표 관광지", description: "그 지역의 대표적인 관광명소" },
    { name: "숨은 명소", description: "현지인만 아는 숨겨진 보석 같은 장소" },
  ],
  activity: [
    { name: "현지 체험 활동", description: "그 지역만의 특별한 체험 활동" },
    { name: "자연 액티비티", description: "자연을 만끽할 수 있는 야외 활동" },
  ]
};

export const getAIRecommendation = (location: string, category: string): RecommendationData => {
  // 지역에 맞는 추천이 있는지 확인
  const locationKey = Object.keys(recommendations).find(key => 
    location.includes(key) || key.includes(location)
  );

  let categoryRecommendations: RecommendationData[];
  
  if (locationKey && recommendations[locationKey][category]) {
    categoryRecommendations = recommendations[locationKey][category];
  } else {
    categoryRecommendations = defaultRecommendations[category] || [];
  }

  // 랜덤하게 하나 선택
  const randomIndex = Math.floor(Math.random() * categoryRecommendations.length);
  return categoryRecommendations[randomIndex] || {
    name: "AI 추천",
    description: `${location}의 ${getCategoryName(category)} 추천`
  };
};

const getCategoryName = (category: string): string => {
  const categoryNames: { [key: string]: string } = {
    restaurant: "맛집",
    accommodation: "숙소",
    attraction: "관광지",
    activity: "액티비티"
  };
  return categoryNames[category] || category;
};
