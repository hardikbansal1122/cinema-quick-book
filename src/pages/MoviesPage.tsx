import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moviesApi } from '@/services/api';
import { Movie } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { MovieCard } from '@/components/movies/MovieCard';
import { MovieForm } from '@/components/movies/MovieForm';
import { Button } from '@/components/ui/button';
import { Plus, Film } from 'lucide-react';
import { toast } from 'sonner';

export default function MoviesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const queryClient = useQueryClient();

  const { data: movies = [], isLoading, error } = useQuery({
    queryKey: ['movies'],
    queryFn: moviesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: moviesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      setFormOpen(false);
      toast.success('Movie created successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<Movie, 'movie_id'> }) =>
      moviesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      setEditingMovie(null);
      toast.success('Movie updated successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: moviesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      toast.success('Movie deleted successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleSubmit = (data: Omit<Movie, 'movie_id'>) => {
    if (editingMovie) {
      updateMutation.mutate({ id: editingMovie.movie_id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Film className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Unable to load movies</h2>
        <p className="text-muted-foreground">Please check if the backend server is running.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Movies"
        description="Manage your movie catalog"
        action={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Movie
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-xl bg-card animate-pulse" />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Film className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No movies yet</h2>
          <p className="text-muted-foreground mb-4">Add your first movie to get started.</p>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Movie
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <MovieCard
              key={movie.movie_id}
              movie={movie}
              onEdit={(movie) => setEditingMovie(movie)}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      <MovieForm
        open={formOpen || !!editingMovie}
        onClose={() => {
          setFormOpen(false);
          setEditingMovie(null);
        }}
        onSubmit={handleSubmit}
        movie={editingMovie}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
