import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vote, Heart, Users, ExternalLink, Trash, MessageCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import CommentDialog from "./CommentDialog";
import { useState, useEffect } from "react";

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
    url?: string;
  }>;
  onVote: (itemId: number) => void;
  onDelete?: (itemId: number) => void;
  currentUser: string;
  isExpired: boolean;
  tripId: string | number;
  totalParticipants: number;
}

const CategorySection = ({ 
  category, 
  items, 
  onVote, 
  onDelete, 
  currentUser, 
  isExpired, 
  tripId, 
  totalParticipants 
}: CategorySectionProps) => {
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<{ id: number; name: string } | null>(null);
  const [commentCounts, setCommentCounts] = useState<{ [key: number]: number }>({});

  const maxVotes = Math.max(...items.map(item => item.votes), 1);

  // 각 제안의 댓글 수를 로드
  useEffect(() => {
    const counts: { [key: number]: number } = {};
    items.forEach(item => {
      const storageKey = `comments_${tripId}_${item.id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        counts[item.id] = JSON.parse(stored).length;
      } else {
        counts[item.id] = 0;
      }
    });
    setCommentCounts(counts);
  }, [items, tripId]);

  // 댓글 수 업데이트 함수
  const updateCommentCount = (suggestionId: number) => {
    const storageKey = `comments_${tripId}_${suggestionId}`;
    const stored = localStorage.getItem(storageKey);
    const count = stored ? JSON.parse(stored).length : 0;
    setCommentCounts(prev => ({ ...prev, [suggestionId]: count }));
  };

  const handleCommentClick = (item: { id: number; name: string }) => {
    setSelectedSuggestion(item);
    setCommentDialogOpen(true);
  };

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
      <div className="grid gap-4">
        {items
          .sort((a, b) => b.votes - a.votes)
          .map((item, index) => {
            const hasVoted = item.voters.includes(currentUser);
            const votePercentage = totalParticipants > 0 ? (item.votes / totalParticipants) * 100 : 0;

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
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {onDelete && !isExpired && (
                        <Button
                          onClick={() => onDelete(item.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
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
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>참여자 투표율 {Math.round(votePercentage)}%</span>
                        <span>{item.votes}/{totalParticipants}</span>
                      </div>
                    </div>

                    {/* 투표자 목록과 댓글 버튼 */}
                    <div className="flex items-center justify-between">
                      {item.voters.length > 0 ? (
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-wrap gap-1">
                            {item.voters.map((voter, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {voter}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )}
                      
                      <Button
                        onClick={() => handleCommentClick({ id: item.id, name: item.name })}
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {commentCounts[item.id] || 0}
                      </Button>
                    </div>

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

      {selectedSuggestion && (
        <CommentDialog
          open={commentDialogOpen}
          onOpenChange={setCommentDialogOpen}
          suggestionId={selectedSuggestion.id}
          suggestionName={selectedSuggestion.name}
          tripId={tripId}
          currentUser={currentUser}
          onCommentAdded={() => updateCommentCount(selectedSuggestion.id)}
        />
      )}
    </div>
  );
};

export default CategorySection;