import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Vote, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TripCardProps {
  trip: {
    id: number;
    title: string;
    description: string;
    deadline: string;
    participantCount: number;
    categoryCount: number;
    status: string;
  };
  onDelete?: (tripId: number) => void;
  showDeleteButton?: boolean;
}

const TripCard = ({ trip, onDelete, showDeleteButton = false }: TripCardProps) => {
  const navigate = useNavigate();
  const deadlineDate = new Date(trip.deadline);
  const isExpired = deadlineDate < new Date();

  const handleViewTrip = () => {
    navigate(`/trip/${trip.id}`);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(trip.id);
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{trip.title}</CardTitle>
            <CardDescription className="mt-1">{trip.description}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={trip.status === "active" ? "default" : "secondary"}
              className={trip.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-600"}
            >
              {trip.status === "active" ? "진행중" : "마감됨"}
            </Badge>
            {showDeleteButton && onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>여행 계획 삭제</AlertDialogTitle>
                    <AlertDialogDescription>
                      "{trip.title}" 여행 계획을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      삭제
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>마감: {format(deadlineDate, "PPP", { locale: ko })}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span>참여자 {trip.participantCount}명</span>
          </div>
        </div>
        
        <Button 
          onClick={handleViewTrip}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          <MapPin className="h-4 w-4 mr-2" />
          여행 계획 보기
        </Button>
      </CardContent>
    </Card>
  );
};

export default TripCard;