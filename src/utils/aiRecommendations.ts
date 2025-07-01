
// AI 추천 기능을 위한 유틸리티 함수들

interface RecommendationData {
  name: string;
  description: string;
  url?: string;
}

// 각 지역별 카테고리별 추천 데이터 (실제 장소들)
const recommendations: { [location: string]: { [category: string]: RecommendationData[] } } = {
  "제주도": {
    restaurant: [
      { name: "돈사돈", description: "제주 흑돼지 전문점, 현지인들도 인정하는 맛집", url: "https://www.mangoplate.com/restaurants/1042334" },
      { name: "명진전복", description: "제주 전복요리 전문점, 싱싱한 전복죽과 구이", url: "https://www.mangoplate.com/restaurants/141079" },
      { name: "올레국수", description: "제주 고기국수 맛집, 진한 육수가 일품", url: "https://www.mangoplate.com/restaurants/108542" },
      { name: "성산포 일출봉 회센터", description: "성산일출봉 근처 신선한 회와 해산물", url: "https://www.mangoplate.com/restaurants/1157829" },
      { name: "제주 흑돼지 마을", description: "정통 제주 흑돼지 바베큐", url: "https://www.jeju.go.kr" },
    ],
    accommodation: [
      { name: "제주신라호텔", description: "중문단지 내 5성급 리조트 호텔", url: "https://www.shilla.net/jeju/" },
      { name: "파크 하얏트 제주", description: "애월 해안의 럭셔리 리조트", url: "https://www.hyatt.com/park-hyatt/jejuh-park-hyatt-jeju" },
      { name: "제주 롯데호텔", description: "중문관광단지 내 특급호텔", url: "https://www.lottehotel.com/jeju-hotel/" },
      { name: "해비치 호텔 앤 리조트 제주", description: "표선해수욕장 근처 리조트", url: "https://www.haevichi.com/" },
      { name: "WE호텔 제주", description: "애월 해안도로의 부티크 호텔", url: "https://www.we-hotel.co.kr/" },
    ],
    attraction: [
      { name: "한라산 국립공원", description: "제주의 상징 한라산, 백록담 등반", url: "https://www.hallasan.go.kr/" },
      { name: "성산일출봉", description: "유네스코 세계자연유산, 일출 명소", url: "https://www.seongsan.go.kr/" },
      { name: "만장굴", description: "세계자연유산 용암동굴", url: "https://www.jeju.go.kr/tour/tour/nature/cave.htm" },
      { name: "우도", description: "성산포에서 배로 15분, 아름다운 작은 섬", url: "https://www.udo.go.kr/" },
      { name: "천지연폭포", description: "중문관광단지 내 아름다운 폭포", url: "https://www.jeju.go.kr/tour/" },
    ],
    activity: [
      { name: "제주 스쿠버다이빙", description: "문섬, 범섬 다이빙 투어", url: "https://www.jejudiving.co.kr/" },
      { name: "한라산 등반", description: "성판악 코스 당일 등반", url: "https://www.hallasan.go.kr/" },
      { name: "승마체험", description: "제주 승마공원에서 즐기는 승마", url: "https://www.jejuhorse.co.kr/" },
      { name: "ATV 체험", description: "제주 오름길 ATV 드라이브", url: "https://www.jejuatv.co.kr/" },
      { name: "카약 투어", description: "월정리 해변 카약 체험", url: "https://www.jejukayak.com/" },
    ]
  },
  "부산": {
    restaurant: [
      { name: "광안리 민락수변공원 회센터", description: "광안대교 야경과 함께하는 신선한 회", url: "https://www.bto.or.kr/kor/tour/food.jsp" },
      { name: "할매가야밀면", description: "부산 대표 밀면 맛집, 50년 전통", url: "https://www.mangoplate.com/restaurants/74620" },
      { name: "자갈치시장", description: "부산 대표 수산시장, 싱싱한 해산물", url: "https://www.jagalchimarket.biz/" },
      { name: "송정 해수욕장 횟집", description: "송정해변의 맛있는 횟집들", url: "https://www.busanhangangtour.com/" },
      { name: "국제시장 먹거리", description: "부산 전통시장의 다양한 먹거리", url: "https://gukjemarket.biz/" },
    ],
    accommodation: [
      { name: "파라다이스호텔 부산", description: "해운대 해수욕장 앞 특급호텔", url: "https://www.paradisehotel.co.kr/busan/" },
      { name: "베스트웨스턴 하얏트 호텔", description: "해운대 중심가 비즈니스 호텔", url: "https://www.hyatt.co.kr/" },
      { name: "노보텔 앰배서더 부산", description: "광안리 해변가 호텔", url: "https://www.accor.com/" },
      { name: "해운대 그랜드호텔", description: "해운대 해변 전망 호텔", url: "https://www.grandhotel.co.kr/" },
      { name: "부산역 호텔", description: "부산역 근처 편리한 숙박", url: "https://www.busanstation.co.kr/" },
    ],
    attraction: [
      { name: "해운대 해수욕장", description: "부산 대표 해수욕장", url: "https://www.haeundae.go.kr/" },
      { name: "광안대교", description: "부산의 랜드마크, 야경 명소", url: "https://www.bto.or.kr/" },
      { name: "감천문화마을", description: "알록달록한 산토리니 마을", url: "https://www.gamcheon.or.kr/" },
      { name: "태종대", description: "부산 절경 명소, 자연공원", url: "https://taejongdae.or.kr/" },
      { name: "용두산공원", description: "부산타워가 있는 시내 공원", url: "https://www.bto.or.kr/" },
    ],
    activity: [
      { name: "해운대 서핑", description: "부산 해운대 서핑 체험", url: "https://www.busansurf.com/" },
      { name: "요트 투어", description: "부산 해안 요트 크루즈", url: "https://www.busanyacht.co.kr/" },
      { name: "동래온천", description: "부산 전통 온천욕", url: "https://www.dongnae.go.kr/" },
      { name: "다대포 해수욕장", description: "넓은 백사장의 조용한 해변", url: "https://www.saha.go.kr/" },
      { name: "부산 시티투어", description: "부산 주요 명소 투어버스", url: "https://www.citytour.busan.kr/" },
    ]
  },
  "서울": {
    restaurant: [
      { name: "명동교자", description: "명동 대표 만두집, 50년 전통", url: "https://www.mangoplate.com/restaurants/6879" },
      { name: "광장시장", description: "전통시장 먹거리 천국", url: "https://gwangjangmarket.co.kr/" },
      { name: "이태원 맛집거리", description: "세계 각국 요리를 맛볼 수 있는 거리", url: "https://www.itaewon.or.kr/" },
      { name: "강남 가로수길", description: "트렌디한 레스토랑과 카페들", url: "https://www.gangnam.go.kr/" },
      { name: "종로 피맛골", description: "서울 전통 음식거리", url: "https://www.jongno.go.kr/" },
    ],
    accommodation: [
      { name: "롯데호텔 서울", description: "명동 중심가 특급호텔", url: "https://www.lottehotel.com/seoul-hotel/" },
      { name: "신라호텔", description: "장충동 럭셔리 호텔", url: "https://www.shilla.net/seoul/" },
      { name: "반얀트리 클럽 앤 스파 서울", description: "남산 전망 프리미엄 호텔", url: "https://www.banyantree.com/seoul" },
      { name: "조선궁호텔", description: "중구 전통과 현대가 조화된 호텔", url: "https://www.chosunpalace.co.kr/" },
      { name: "명동 게스트하우스", description: "합리적 가격의 깔끔한 숙소", url: "https://www.myeongdong-guesthouse.com/" },
    ],
    attraction: [
      { name: "경복궁", description: "조선 왕조 대표 궁궐", url: "https://www.royalpalace.go.kr/" },
      { name: "N서울타워", description: "남산 위 서울의 랜드마크", url: "https://www.seoultower.co.kr/" },
      { name: "명동 쇼핑거리", description: "서울 대표 쇼핑 및 관광지", url: "https://www.myeongdong.or.kr/" },
      { name: "한강공원", description: "서울 시민의 휴식처", url: "https://hangang.seoul.go.kr/" },
      { name: "북촌한옥마을", description: "전통 한옥이 보존된 마을", url: "https://www.bukchon.seoul.go.kr/" },
    ],
    activity: [
      { name: "한강 자전거 라이딩", description: "한강을 따라 즐기는 자전거 투어", url: "https://hangang.seoul.go.kr/" },
      { name: "경복궁 한복체험", description: "전통 한복 입고 궁궐 투어", url: "https://www.royalpalace.go.kr/" },
      { name: "홍대 클럽투어", description: "홍대 나이트라이프 체험", url: "https://www.hongdae.go.kr/" },
      { name: "한강 유람선", description: "한강에서 즐기는 크루즈", url: "https://www.elandcruise.com/" },
      { name: "덕수궁 돌담길", description: "서울 도심 속 힐링 산책로", url: "https://www.deoksugung.go.kr/" },
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
