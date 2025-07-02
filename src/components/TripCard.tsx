
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Vote } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

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
}

const TripCard = ({ trip }: TripCardProps) => {
  const navigate = useNavigate();
  const deadlineDate = new Date(trip.deadline);
  const isExpired = deadlineDate < new Date();

  const handleViewTrip = () => {
    navigate(`/trip/${trip.id}`);
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{trip.title}</CardTitle>
            <CardDescription className="mt-1">{trip.description}</CardDescription>
          </div>
          <Badge 
            variant={trip.status === "active" ? "default" : "secondary"}
            className={trip.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-600"}
          >
            {trip.status === "active" ? "진행중" : "마감됨"}
          </Badge>
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
