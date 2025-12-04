import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Show, Movie } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const showSchema = z.object({
  movie_id: z.coerce.number().min(1, 'Movie is required'),
  show_time: z.string().min(1, 'Show time is required'),
  screen_number: z.coerce.number().min(1, 'Screen number is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  total_seats: z.coerce.number().min(10).max(100).optional(),
});

type ShowFormValues = z.infer<typeof showSchema>;

interface ShowFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ShowFormValues) => void;
  show?: Show | null;
  movies: Movie[];
  isLoading?: boolean;
}

export function ShowForm({ open, onClose, onSubmit, show, movies, isLoading }: ShowFormProps) {
  const form = useForm<ShowFormValues>({
    resolver: zodResolver(showSchema),
    defaultValues: show
      ? {
          movie_id: show.movie_id,
          show_time: show.show_time.slice(0, 16),
          screen_number: show.screen_number,
          price: Number(show.price),
        }
      : {
          movie_id: 0,
          show_time: '',
          screen_number: 1,
          price: 12.99,
          total_seats: 50,
        },
  });

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{show ? 'Edit Show' : 'Add Show'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="movie_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Movie</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a movie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {movies.map((movie) => (
                        <SelectItem key={movie.movie_id} value={movie.movie_id.toString()}>
                          {movie.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="show_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Show Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="screen_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Screen Number</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min={0.01} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {!show && (
              <FormField
                control={form.control}
                name="total_seats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Seats</FormLabel>
                    <FormControl>
                      <Input type="number" min={10} max={100} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : show ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
