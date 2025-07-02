import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TripCard from "@/components/TripCard";
import { useNavigate } from "react-router-dom";

// 로컬스토리지에서 여행 계획들을 가져오는 함수
const getStoredTrips = () => {
  const stored = localStorage.getItem('tripPlans');
  return stored ? JSON.parse(stored) : {};
};

// 기본 예시 데이터
const defaultTrips = [
  {
    id: 1,
    title: "제주도 여행",
    description: "3박 4일 제주도 여행 계획",
    deadline: "2024-01-15", // 과거 날짜로 설정
    participantCount: 4,
    categoryCount: 8,
    status: "completed"
  }
];

const PastTrips = () => {
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
  const pastTrips = allTrips.filter(trip => trip.status === "completed");

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                돌아가기
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  지난 여행 계획
                </h1>
                <p className="text-muted-foreground mt-1">완료된 여행 계획들을 확인해보세요</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-8">
        {/* 여행 계획 목록 */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">완료된 여행 계획들</h2>
          
          {pastTrips.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <h3 className="text-xl font-semibold text-foreground mb-2">아직 완료된 여행 계획이 없습니다</h3>
                <p className="text-muted-foreground mb-6">여행을 완료하면 여기에서 확인할 수 있습니다.</p>
                <Button 
                  onClick={handleBack}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  돌아가기
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PastTrips;