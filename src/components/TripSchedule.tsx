import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Sparkles, Edit3, Save, X, Vote, Users, Trophy } from "lucide-react";
import { format, addDays, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TripScheduleProps {
  tripData: any;
  onSaveSchedule: (schedule: any) => void;
}

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  category: string;
  suggestion?: any;
}

interface DaySchedule {
  date: string;
  items: ScheduleItem[];
}

const TripSchedule = ({ tripData, onSaveSchedule }: TripScheduleProps) => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(tripData.schedule || []);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ScheduleItem>>({});
  const [activeDay, setActiveDay] = useState<string>("");

  // 참여자 수 계산 (participantCount가 있으면 사용, 없으면 participants 배열 길이 사용)
  const totalParticipants = tripData.participantCount || tripData.participants?.length || 0;

  // 카테고리별 투표 결과 계산
  const getTopSuggestions = () => {
    const topSuggestions: { [category: string]: any[] } = {};
    
    Object.entries(tripData.categories).forEach(([category, items]: [string, any[]]) => {
      const sortedItems = items
        .filter(item => item.votes > 0)
        .sort((a, b) => b.votes - a.votes)
        .slice(0, 3); // 상위 3개만
      topSuggestions[category] = sortedItems;
    });
    
    return topSuggestions;
  };

  const topSuggestions = getTopSuggestions();

  // AI 스케줄 생성
  const generateAISchedule = () => {
    if (!tripData.startDate || !tripData.endDate) return;

    const startDate = parseISO(tripData.startDate);
    const endDate = parseISO(tripData.endDate);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // 투표가 높은 순으로 제안들 정렬
    const allSuggestions = Object.values(tripData.categories).flat()
      .sort((a: any, b: any) => b.votes - a.votes);

    const newSchedule: DaySchedule[] = [];

    for (let i = 0; i <= daysDiff; i++) {
      const currentDate = addDays(startDate, i);
      const dateStr = format(currentDate, "yyyy-MM-dd");
      
      const dayItems: ScheduleItem[] = [];

      // 각 날짜별로 카테고리별 제안 배치
      if (i === 0) {
        // 첫 날: 숙소 체크인 + 식당
        const accommodation = allSuggestions.find((s: any) => s.category === 'accommodation') as any;
        const restaurant = allSuggestions.find((s: any) => s.category === 'restaurant') as any;
        
        if (accommodation) {
          dayItems.push({
            id: `${dateStr}-checkin`,
            time: "15:00",
            title: `${accommodation.name} 체크인`,
            description: accommodation.description,
            category: "accommodation",
            suggestion: accommodation
          });
        }
        
        if (restaurant) {
          dayItems.push({
            id: `${dateStr}-dinner`,
            time: "18:00",
            title: `${restaurant.name} 저녁식사`,
            description: restaurant.description,
            category: "restaurant",
            suggestion: restaurant
          });
        }
      } else if (i === daysDiff) {
        // 마지막 날: 체크아웃
        const accommodation = allSuggestions.find((s: any) => s.category === 'accommodation') as any;
        if (accommodation) {
          dayItems.push({
            id: `${dateStr}-checkout`,
            time: "11:00",
            title: `${accommodation.name} 체크아웃`,
            description: "짐을 정리하고 체크아웃",
            category: "accommodation",
            suggestion: accommodation
          });
        }
      } else {
        // 중간 날들: 관광지 + 액티비티 + 식당
        const attractions = allSuggestions.filter((s: any) => s.category === 'attraction').slice(0, 2) as any[];
        const activities = allSuggestions.filter((s: any) => s.category === 'activity').slice(0, 1) as any[];
        const restaurants = allSuggestions.filter((s: any) => s.category === 'restaurant').slice(1, 3) as any[];

        // 오전 관광지
        if (attractions[0]) {
          dayItems.push({
            id: `${dateStr}-morning`,
            time: "09:00",
            title: `${attractions[0].name} 관광`,
            description: attractions[0].description,
            category: "attraction",
            suggestion: attractions[0]
          });
        }

        // 점심
        if (restaurants[0]) {
          dayItems.push({
            id: `${dateStr}-lunch`,
            time: "12:00",
            title: `${restaurants[0].name} 점심식사`,
            description: restaurants[0].description,
            category: "restaurant",
            suggestion: restaurants[0]
          });
        }

        // 오후 액티비티
        if (activities[0]) {
          dayItems.push({
            id: `${dateStr}-afternoon`,
            time: "14:00",
            title: `${activities[0].name}`,
            description: activities[0].description,
            category: "activity",
            suggestion: activities[0]
          });
        }

        // 저녁
        if (restaurants[1]) {
          dayItems.push({
            id: `${dateStr}-dinner`,
            time: "18:00",
            title: `${restaurants[1].name} 저녁식사`,
            description: restaurants[1].description,
            category: "restaurant",
            suggestion: restaurants[1]
          });
        }
      }

      newSchedule.push({
        date: dateStr,
        items: dayItems
      });
    }

    setSchedule(newSchedule);
    if (newSchedule.length > 0) {
      setActiveDay(newSchedule[0].date);
    }
  };

  const categoryColors = {
    restaurant: "bg-orange-100 text-orange-800",
    accommodation: "bg-blue-100 text-blue-800",
    attraction: "bg-green-100 text-green-800",
    activity: "bg-purple-100 text-purple-800",
  };

  const categoryNames = {
    restaurant: "식당",
    accommodation: "숙소", 
    attraction: "관광지",
    activity: "액티비티"
  };

  const startEdit = (item: ScheduleItem) => {
    setEditingItem(item.id);
    setEditForm(item);
  };

  const saveEdit = () => {
    if (!editingItem) return;
    
    setSchedule(prev => prev.map(day => ({
      ...day,
      items: day.items.map(item => 
        item.id === editingItem ? { ...item, ...editForm } : item
      )
    })));
    
    setEditingItem(null);
    setEditForm({});
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditForm({});
  };

  const handleSave = () => {
    onSaveSchedule(schedule);
  };

  if (!tripData.startDate || !tripData.endDate) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>여행 스케줄</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">여행 날짜를 설정하면 스케줄을 생성할 수 있습니다.</p>
        </CardContent>
      </Card>
    );
  }

  // 날짜별 탭 생성
  const startDate = parseISO(tripData.startDate);
  const endDate = parseISO(tripData.endDate);
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const dates = [];
  
  for (let i = 0; i <= daysDiff; i++) {
    const currentDate = addDays(startDate, i);
    dates.push(format(currentDate, "yyyy-MM-dd"));
  }

  // 첫 번째 날짜를 기본 활성 탭으로 설정
  if (!activeDay && dates.length > 0) {
    setActiveDay(dates[0]);
  }

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* 스케줄 메인 영역 */}
      <div className="lg:col-span-3">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>여행 스케줄</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  onClick={generateAISchedule}
                  variant="outline"
                  size="sm"
                  className="bg-gradient-to-r from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 border-yellow-300"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI 스케줄 생성
                </Button>
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {schedule.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">아직 스케줄이 없습니다.</p>
                <Button onClick={generateAISchedule} className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI로 스케줄 생성하기
                </Button>
              </div>
            ) : (
              <Tabs value={activeDay} onValueChange={setActiveDay}>
                {/* 가로 형태의 날짜 탭 */}
                <TabsList className="grid w-full bg-white/60 backdrop-blur-sm mb-6" style={{ gridTemplateColumns: `repeat(${dates.length}, 1fr)` }}>
                  {dates.map((date) => (
                    <TabsTrigger key={date} value={date} className="text-sm">
                      {format(parseISO(date), "M/d (eee)", { locale: ko })}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* 각 날짜별 스케줄 내용 */}
                {dates.map((date) => {
                  const daySchedule = schedule.find(day => day.date === date);
                  
                  return (
                    <TabsContent key={date} value={date}>
                      <div className="bg-white/50 rounded-lg p-6 border border-white/30">
                        <h3 className="font-semibold text-lg mb-4 text-center border-b pb-2">
                          {format(parseISO(date), "M월 d일 (eee)", { locale: ko })} 일정
                        </h3>
                        
                        <div className="space-y-4">
                          {!daySchedule || daySchedule.items.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">이 날의 일정이 없습니다</p>
                          ) : (
                            daySchedule.items.map((item) => (
                              <div key={item.id} className="bg-white/70 rounded-lg p-4 border">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-3">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    {editingItem === item.id ? (
                                      <Input
                                        value={editForm.time || ""}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))}
                                        className="w-20 h-8 text-sm"
                                      />
                                    ) : (
                                      <span className="text-sm font-medium">{item.time}</span>
                                    )}
                                  </div>
                                  <div className="flex space-x-2">
                                    {editingItem === item.id ? (
                                      <>
                                        <Button onClick={saveEdit} size="sm" variant="outline" className="h-8 text-xs">
                                          <Save className="h-3 w-3 mr-1" />
                                          저장
                                        </Button>
                                        <Button onClick={cancelEdit} size="sm" variant="ghost" className="h-8 text-xs">
                                          <X className="h-3 w-3 mr-1" />
                                          취소
                                        </Button>
                                      </>
                                    ) : (
                                      <Button
                                        onClick={() => startEdit(item)}
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                      >
                                        <Edit3 className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                
                                {editingItem === item.id ? (
                                  <div className="space-y-3">
                                    <Input
                                      value={editForm.title || ""}
                                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                      className="text-sm"
                                      placeholder="일정 제목"
                                    />
                                    <Textarea
                                      value={editForm.description || ""}
                                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                      rows={2}
                                      className="text-sm"
                                      placeholder="일정 설명"
                                    />
                                  </div>
                                ) : (
                                  <>
                                    <h4 className="font-medium text-lg mb-2">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                                    <Badge 
                                      className={`text-xs ${categoryColors[item.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'}`}
                                    >
                                      {categoryNames[item.category as keyof typeof categoryNames] || item.category}
                                    </Badge>
                                  </>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 투표 결과 사이드바 */}
      <div className="lg:col-span-1">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Trophy className="h-5 w-5" />
              <span>투표 결과</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(topSuggestions).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <h4 className="font-medium text-sm flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${
                    category === 'restaurant' ? 'bg-orange-500' :
                    category === 'accommodation' ? 'bg-blue-500' :
                    category === 'attraction' ? 'bg-green-500' :
                    'bg-purple-500'
                  }`}></span>
                  <span>{categoryNames[category as keyof typeof categoryNames]}</span>
                </h4>
                
                {items.length === 0 ? (
                  <p className="text-xs text-muted-foreground">투표된 항목이 없습니다</p>
                ) : (
                  <div className="space-y-2">
                    {items.map((item, index) => {
                      const votePercentage = totalParticipants > 0 
                        ? (item.votes / totalParticipants) * 100 
                        : 0;
                      
                      return (
                        <div key={item.id} className="bg-white/50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              {index === 0 && <Badge className="bg-yellow-100 text-yellow-800 text-xs">1위</Badge>}
                              <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Vote className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm font-bold">{item.votes}</span>
                            </div>
                          </div>
                          
                          <Progress value={votePercentage} className="h-1 mb-2" />
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>참여율 {Math.round(votePercentage)}%</span>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{item.voters.length}/{totalParticipants}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TripSchedule;