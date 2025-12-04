export interface Movie {
  movie_id: number;
  title: string;
  description: string;
  duration_minutes: number;
  language: string;
  genre: string;
  release_date: string;
}

export interface Show {
  show_id: number;
  movie_id: number;
  show_time: string;
  screen_number: number;
  price: number;
  title?: string;
  duration_minutes?: number;
  genre?: string;
}

export interface Seat {
  seat_id: number;
  show_id: number;
  seat_number: string;
  is_booked: boolean;
}

export interface Booking {
  booking_id: number;
  user_name: string;
  show_id: number;
  seat_id: number;
  booking_time: string;
  show_time?: string;
  screen_number?: number;
  price?: number;
  seat_number?: string;
  title?: string;
}
