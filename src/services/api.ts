import { Movie, Show, Seat, Booking } from '@/types';

const API_BASE = 'http://localhost:3000/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || 'An error occurred');
  }
  return response.json();
}

// Movies
export const moviesApi = {
  getAll: () => fetch(`${API_BASE}/movies`).then(res => handleResponse<Movie[]>(res)),
  
  getById: (id: number) => fetch(`${API_BASE}/movies/${id}`).then(res => handleResponse<Movie>(res)),
  
  create: (movie: Omit<Movie, 'movie_id'>) =>
    fetch(`${API_BASE}/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    }).then(res => handleResponse<Movie>(res)),
  
  update: (id: number, movie: Omit<Movie, 'movie_id'>) =>
    fetch(`${API_BASE}/movies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    }).then(res => handleResponse<Movie>(res)),
  
  delete: (id: number) =>
    fetch(`${API_BASE}/movies/${id}`, { method: 'DELETE' }).then(res => handleResponse<{ message: string }>(res)),
};

// Shows
export const showsApi = {
  getAll: () => fetch(`${API_BASE}/shows`).then(res => handleResponse<Show[]>(res)),
  
  getById: (id: number) => fetch(`${API_BASE}/shows/${id}`).then(res => handleResponse<Show>(res)),
  
  getByMovie: (movieId: number) =>
    fetch(`${API_BASE}/movies/${movieId}/shows`).then(res => handleResponse<Show[]>(res)),
  
  create: (show: Omit<Show, 'show_id'> & { total_seats?: number }) =>
    fetch(`${API_BASE}/shows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(show),
    }).then(res => handleResponse<Show>(res)),
  
  update: (id: number, show: Omit<Show, 'show_id'>) =>
    fetch(`${API_BASE}/shows/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(show),
    }).then(res => handleResponse<Show>(res)),
  
  delete: (id: number) =>
    fetch(`${API_BASE}/shows/${id}`, { method: 'DELETE' }).then(res => handleResponse<{ message: string }>(res)),
};

// Seats
export const seatsApi = {
  getByShow: (showId: number) =>
    fetch(`${API_BASE}/shows/${showId}/seats`).then(res => handleResponse<Seat[]>(res)),
  
  getAvailable: (showId: number) =>
    fetch(`${API_BASE}/shows/${showId}/seats/available`).then(res => handleResponse<Seat[]>(res)),
};

// Bookings
export const bookingsApi = {
  getAll: () => fetch(`${API_BASE}/bookings`).then(res => handleResponse<Booking[]>(res)),
  
  getById: (id: number) => fetch(`${API_BASE}/bookings/${id}`).then(res => handleResponse<Booking>(res)),
  
  create: (booking: { user_name: string; show_id: number; seat_id: number }) =>
    fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    }).then(res => handleResponse<Booking>(res)),
  
  delete: (id: number) =>
    fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE' }).then(res => handleResponse<{ message: string }>(res)),
};
