import { Show } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Monitor, DollarSign, Pencil, Trash2, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface ShowCardProps {
  show: Show;
  onEdit: (show: Show) => void;
  onDelete: (id: number) => void;
}

export function ShowCard({ show, onEdit, onDelete }: ShowCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="glass overflow-hidden hover:glow-sm transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-1">{show.title || `Show #${show.show_id}`}</h3>
          {show.genre && <Badge variant="secondary">{show.genre}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-primary font-medium">
          {format(new Date(show.show_time), 'MMM d, yyyy • h:mm a')}
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Monitor className="h-3.5 w-3.5" />
            Screen {show.screen_number}
          </span>
          {show.duration_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {show.duration_minutes} min
            </span>
          )}
          <span className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5" />
            ${Number(show.price).toFixed(2)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="gap-2 pt-3 border-t border-border/50">
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1"
          onClick={() => navigate(`/shows/${show.show_id}/book`)}
        >
          <Ticket className="h-3.5 w-3.5 mr-1" />
          Book
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onEdit(show)}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(show.show_id)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
