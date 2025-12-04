import { Seat } from '@/types';
import { cn } from '@/lib/utils';

interface SeatSelectorProps {
  seats: Seat[];
  selectedSeat: Seat | null;
  onSelect: (seat: Seat) => void;
}

export function SeatSelector({ seats, selectedSeat, onSelect }: SeatSelectorProps) {
  // Group seats by row
  const rows = seats.reduce((acc, seat) => {
    const row = seat.seat_number[0];
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  return (
    <div className="space-y-6">
      {/* Screen indicator */}
      <div className="relative">
        <div className="h-2 bg-primary/30 rounded-t-full mx-auto w-3/4" />
        <p className="text-center text-sm text-muted-foreground mt-2">SCREEN</p>
      </div>

      {/* Seats */}
      <div className="space-y-2">
        {Object.entries(rows)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([row, rowSeats]) => (
            <div key={row} className="flex items-center justify-center gap-2">
              <span className="w-6 text-sm text-muted-foreground">{row}</span>
              <div className="flex gap-1">
                {rowSeats
                  .sort((a, b) => parseInt(a.seat_number.slice(1)) - parseInt(b.seat_number.slice(1)))
                  .map((seat) => (
                    <button
                      key={seat.seat_id}
                      disabled={seat.is_booked}
                      onClick={() => !seat.is_booked && onSelect(seat)}
                      className={cn(
                        'w-8 h-8 rounded-t-lg text-xs font-medium transition-all',
                        seat.is_booked && 'bg-destructive/50 cursor-not-allowed',
                        !seat.is_booked && selectedSeat?.seat_id !== seat.seat_id && 'bg-green-600 hover:bg-green-500 cursor-pointer',
                        selectedSeat?.seat_id === seat.seat_id && 'bg-primary glow cursor-pointer'
                      )}
                      title={seat.seat_number}
                    >
                      {seat.seat_number.slice(1)}
                    </button>
                  ))}
              </div>
              <span className="w-6 text-sm text-muted-foreground">{row}</span>
            </div>
          ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t bg-green-600" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t bg-primary" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t bg-destructive/50" />
          <span className="text-muted-foreground">Booked</span>
        </div>
      </div>
    </div>
  );
}
