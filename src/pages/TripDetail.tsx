import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Users, Plus, Vote, MapPin, Hotel, Utensils, Sparkles, Copy, Check, Share2, Settings, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import CategorySection from "@/components/CategorySection";
import AddSuggestionDialog from "@/components/AddSuggestionDialog";
import UserNameDialog from "@/components/UserNameDialog";
import TripMap from "@/components/TripMap";
import EditTripDialog from "@/components/EditTripDialog";
import TripSchedule from "@/components/TripSchedule";
import { getAIRecommendation } from "@/utils/aiRecommendations";
import { toast } from "@/components/ui/sonner";

// 임시 데이터 - 실제로는 localStorage나 백엔드에서 가져올 데이터
const getStoredTrips = () => {
  const stored = localStorage.getItem('tripPlans');
  return stored ? JSON.parse(stored) : {};
};

const saveTrips = (trips: any) => {
  localStorage.setItem('tripPlans', JSON.stringify(trips));
};

// 기본 데이터 (기존 예시용)
const defaultMockData = {
  1: {
    id: 1,
    title: "제주도 여행",
    description: "3박 4일 제주도 여행 계획",
    deadline: "2024-01-15",
    startDate: "2024-01-20",
    endDate: "2024-01-23",
    location: "제주도",
    code: "JEJU2024",
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
  const { id, code } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("voting");
  const [votingTab, setVotingTab] = useState("restaurant");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // 저장된 데이터와 기본 데이터 병합
  const storedTrips = getStoredTrips();
  const allTrips = { ...defaultMockData, ...storedTrips };
  
  // 코드로 접근한 경우 해당 여행 찾기
  const tripByCode = code ? Object.values(allTrips).find((trip: any) => trip.code === code) : null;
  const [tripData, setTripData] = useState(tripByCode || allTrips[id] || allTrips[1]);

  const deadlineDate = new Date(tripData.deadline);
  const isExpired = deadlineDate < new Date();

  // 사용자 이름 확인
  useEffect(() => {
    const storedUserName = localStorage.getItem('currentUserName');
    if (!storedUserName) {
      setIsNameDialogOpen(true);
    } else {
      setCurrentUser(storedUserName);
    }
  }, []);

  const handleSetUserName = (name: string) => {
    setCurrentUser(name);
    localStorage.setItem('currentUserName', name);
  };

  const handleBack = () => {
    navigate("/");
  };

  const copyTripCode = async () => {
    try {
      await navigator.clipboard.writeText(tripData.code);
      setCopied(true);
      toast.success("여행 코드가 복사되었습니다!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("복사에 실패했습니다.");
    }
  };

  const copyTripLink = async () => {
    try {
      const link = `${window.location.origin}/trip/${tripData.id}`;
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      toast.success("여행 링크가 복사되었습니다!");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      toast.error("복사에 실패했습니다.");
    }
  };

  const handleVote = (categoryId: string, itemId: number) => {
    setTripData(prev => {
      const newData = { ...prev };
      const category = newData.categories[categoryId];
      const item = category.find(item => item.id === itemId);
      
      if (item) {
        if (item.voters.includes(currentUser)) {
          item.votes -= 1;
          item.voters = item.voters.filter(voter => voter !== currentUser);
        } else {
          item.votes += 1;
          item.voters.push(currentUser);
        }
      }
      
      // 로컬 스토리지에 저장
      const storedTrips = getStoredTrips();
      storedTrips[newData.id] = newData;
      saveTrips(storedTrips);
      
      return newData;
    });
  };

  const handleDeleteSuggestion = (categoryId: string, itemId: number) => {
    setTripData(prev => {
      const newData = { ...prev };
      newData.categories[categoryId] = newData.categories[categoryId].filter(item => item.id !== itemId);
      
      // 로컬 스토리지에 저장
      const storedTrips = getStoredTrips();
      storedTrips[newData.id] = newData;
      saveTrips(storedTrips);
      
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
      if (!newData.categories[suggestionData.category]) {
        newData.categories[suggestionData.category] = [];
      }
      newData.categories[suggestionData.category].push(newSuggestion);
      
      // 로컬 스토리지에 저장
      const storedTrips = getStoredTrips();
      storedTrips[newData.id] = newData;
      saveTrips(storedTrips);
      
      return newData;
    });
    
    setIsAddDialogOpen(false);
  };

  const handleAIRecommendation = (categoryId: string) => {
    const recommendation = getAIRecommendation(tripData.location || "한국", categoryId);
    
    const newSuggestion = {
      id: Date.now(),
      name: recommendation.name,
      description: recommendation.description,
      category: categoryId,
      url: recommendation.url || null,
      votes: 0,
      voters: []
    };

    setTripData(prev => {
      const newData = { ...prev };
      if (!newData.categories[categoryId]) {
        newData.categories[categoryId] = [];
      }
      newData.categories[categoryId].push(newSuggestion);
      
      // 로컬 스토리지에 저장
      const storedTrips = getStoredTrips();
      storedTrips[newData.id] = newData;
      saveTrips(storedTrips);
      
      return newData;
    });
  };

  const handleEditTrip = (updatedData: any) => {
    setTripData(updatedData);
    
    // 로컬 스토리지에 저장
    const storedTrips = getStoredTrips();
    storedTrips[updatedData.id] = updatedData;
    saveTrips(storedTrips);
    
    toast.success("여행 계획이 수정되었습니다!");
  };

  const handleSaveSchedule = (schedule: any) => {
    const updatedData = { ...tripData, schedule };
    setTripData(updatedData);
    
    // 로컬 스토리지에 저장
    const storedTrips = getStoredTrips();
    storedTrips[updatedData.id] = updatedData;
    saveTrips(storedTrips);
    
    toast.success("스케줄이 저장되었습니다!");
  };

  const handleAddSuggestionAtLocation = (lat: number, lng: number) => {
    // 위치 정보와 함께 제안 추가 다이얼로그 열기
    setIsAddDialogOpen(true);
    toast.info("지도를 클릭한 위치에 제안을 추가해보세요!");
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
                {tripData.location && (
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {tripData.location}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* 여행 코드 표시 */}
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="text-xs text-gray-500">여행 코드</p>
                    <p className="font-mono font-bold text-sm">{tripData.code}</p>
                  </div>
                  <Button
                    onClick={copyTripCode}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* 링크 공유 버튼 */}
              <Button
                onClick={copyTripLink}
                variant="outline"
                size="sm"
                className="bg-white/60"
              >
                {linkCopied ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Share2 className="h-4 w-4 mr-2" />}
                링크 공유
              </Button>

              {/* 설정 버튼 */}
              <Button
                onClick={() => setIsEditDialogOpen(true)}
                variant="outline"
                size="sm"
                className="bg-white/60"
                disabled={isExpired}
              >
                <Settings className="h-4 w-4 mr-2" />
                설정
              </Button>
              
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
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-8">
        {/* 여행 정보 카드 */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">여행 일정</p>
                  {tripData.startDate && tripData.endDate ? (
                    <p className="font-semibold">
                      {format(new Date(tripData.startDate), "MM/dd", { locale: ko })} - {format(new Date(tripData.endDate), "MM/dd", { locale: ko })}
                    </p>
                  ) : (
                    <p className="font-semibold text-gray-400">미정</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">투표 마감일</p>
                  <p className="font-semibold">{format(deadlineDate, "MM/dd", { locale: ko })}</p>
                  {isExpired && (
                    <Badge variant="destructive" className="mt-1">마감됨</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">참여자</p>
                  <p className="font-semibold">{tripData.participantCount || tripData.participants.length}명</p>
                  <p className="text-xs text-gray-500">{tripData.participants.slice(0, 3).join(", ")}{tripData.participants.length > 3 ? '...' : ''}</p>
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

        {/* 메인 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm mb-6">
            <TabsTrigger value="voting" className="flex items-center space-x-2">
              <Vote className="h-4 w-4" />
              <span>투표하기</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center space-x-2">
              <CalendarDays className="h-4 w-4" />
              <span>여행 스케줄</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>지도</span>
            </TabsTrigger>
          </TabsList>

          {/* 투표 탭 */}
          <TabsContent value="voting">
            <Tabs value={votingTab} onValueChange={setVotingTab}>
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
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <category.icon className="h-5 w-5" />
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                    </div>
                    <Button
                      onClick={() => handleAIRecommendation(category.id)}
                      variant="outline"
                      size="sm"
                      disabled={isExpired}
                      className="bg-gradient-to-r from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 border-yellow-300"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI 추천
                    </Button>
                  </div>
                  
                  <CategorySection
                    category={category}
                    items={tripData.categories[category.id] || []}
                    onVote={(itemId) => handleVote(category.id, itemId)}
                    onDelete={(itemId) => handleDeleteSuggestion(category.id, itemId)}
                    currentUser={currentUser}
                    isExpired={isExpired}
                    tripId={tripData.id}
                    totalParticipants={tripData.participantCount || tripData.participants.length}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          {/* 스케줄 탭 */}
          <TabsContent value="schedule">
            <TripSchedule
              tripData={tripData}
              onSaveSchedule={handleSaveSchedule}
            />
          </TabsContent>

          {/* 지도 탭 */}
          <TabsContent value="map">
            <TripMap 
              tripId={tripData.id} 
              suggestions={Object.values(tripData.categories).flat() as any[]}
              location={tripData.location}
              onAddSuggestionAtLocation={handleAddSuggestionAtLocation}
            />
          </TabsContent>
        </Tabs>
      </main>

      <AddSuggestionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddSuggestion={handleAddSuggestion}
        categories={categoryConfig}
      />

      <EditTripDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        tripData={tripData}
        onSave={handleEditTrip}
      />

      <UserNameDialog
        open={isNameDialogOpen}
        onOpenChange={setIsNameDialogOpen}
        onSetUserName={handleSetUserName}
      />
    </div>
  );
};

export default TripDetail;