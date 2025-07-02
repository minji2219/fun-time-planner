import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Send, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
}

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestionId: number;
  suggestionName: string;
  tripId: string | number;
  currentUser: string;
}

const CommentDialog = ({ 
  open, 
  onOpenChange, 
  suggestionId, 
  suggestionName, 
  tripId, 
  currentUser 
}: CommentDialogProps) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  // 댓글 로드
  useEffect(() => {
    if (open) {
      const storageKey = `comments_${tripId}_${suggestionId}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setComments(JSON.parse(stored));
      }
    }
  }, [open, tripId, suggestionId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    
    const comment: Comment = {
      id: Date.now(),
      author: currentUser,
      text: newComment.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    
    // 로컬 스토리지에 저장
    const storageKey = `comments_${tripId}_${suggestionId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedComments));
    
    setNewComment("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>{suggestionName}</span>
          </DialogTitle>
          <DialogDescription>
            이 제안에 대한 의견을 나눠보세요.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 flex-1">
          {/* 댓글 목록 */}
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>아직 댓글이 없습니다.</p>
                <p className="text-sm">첫 번째 의견을 남겨보세요!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <Badge variant="secondary" className="text-xs">
                          {comment.author}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.timestamp), "MM/dd HH:mm", { locale: ko })}
                      </span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          {/* 새 댓글 작성 */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="comment">의견 작성</Label>
              <Textarea
                id="comment"
                placeholder="이 제안에 대한 의견을 남겨주세요..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={!newComment.trim() || !currentUser}
              >
                <Send className="h-4 w-4 mr-2" />
                댓글 작성
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;