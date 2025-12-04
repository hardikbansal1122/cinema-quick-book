import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '@/services/api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ticket, Calendar, Monitor, User, X, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function BookingsPage() {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingsApi.getAll,
  });

  const cancelMutation = useMutation({
    mutationFn: bookingsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking cancelled');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Ticket className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Unable to load bookings</h2>
        <p className="text-muted-foreground">Please check if the backend server is running.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Bookings"
        description="View and manage all ticket reservations"
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-card animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Ticket className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No bookings yet</h2>
          <p className="text-muted-foreground">Book a show to see your reservations here.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <Card key={booking.booking_id} className="glass hover:glow-sm transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-lg line-clamp-1">{booking.title}</h3>
                  <Badge variant="default" className="shrink-0">
                    {booking.seat_number}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {booking.user_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Monitor className="h-3.5 w-3.5" />
                    Screen {booking.screen_number}
                  </span>
                  {booking.price && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" />
                      ${Number(booking.price).toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Calendar className="h-3.5 w-3.5" />
                  {booking.show_time && format(new Date(booking.show_time), 'MMM d, yyyy • h:mm a')}
                </div>
                <p className="text-xs text-muted-foreground">
                  Booked: {format(new Date(booking.booking_time), 'MMM d, yyyy h:mm a')}
                </p>
              </CardContent>
              <CardFooter className="pt-3 border-t border-border/50">
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => cancelMutation.mutate(booking.booking_id)}
                  disabled={cancelMutation.isPending}
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Cancel Booking
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
