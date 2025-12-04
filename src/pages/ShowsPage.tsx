import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showsApi, moviesApi } from '@/services/api';
import { Show } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { ShowCard } from '@/components/shows/ShowCard';
import { ShowForm } from '@/components/shows/ShowForm';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function ShowsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const queryClient = useQueryClient();

  const { data: shows = [], isLoading, error } = useQuery({
    queryKey: ['shows'],
    queryFn: showsApi.getAll,
  });

  const { data: movies = [] } = useQuery({
    queryKey: ['movies'],
    queryFn: moviesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: showsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shows'] });
      setFormOpen(false);
      toast.success('Show created successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<Show, 'show_id'> }) =>
      showsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shows'] });
      setEditingShow(null);
      toast.success('Show updated successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: showsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shows'] });
      toast.success('Show deleted successfully');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleSubmit = (data: Omit<Show, 'show_id'> & { total_seats?: number }) => {
    if (editingShow) {
      const { total_seats, ...updateData } = data;
      updateMutation.mutate({ id: editingShow.show_id, data: updateData });
    } else {
      createMutation.mutate(data);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Unable to load shows</h2>
        <p className="text-muted-foreground">Please check if the backend server is running.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Shows"
        description="Schedule and manage movie screenings"
        action={
          <Button onClick={() => setFormOpen(true)} disabled={movies.length === 0}>
            <Plus className="h-4 w-4 mr-2" />
            Add Show
          </Button>
        }
      />

      {movies.length === 0 && (
        <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-sm">
          Add movies first before creating shows.
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 rounded-xl bg-card animate-pulse" />
          ))}
        </div>
      ) : shows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No shows scheduled</h2>
          <p className="text-muted-foreground mb-4">Schedule your first show.</p>
          <Button onClick={() => setFormOpen(true)} disabled={movies.length === 0}>
            <Plus className="h-4 w-4 mr-2" />
            Add Show
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shows.map((show) => (
            <ShowCard
              key={show.show_id}
              show={show}
              onEdit={(show) => setEditingShow(show)}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      <ShowForm
        open={formOpen || !!editingShow}
        onClose={() => {
          setFormOpen(false);
          setEditingShow(null);
        }}
        onSubmit={handleSubmit}
        show={editingShow}
        movies={movies}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
