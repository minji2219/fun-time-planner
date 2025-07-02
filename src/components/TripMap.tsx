import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface MapLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  category: string;
}

interface TripMapProps {
  tripId: string | number;
  locations?: MapLocation[];
  onLocationsChange?: (locations: MapLocation[]) => void;
}

// 한국 주요 도시의 좌표 데이터
const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
  "서울": { lat: 37.5665, lng: 126.9780 },
  "부산": { lat: 35.1796, lng: 129.0756 },
  "대구": { lat: 35.8714, lng: 128.6014 },
  "인천": { lat: 37.4563, lng: 126.7052 },
  "광주": { lat: 35.1595, lng: 126.8526 },
  "대전": { lat: 36.3504, lng: 127.3845 },
  "울산": { lat: 35.5384, lng: 129.3114 },
  "제주": { lat: 33.4996, lng: 126.5312 },
  "제주도": { lat: 33.4996, lng: 126.5312 },
  "강릉": { lat: 37.7519, lng: 128.8761 },
  "경주": { lat: 35.8562, lng: 129.2247 },
  "여수": { lat: 34.7604, lng: 127.6622 },
  "포항": { lat: 36.0190, lng: 129.3435 },
  "춘천": { lat: 37.8813, lng: 127.7298 }
};

const TripMap = ({ tripId, locations = [], onLocationsChange }: TripMapProps) => {
  const [savedLocations, setSavedLocations] = useState<MapLocation[]>(locations);
  const [newLocationName, setNewLocationName] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 서울 기본

  useEffect(() => {
    // 로컬 스토리지에서 저장된 위치 로드
    const storageKey = `map_locations_${tripId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsedLocations = JSON.parse(stored);
      setSavedLocations(parsedLocations);
      
      // 저장된 위치가 있으면 첫 번째 위치로 지도 중심 설정
      if (parsedLocations.length > 0) {
        setMapCenter({ lat: parsedLocations[0].lat, lng: parsedLocations[0].lng });
      }
    }
  }, [tripId]);

  const addLocation = () => {
    if (!newLocationName.trim()) return;
    
    const locationName = newLocationName.trim();
    
    // 도시 좌표에서 검색
    const coordinates = cityCoordinates[locationName] || 
                      Object.entries(cityCoordinates).find(([city]) => 
                        city.includes(locationName) || locationName.includes(city)
                      )?.[1];
    
    if (!coordinates) {
      alert("해당 지역의 좌표를 찾을 수 없습니다. 지원되는 지역: " + Object.keys(cityCoordinates).join(", "));
      return;
    }
    
    const newLocation: MapLocation = {
      id: Date.now(),
      name: locationName,
      lat: coordinates.lat,
      lng: coordinates.lng,
      category: "여행지"
    };
    
    const updatedLocations = [...savedLocations, newLocation];
    setSavedLocations(updatedLocations);
    
    // 로컬 스토리지에 저장
    const storageKey = `map_locations_${tripId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedLocations));
    
    // 새 위치로 지도 중심 이동
    setMapCenter({ lat: coordinates.lat, lng: coordinates.lng });
    
    onLocationsChange?.(updatedLocations);
    setNewLocationName("");
  };

  const removeLocation = (locationId: number) => {
    const updatedLocations = savedLocations.filter(loc => loc.id !== locationId);
    setSavedLocations(updatedLocations);
    
    // 로컬 스토리지에 저장
    const storageKey = `map_locations_${tripId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedLocations));
    
    onLocationsChange?.(updatedLocations);
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>여행 지도</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 위치 추가 */}
        <div className="flex space-x-2">
          <Input
            placeholder="방문할 지역 입력 (예: 제주도, 부산, 서울)"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addLocation()}
          />
          <Button onClick={addLocation} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* 지도 영역 (간단한 시각화) */}
        <div className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-lg h-64 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {savedLocations.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>여행할 지역을 추가해보세요</p>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {/* 지도 배경 패턴 */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-6 h-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-blue-200" />
                    ))}
                  </div>
                </div>
                
                {/* 위치 마커들 */}
                {savedLocations.map((location, index) => (
                  <div
                    key={location.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${20 + (index * 15) % 60}%`,
                      top: `${30 + (index * 20) % 40}%`
                    }}
                  >
                    <div className="relative">
                      <MapPin className="h-8 w-8 text-red-500 drop-shadow-lg" fill="currentColor" />
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded px-2 py-1 text-xs font-medium shadow-lg whitespace-nowrap">
                        {location.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 저장된 위치 목록 */}
        {savedLocations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">저장된 위치</h4>
            <div className="flex flex-wrap gap-2">
              {savedLocations.map((location) => (
                <Badge key={location.id} variant="secondary" className="flex items-center space-x-1">
                  <span>{location.name}</span>
                  <Button
                    onClick={() => removeLocation(location.id)}
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p>지원 지역: 서울, 부산, 대구, 인천, 광주, 대전, 울산, 제주도, 강릉, 경주, 여수, 포항, 춘천</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripMap;