
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MapPin, Calendar, Vote } from "lucide-react";
import CreateTripDialog from "@/components/CreateTripDialog";
import TripCard from "@/components/TripCard";

// 임시 데이터
const mockTrips = [
  {
    id: 1,
    title: "제주도 여행",
    description: "3박 4일 제주도 여행 계획",
    deadline: "2024-07-15",
    participantCount: 4,
    categoryCount: 12,
    status: "active"
  },
  {
    id: 2,
    title: "부산 맛집 투어",
    description: "2박 3일 부산 맛집 탐방",
    deadline: "2024-07-10",
    participantCount: 6,
    categoryCount: 8,
    status: "completed"
  }
];

const Index = () => {
  const [trips, setTrips] = useState(mockTrips);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateTrip = (tripData: any) => {
    const newTrip = {
      id: trips.length + 1,
      ...tripData,
      participantCount: 1,
      categoryCount: 0,
      status: "active"
    };
    setTrips([...trips, newTrip]);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Vote className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                TripVote
              </h1>
            </div>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              새 여행 계획
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-8">
        {/* 히어로 섹션 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            친구들과 함께 만드는 완벽한 여행
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            투표로 결정하는 스마트한 여행 계획 서비스
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all">
              <CardHeader>
                <Calendar className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <CardTitle className="text-lg">날짜 투표</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">여행 날짜를 함께 정하고 마감일까지 의견을 모아보세요</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all">
              <CardHeader>
                <MapPin className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-lg">장소 추천</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">식당, 숙소, 관광지를 추천하고 투표로 결정하세요</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all">
              <CardHeader>
                <Vote className="h-12 w-12 text-purple-500 mx-auto mb-2" />
                <CardTitle className="text-lg">실시간 투표</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">실시간으로 투표 결과를 확인하고 최적의 선택을 하세요</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 여행 계획 목록 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">내 여행 계획</h3>
          </div>
          
          {trips.length === 0 ? (
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 text-center py-12">
              <CardContent>
                <Vote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">아직 여행 계획이 없습니다</p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  첫 번째 여행 계획 만들기
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
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
    </div>
  );
};

export default Index;
