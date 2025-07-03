import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Utensils, Hotel, Sparkles, Vote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Suggestion {
  id: number;
  name: string;
  description: string;
  category: string;
  votes: number;
  voters: string[];
}

interface TripMapProps {
  tripId: string | number;
  suggestions: Suggestion[];
  location?: string;
  onAddSuggestionAtLocation?: (lat: number, lng: number) => void;
}

// 카테고리별 아이콘과 색상 매핑
const categoryConfig = {
  restaurant: { icon: Utensils, color: "bg-orange-500", bgColor: "bg-orange-100", textColor: "text-orange-800" },
  accommodation: { icon: Hotel, color: "bg-blue-500", bgColor: "bg-blue-100", textColor: "text-blue-800" },
  attraction: { icon: MapPin, color: "bg-green-500", bgColor: "bg-green-100", textColor: "text-green-800" },
  activity: { icon: Sparkles, color: "bg-purple-500", bgColor: "bg-purple-100", textColor: "text-purple-800" },
};

const TripMap = ({ tripId, suggestions, location, onAddSuggestionAtLocation }: TripMapProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 카테고리별로 제안들을 그룹화
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.category]) {
      acc[suggestion.category] = [];
    }
    acc[suggestion.category].push(suggestion);
    return acc;
  }, {} as { [key: string]: Suggestion[] });

  // 투표 순으로 정렬된 제안들
  const sortedSuggestions = suggestions
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 10); // 상위 10개만 표시

  const filteredSuggestions = selectedCategory 
    ? suggestions.filter(s => s.category === selectedCategory)
    : sortedSuggestions;

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>여행 지도</span>
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {location && `📍 ${location}`}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setSelectedCategory(null)}
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            className="text-xs"
          >
            전체 ({suggestions.length})
          </Button>
          {Object.entries(groupedSuggestions).map(([category, items]) => {
            const config = categoryConfig[category as keyof typeof categoryConfig];
            if (!config) return null;
            
            return (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className="text-xs"
              >
                <config.icon className="h-3 w-3 mr-1" />
                {getCategoryName(category)} ({items.length})
              </Button>
            );
          })}
        </div>

        {/* 지도 영역 */}
        <div 
          className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-lg h-80 overflow-hidden cursor-crosshair"
          onClick={(e) => {
            if (onAddSuggestionAtLocation) {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const lat = 37.5 + (y / rect.height - 0.5) * 0.1; // 임시 좌표 변환
              const lng = 127 + (x / rect.width - 0.5) * 0.1;
              onAddSuggestionAtLocation(lat, lng);
            }
          }}
        >
          <div className="absolute inset-0">
            {/* 지도 배경 패턴 */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-12 grid-rows-8 h-full">
                {Array.from({ length: 96 }).map((_, i) => (
                  <div key={i} className="border border-blue-200" />
                ))}
              </div>
            </div>
            
            {/* 제안 마커들 */}
            {filteredSuggestions.map((suggestion, index) => {
              const config = categoryConfig[suggestion.category as keyof typeof categoryConfig];
              if (!config) return null;

              // 마커 위치를 랜덤하게 배치 (실제로는 좌표 데이터를 사용)
              const left = 15 + (index * 7) % 70;
              const top = 20 + (index * 11) % 60;

              return (
                <div
                  key={suggestion.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`
                  }}
                >
                  {/* 마커 */}
                  <div className={`relative ${config.color} rounded-full p-2 shadow-lg hover:scale-110 transition-transform`}>
                    <config.icon className="h-4 w-4 text-white" />
                    {suggestion.votes > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {suggestion.votes}
                      </div>
                    )}
                  </div>
                  
                  {/* 툴팁 */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="bg-white rounded-lg shadow-lg p-3 min-w-48 border">
                      <div className="flex items-center space-x-2 mb-1">
                        <config.icon className="h-4 w-4" />
                        <span className="font-semibold text-sm">{suggestion.name}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className={`text-xs ${config.textColor} ${config.bgColor}`}>
                          {getCategoryName(suggestion.category)}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Vote className="h-3 w-3" />
                          <span>{suggestion.votes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 범례 */}
        <div className="bg-white/80 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-3">범례</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(categoryConfig).map(([category, config]) => (
              <div key={category} className="flex items-center space-x-2">
                <div className={`${config.color} rounded-full p-1`}>
                  <config.icon className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs">{getCategoryName(category)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 제안 목록 */}
        {filteredSuggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">
              {selectedCategory ? `${getCategoryName(selectedCategory)} 제안` : "인기 제안"} 
              ({filteredSuggestions.length}개)
            </h4>
            <div className="grid gap-2 max-h-40 overflow-y-auto">
              {filteredSuggestions.map((suggestion) => {
                const config = categoryConfig[suggestion.category as keyof typeof categoryConfig];
                if (!config) return null;

                return (
                  <div key={suggestion.id} className="flex items-center justify-between bg-white/50 rounded-lg p-2">
                    <div className="flex items-center space-x-2">
                      <config.icon className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium">{suggestion.name}</p>
                        <p className="text-xs text-gray-500">{suggestion.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className={`text-xs ${config.textColor} ${config.bgColor}`}>
                        {getCategoryName(suggestion.category)}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Vote className="h-3 w-3" />
                        <span>{suggestion.votes}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p>💡 마커를 클릭하면 상세 정보를 확인할 수 있습니다. 숫자는 투표 수를 나타냅니다.</p>
        </div>
      </CardContent>
    </Card>
  );
};

const getCategoryName = (category: string): string => {
  const categoryNames: { [key: string]: string } = {
    restaurant: "식당",
    accommodation: "숙소",
    attraction: "관광지",
    activity: "액티비티"
  };
  return categoryNames[category] || category;
};

export default TripMap;