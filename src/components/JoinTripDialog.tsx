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
import { Users, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JoinTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JoinTripDialog = ({ open, onOpenChange }: JoinTripDialogProps) => {
  const [tripCode, setTripCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripCode.trim()) return;
    
    setError("");
    
    // 여행 코드로 여행 찾기 (간단한 구현: 여행 ID와 매핑)
    const code = tripCode.trim().toUpperCase();
    
    // 기본 예시 데이터의 코드
    if (code === "JEJU2024") {
      navigate("/trip/1");
      onOpenChange(false);
      return;
    }
    
    // 로컬 스토리지에서 저장된 여행들 확인
    const storedTrips = localStorage.getItem('tripPlans');
    if (storedTrips) {
      const trips = JSON.parse(storedTrips);
      const foundTrip = Object.values(trips).find((trip: any) => trip.code === code);
      
      if (foundTrip) {
        navigate(`/trip/${(foundTrip as any).id}`);
        onOpenChange(false);
        return;
      }
    }
    
    setError("존재하지 않는 여행 코드입니다.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>여행 계획 참여하기</span>
          </DialogTitle>
          <DialogDescription>
            친구에게 받은 여행 코드를 입력하세요.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tripCode">여행 코드 *</Label>
            <Input
              id="tripCode"
              placeholder="예: JEJU2024"
              value={tripCode}
              onChange={(e) => {
                setTripCode(e.target.value);
                setError("");
              }}
              required
              autoFocus
              className="uppercase"
            />
            {error && (
              <div className="flex items-center space-x-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              disabled={!tripCode.trim()}
            >
              참여하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinTripDialog;