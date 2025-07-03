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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, X, Copy, Check, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreateTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTrip: (tripData: any) => void;
}

const CreateTripDialog = ({ open, onOpenChange, onCreateTrip }: CreateTripDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [location, setLocation] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [tripCode, setTripCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const generateTripCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const validateDates = () => {
    const newErrors: string[] = [];

    // 여행 시작일과 종료일 검증
    if (startDate && endDate && startDate > endDate) {
      newErrors.push("여행 종료일은 시작일보다 늦어야 합니다.");
    }

    // 투표 마감일과 여행 시작일 검증
    if (deadline && startDate && deadline >= startDate) {
      newErrors.push("투표 마감일은 여행 시작일보다 전이어야 합니다.");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !deadline || !location) return;

    // 날짜 검증
    if (!validateDates()) {
      return;
    }

    const code = generateTripCode();
    setTripCode(code);

    const tripData = {
      title,
      description,
      deadline: deadline.toISOString().split('T')[0],
      startDate: startDate?.toISOString().split('T')[0],
      endDate: endDate?.toISOString().split('T')[0],
      location,
      participants: participants.length > 0 ? participants : ["나"],
      participantCount: participants.length > 0 ? participants.length : 1, // 참여자 수 명시적으로 저장
      code
    };

    onCreateTrip(tripData);
    setShowSuccessDialog(true);
  };

  const addParticipant = () => {
    if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant("");
    }
  };

  const removeParticipant = (participant: string) => {
    setParticipants(participants.filter(p => p !== participant));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(tripCode);
      setCopied(true);
      toast.success("여행 코드가 복사되었습니다!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("복사에 실패했습니다.");
    }
  };

  const handleClose = () => {
    // 폼 리셋
    setTitle("");
    setDescription("");
    setDeadline(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    setLocation("");
    setParticipants([]);
    setNewParticipant("");
    setShowSuccessDialog(false);
    setTripCode("");
    setCopied(false);
    setErrors([]);
    onOpenChange(false);
  };

  // 날짜 변경 시 검증
  const handleDateChange = (type: 'deadline' | 'startDate' | 'endDate', date: Date | undefined) => {
    if (type === 'deadline') setDeadline(date);
    if (type === 'startDate') setStartDate(date);
    if (type === 'endDate') setEndDate(date);
    
    // 잠시 후 검증 실행 (상태 업데이트 후)
    setTimeout(() => {
      validateDates();
    }, 0);
  };

  if (showSuccessDialog) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">여행 계획이 생성되었습니다! 🎉</DialogTitle>
            <DialogDescription className="text-center">
              친구들에게 아래 코드를 공유해서 여행 계획에 참여하도록 초대하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">여행 참여 코드</p>
              <div className="flex items-center justify-center space-x-2">
                <div className="bg-gray-100 px-4 py-2 rounded-lg font-mono text-lg font-bold">
                  {tripCode}
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? "복사됨" : "복사"}</span>
                </Button>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>팁:</strong> 이 코드를 친구들에게 공유하면 여행 계획에 참여할 수 있습니다. 
                여행 상세 페이지에서도 언제든지 코드를 확인할 수 있어요!
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleClose} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>새 여행 계획 만들기</DialogTitle>
          <DialogDescription>
            친구들과 함께할 여행 계획을 만들어보세요.
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
              placeholder="예: 제주도 여행"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">여행 지역 *</Label>
            <Input
              id="location"
              placeholder="예: 제주도, 부산, 서울"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">여행 설명</Label>
            <Textarea
              id="description"
              placeholder="여행에 대한 설명을 입력하세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>여행 시작일</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      startDate && endDate && startDate > endDate ? 'border-red-500' : ''
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "MM/dd", { locale: ko }) : "시작일"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => handleDateChange('startDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>여행 종료일</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      startDate && endDate && startDate > endDate ? 'border-red-500' : ''
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "MM/dd", { locale: ko }) : "종료일"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => handleDateChange('endDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>투표 마감일 *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    deadline && startDate && deadline >= startDate ? 'border-red-500' : ''
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP", { locale: ko }) : "날짜를 선택하세요"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={(date) => handleDateChange('deadline', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>참여자</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="참여자 이름을 입력하세요"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addParticipant())}
              />
              <Button type="button" onClick={addParticipant} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {participants.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {participants.map((participant) => (
                  <Badge key={participant} variant="secondary" className="flex items-center space-x-1">
                    <span>{participant}</span>
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeParticipant(participant)}
                    />
                  </Badge>
                ))}
              </div>
            )}
            
            {participants.length === 0 && (
              <p className="text-sm text-gray-500">참여자를 추가하지 않으면 "나"로 설정됩니다.</p>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={!title || !deadline || !location || errors.length > 0}
            >
              여행 계획 만들기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTripDialog;