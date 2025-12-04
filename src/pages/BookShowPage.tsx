import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showsApi, seatsApi, bookingsApi } from '@/services/api';
import { Seat } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { SeatSelector } from '@/components/bookings/SeatSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Monitor, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function BookShowPage() {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [userName, setUserName] = useState('');

  const { data: show, isLoading: showLoading } = useQuery({
    queryKey: ['show', showId],
    queryFn: () => showsApi.getById(Number(showId)),
    enabled: !!showId,
  });

  const { data: seats = [], isLoading: seatsLoading } = useQuery({
    queryKey: ['seats', showId],
    queryFn: () => seatsApi.getByShow(Number(showId)),
    enabled: !!showId,
  });

  const bookMutation = useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seats', showId] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking confirmed!');
      navigate('/bookings');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleBook = () => {
    if (!selectedSeat || !userName.trim() || !showId) return;
    bookMutation.mutate({
      user_name: userName.trim(),
      show_id: Number(showId),
      seat_id: selectedSeat.seat_id,
    });
  };

  const isLoading = showLoading || seatsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-card animate-pulse rounded" />
        <div className="h-96 bg-card animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">Show not found</h2>
        <Button variant="secondary" onClick={() => navigate('/shows')}>
          Back to Shows
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button variant="ghost" className="mb-4" onClick={() => navigate('/shows')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Shows
      </Button>

      <PageHeader
        title={show.title || `Show #${show.show_id}`}
        description="Select your seat and complete booking"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Select Seat</CardTitle>
            </CardHeader>
            <CardContent>
              <SeatSelector
                seats={seats}
                selectedSeat={selectedSeat}
                onSelect={setSelectedSeat}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="glass sticky top-24">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(show.show_time), 'MMM d, yyyy • h:mm a')}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Monitor className="h-4 w-4" />
                  Screen {show.screen_number}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  ${Number(show.price).toFixed(2)}
                </div>
              </div>

              {selectedSeat && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm font-medium">Selected Seat</p>
                  <p className="text-2xl font-bold text-primary">{selectedSeat.seat_number}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="userName">Your Name</Label>
                <Input
                  id="userName"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={!selectedSeat || !userName.trim() || bookMutation.isPending}
                onClick={handleBook}
              >
                {bookMutation.isPending ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
