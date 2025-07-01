
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vote, Heart, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CategorySectionProps {
  category: {
    id: string;
    name: string;
    icon: any;
    color: string;
  };
  items: Array<{
    id: number;
    name: string;
    description: string;
    votes: number;
    voters: string[];
  }>;
  onVote: (itemId: number) => void;
  currentUser: string;
  isExpired: boolean;
}

const CategorySection = ({ category, items, onVote, currentUser, isExpired }: CategorySectionProps) => {
  const maxVotes = Math.max(...items.map(item => item.votes), 1);

  if (items.length === 0) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-white/20 text-center py-12">
        <CardContent>
          <category.icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{category.name} 제안이 아직 없습니다</p>
          <p className="text-sm text-gray-500">
            {isExpired ? "투표가 마감되었습니다" : "새로운 제안을 추가해보세요!"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <category.icon className="h-6 w-6" />
          <h3 className="text-xl font-bold">{category.name}</h3>
          <Badge className={category.color}>{items.length}개 제안</Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {items
          .sort((a, b) => b.votes - a.votes)
          .map((item, index) => {
            const hasVoted = item.voters.includes(currentUser);
            const votePercentage = (item.votes / maxVotes) * 100;

            return (
              <Card key={item.id} className={`bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all ${index === 0 && item.votes > 0 ? 'ring-2 ring-yellow-400' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        {index === 0 && item.votes > 0 && (
                          <Badge className="bg-yellow-100 text-yellow-800">1위</Badge>
                        )}
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">{item.votes}</div>
                        <div className="text-xs text-gray-600">표</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* 투표 진행바 */}
                    <div className="space-y-1">
                      <Progress value={votePercentage} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>전체 투표 중 {Math.round(votePercentage)}%</span>
                        <span>{item.votes}/{maxVotes}</span>
                      </div>
                    </div>

                    {/* 투표자 목록 */}
                    {item.voters.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <div className="flex flex-wrap gap-1">
                          {item.voters.map((voter, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {voter}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 투표 버튼 */}
                    <Button
                      onClick={() => onVote(item.id)}
                      disabled={isExpired}
                      variant={hasVoted ? "default" : "outline"}
                      className={`w-full ${hasVoted 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white' 
                        : 'hover:bg-purple-50'
                      }`}
                    >
                      {hasVoted ? (
                        <>
                          <Heart className="h-4 w-4 mr-2 fill-current" />
                          투표 취소
                        </>
                      ) : (
                        <>
                          <Vote className="h-4 w-4 mr-2" />
                          {isExpired ? "투표 마감" : "투표하기"}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default CategorySection;
