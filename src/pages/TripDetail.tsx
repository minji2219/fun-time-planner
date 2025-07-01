
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Users, Plus, Vote, MapPin, Hotel, Utensils } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import CategorySection from "@/components/CategorySection";
import AddSuggestionDialog from "@/components/AddSuggestionDialog";

// 임시 데이터
const mockTripData = {
  1: {
    id: 1,
    title: "제주도 여행",
    description: "3박 4일 제주도 여행 계획",
    deadline: "2024-07-15",
    participantCount: 4,
    participants: ["김철수", "이영희", "박민수", "정지은"],
    categories: {
      restaurant: [
        { id: 1, name: "흑돼지 맛집", description: "제주 대표 흑돼지 구이", votes: 3, voters: ["김철수", "이영희", "박민수"] },
        { id: 2, name: "해산물 뷔페", description: "신선한 제주 해산물", votes: 2, voters: ["정지은", "박민수"] },
      ],
      accommodation: [
        { id: 3, name: "제주 리조트", description: "바다가 보이는 리조트", votes: 4, voters: ["김철수", "이영희", "박민수", "정지은"] },
        { id: 4, name: "게스트하우스", description: "경제적인 숙박", votes: 1, voters: ["박민수"] },
      ],
      attraction: [
        { id: 5, name: "한라산", description: "제주의 상징", votes: 3, voters: ["김철수", "이영희", "정지은"] },
        { id: 6, name: "우도", description: "아름다운 섬", votes: 2, voters: ["이영희", "박민수"] },
      ],
      activity: [
        { id: 7, name: "스쿠버다이빙", description: "제주 바다 탐험", votes: 2, voters: ["김철수", "정지은"] },
        { id: 8, name: "렌터카 투어", description: "자유로운 드라이브", votes: 3, voters: ["이영희", "박민수", "정지은"] },
      ]
    }
  }
};

const categoryConfig = [
  { id: "restaurant", name: "식당", icon: Utensils, color: "bg-orange-100 text-orange-800" },
  { id: "accommodation", name: "숙소", icon: Hotel, color: "bg-blue-100 text-blue-800" },
  { id: "attraction", name: "관광지", icon: MapPin, color: "bg-green-100 text-green-800" },
  { id: "activity", name: "액티비티", icon: Vote, color: "bg-purple-100 text-purple-800" },
];

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("restaurant");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [tripData, setTripData] = useState(mockTripData[1]);

  const deadlineDate = new Date(tripData.deadline);
  const isExpired = deadlineDate < new Date();

  const handleBack = () => {
    navigate("/");
  };

  const handleVote = (categoryId: string, itemId: number) => {
    // 투표 로직 (실제로는 백엔드 연동 필요)
    const currentUser = "김철수"; // 임시 사용자
    
    setTripData(prev => {
      const newData = { ...prev };
      const category = newData.categories[categoryId];
      const item = category.find(item => item.id === itemId);
      
      if (item) {
        if (item.voters.includes(currentUser)) {
          // 투표 취소
          item.votes -= 1;
          item.voters = item.voters.filter(voter => voter !== currentUser);
        } else {
          // 투표
          item.votes += 1;
          item.voters.push(currentUser);
        }
      }
      
      return newData;
    });
  };

  const handleAddSuggestion = (suggestionData: any) => {
    const newSuggestion = {
      id: Date.now(),
      ...suggestionData,
      votes: 0,
      voters: []
    };

    setTripData(prev => {
      const newData = { ...prev };
      newData.categories[suggestionData.category].push(newSuggestion);
      return newData;
    });
    
    setIsAddDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                돌아가기
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{tripData.title}</h1>
                <p className="text-gray-600">{tripData.description}</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              disabled={isExpired}
            >
              <Plus className="h-4 w-4 mr-2" />
              제안 추가
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-8">
        {/* 여행 정보 카드 */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">투표 마감일</p>
                  <p className="font-semibold">{format(deadlineDate, "PPP", { locale: ko })}</p>
                  {isExpired && (
                    <Badge variant="destructive" className="mt-1">마감됨</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">참여자</p>
                  <p className="font-semibold">{tripData.participantCount}명</p>
                  <p className="text-xs text-gray-500">{tripData.participants.join(", ")}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Vote className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">총 투표 항목</p>
                  <p className="font-semibold">
                    {Object.values(tripData.categories).flat().length}개
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 카테고리별 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm">
            {categoryConfig.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                <category.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categoryConfig.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <CategorySection
                category={category}
                items={tripData.categories[category.id] || []}
                onVote={(itemId) => handleVote(category.id, itemId)}
                currentUser="김철수"
                isExpired={isExpired}
              />
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <AddSuggestionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddSuggestion={handleAddSuggestion}
        categories={categoryConfig}
      />
    </div>
  );
};

export default TripDetail;
