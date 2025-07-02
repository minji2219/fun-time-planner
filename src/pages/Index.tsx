
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users, Calendar, Vote, History } from "lucide-react";
import TripCard from "@/components/TripCard";
import CreateTripDialog from "@/components/CreateTripDialog";
import JoinTripDialog from "@/components/JoinTripDialog";
import { useNavigate } from "react-router-dom";

// 로컬스토리지에서 여행 계획들을 가져오는 함수
const getStoredTrips = () => {
  const stored = localStorage.getItem('tripPlans');
  return stored ? JSON.parse(stored) : {};
};

// 로컬스토리지에 여행 계획들을 저장하는 함수
const saveTrips = (trips: any) => {
  localStorage.setItem('tripPlans', JSON.stringify(trips));
};

// 기본 예시 데이터
const defaultTrips = [
  {
    id: 1,
    title: "제주도 여행",
    description: "3박 4일 제주도 여행 계획",
    deadline: "2024-07-15",
    participantCount: 4,
    categoryCount: 8,
    status: "active"
  }
];

const Index = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  // 저장된 여행 계획들과 기본 예시 데이터를 합쳐서 표시
  const storedTrips = getStoredTrips();
  const storedTripsArray = Object.values(storedTrips).map((trip: any) => ({
    id: trip.id,
    title: trip.title,
    description: trip.description,
    deadline: trip.deadline,
    participantCount: trip.participants.length,
    categoryCount: Object.values(trip.categories).flat().length,
    status: new Date(trip.deadline) > new Date() ? "active" : "completed"
  }));
  
  const allTrips = [...defaultTrips, ...storedTripsArray];
  const activeTrips = allTrips.filter(trip => trip.status === "active");

  const handleCreateTrip = (tripData: any) => {
    // 여행 코드 생성 (간단한 구현)
    const generateTripCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    const newTrip = {
      id: Date.now(),
      code: generateTripCode(),
      ...tripData,
      location: tripData.location, // 지역 정보 추가
      categories: {
        restaurant: [],
        accommodation: [],
        attraction: [],
        activity: []
      }
    };

    // 로컬스토리지에 저장
    const storedTrips = getStoredTrips();
    storedTrips[newTrip.id] = newTrip;
    saveTrips(storedTrips);
    
    setIsCreateDialogOpen(false);
    
    // 페이지 새로고침으로 새 데이터 반영
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                여행 투표
              </h1>
              <p className="text-muted-foreground mt-1">친구들과 함께 완벽한 여행 계획을 세워보세요</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                새 여행 계획
              </Button>
              <Button 
                onClick={() => setIsJoinDialogOpen(true)}
                variant="outline"
                className="bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 border-green-300"
                size="lg"
              >
                <Users className="h-5 w-5 mr-2" />
                여행 참여하기
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-8">
        {/* 통계 카드들 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">진행 중인 계획</p>
                <p className="text-2xl font-bold text-foreground">
                  {activeTrips.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gray-100 rounded-full">
                  <History className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">완료된 계획</p>
                  <p className="text-2xl font-bold text-foreground">
                    {allTrips.filter(trip => trip.status === "completed").length}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => navigate("/past-trips")}
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                보기
              </Button>
            </div>
          </div>
        </div>

        {/* 여행 계획 목록 */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">진행 중인 여행 계획</h2>
          
          {activeTrips.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">아직 여행 계획이 없습니다</h3>
                <p className="text-gray-500 mb-6">첫 번째 여행 계획을 만들어보세요!</p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  여행 계획 만들기
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </main>

      <CreateTripDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateTrip={handleCreateTrip}
      />

      <JoinTripDialog
        open={isJoinDialogOpen}
        onOpenChange={setIsJoinDialogOpen}
      />
    </div>
  );
};

export default Index;
