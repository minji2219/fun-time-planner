import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface EditTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripData: any;
  onSave: (updatedData: any) => void;
}

const EditTripDialog = ({ open, onOpenChange, tripData, onSave }: EditTripDialogProps) => {
  const [title, setTitle] = useState(tripData.title || "");
  const [description, setDescription] = useState(tripData.description || "");
  const [deadline, setDeadline] = useState(
    tripData.deadline ? format(new Date(tripData.deadline), "yyyy-MM-dd") : ""
  );
  const [startDate, setStartDate] = useState(
    tripData.startDate ? format(new Date(tripData.startDate), "yyyy-MM-dd") : ""
  );
  const [endDate, setEndDate] = useState(
    tripData.endDate ? format(new Date(tripData.endDate), "yyyy-MM-dd") : ""
  );
  const [location, setLocation] = useState(tripData.location || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      ...tripData,
      title,
      description,
      deadline,
      startDate: startDate || null,
      endDate: endDate || null,
      location,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>여행 계획 수정</DialogTitle>
          <DialogDescription>
            여행 계획의 정보를 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">여행 제목 *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">여행 지역 *</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 제주도, 부산, 서울"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">여행 시작일</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">여행 종료일</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">투표 마감일 *</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={!title || !location || !deadline}
            >
              저장하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTripDialog;