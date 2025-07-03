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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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
  const [errors, setErrors] = useState<string[]>([]);

  const validateDates = () => {
    const newErrors: string[] = [];

    // 여행 시작일과 종료일 검증
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.push("여행 종료일은 시작일보다 늦어야 합니다.");
    }

    // 투표 마감일과 여행 시작일 검증
    if (deadline && startDate && new Date(deadline) >= new Date(startDate)) {
      newErrors.push("투표 마감일은 여행 시작일보다 전이어야 합니다.");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 날짜 검증
    if (!validateDates()) {
      return;
    }
    
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

  // 날짜 변경 시 검증
  const handleDateChange = (type: 'deadline' | 'startDate' | 'endDate', value: string) => {
    if (type === 'deadline') setDeadline(value);
    if (type === 'startDate') setStartDate(value);
    if (type === 'endDate') setEndDate(value);
    
    // 잠시 후 검증 실행 (상태 업데이트 후)
    setTimeout(() => {
      validateDates();
    }, 0);
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
          {/* 오류 메시지 표시 */}
          {errors.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

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
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className={startDate && endDate && new Date(startDate) > new Date(endDate) ? 'border-red-500' : ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">여행 종료일</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className={startDate && endDate && new Date(startDate) > new Date(endDate) ? 'border-red-500' : ''}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">투표 마감일 *</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => handleDateChange('deadline', e.target.value)}
              required
              className={deadline && startDate && new Date(deadline) >= new Date(startDate) ? 'border-red-500' : ''}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={!title || !location || !deadline || errors.length > 0}
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