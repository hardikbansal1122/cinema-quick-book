import { Movie } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Globe, Pencil, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface MovieCardProps {
  movie: Movie;
  onEdit: (movie: Movie) => void;
  onDelete: (id: number) => void;
}

export function MovieCard({ movie, onEdit, onDelete }: MovieCardProps) {
  return (
    <Card className="glass overflow-hidden group hover:glow-sm transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-1">{movie.title}</h3>
          <Badge variant="secondary" className="shrink-0">{movie.genre}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{movie.description}</p>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {movie.duration_minutes} min
          </span>
          <span className="flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" />
            {movie.language}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {format(new Date(movie.release_date), 'MMM d, yyyy')}
          </span>
        </div>
      </CardContent>
      <CardFooter className="gap-2 pt-3 border-t border-border/50">
        <Button variant="secondary" size="sm" className="flex-1" onClick={() => onEdit(movie)}>
          <Pencil className="h-3.5 w-3.5 mr-1" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" className="flex-1" onClick={() => onDelete(movie.movie_id)}>
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
