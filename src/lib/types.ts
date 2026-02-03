import { PostgrestError } from '@supabase/supabase-js';

// ============================================================================
// DATABASE ENTITY TYPES
// ============================================================================

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Movie {
  id: string;
  imdb_id: string;
  title: string;
  year: string;
  rated: string | null;
  released: string | null;
  runtime: string | null;
  genre: string | null;
  director: string | null;
  writer: string | null;
  actors: string | null;
  plot: string | null;
  language: string | null;
  country: string | null;
  awards: string | null;
  poster_url: string;
  metascore: string | null;
  imdb_rating: string | null;
  imdb_votes: string | null;
  type: string | null;
  box_office: string | null;
  production: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  movie_id: string;
  rating: number;
  review_text: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  review_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
  updated_at: string;
}

export interface CommentVote {
  id: string;
  comment_id: string;
  user_id: string;
  vote_type: 1 | -1;
  created_at: string;
}

export type ListType = 'watchlist' | 'favorites' | 'watched';

export interface SavedMovie {
  id: string;
  user_id: string;
  movie_id: string;
  list_type: ListType;
  created_at: string;
}

export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface CustomList {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomListMovie {
  id: string;
  list_id: string;
  movie_id: string;
  added_at: string;
}

// ============================================================================
// EXTENDED TYPES (for queries with joins)
// ============================================================================

// Review types with joined data
export interface ReviewWithDetails extends Review {
  user: Pick<Profile, 'username' | 'display_name' | 'avatar_url'>;
  movie: Pick<Movie, 'id' | 'title' | 'poster_url' | 'year'>;
}

export interface ReviewWithFullDetails extends Review {
  user: Profile;
  movie: Movie;
}

export interface ReviewWithMovie extends Review {
  movie: Pick<Movie, 'id' | 'title' | 'poster_url' | 'year'>;
}

// Comment types with joined data
export interface CommentWithUser extends Comment {
  user: Pick<Profile, 'username' | 'display_name' | 'avatar_url'>;
}

// Saved movie types with joined data
export interface SavedMovieWithDetails extends SavedMovie {
  movie: Movie;
}

// Follow types with joined data
export interface FollowerWithProfile {
  follower: Profile;
}

export interface FollowingWithProfile {
  following: Profile;
}

// Custom list types with joined data
export interface CustomListWithCount extends CustomList {
  custom_list_movies: { count: number }[];
}

export interface CustomListMovieWithMovie {
  id: string;
  added_at: string;
  movie: Movie;
}

export interface CustomListWithFullMovies extends CustomList {
  custom_list_movies: CustomListMovieWithMovie[];
}

export interface CustomListWithUserAndCount extends CustomList {
  user: Pick<Profile, 'username' | 'display_name' | 'avatar_url'>;
  custom_list_movies: { count: number }[];
}

// Legacy type (kept for backwards compatibility)
export interface CustomListWithMovies extends CustomList {
  movies?: Movie[];
  movie_count?: number;
}

// ============================================================================
// OMDB API TYPES
// ============================================================================

export interface OMDBMovieData {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Plot?: string;
  Genre?: string;
  Director?: string;
  Actors?: string;
  imdbRating?: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Writer?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Metascore?: string;
  imdbVotes?: string;
  Type?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
}

// ============================================================================
// FUNCTION RETURN TYPES
// ============================================================================

export interface DbResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

export interface DbErrorResponse {
  error: PostgrestError | null;
}

// ============================================================================
// UPDATE TYPES (partial)
// ============================================================================

export type ProfileUpdate = Partial<Pick<Profile, 'username' | 'display_name' | 'bio' | 'avatar_url'>>;

export type ReviewUpdate = Partial<Pick<Review, 'rating' | 'review_text' | 'is_public'>>;

export type CustomListUpdate = Partial<Pick<CustomList, 'name' | 'description' | 'is_public'>>;

// ============================================================================
// HELPER RETURN TYPES
// ============================================================================

export interface CommentVoteCounts {
  upvotes: number;
  downvotes: number;
}

// ============================================================================
// REALTIME CALLBACK TYPES
// ============================================================================

export type CommentCallback = (comment: Comment) => void;

// Using a more permissive type for Supabase realtime payloads
// since the actual structure varies by event type (INSERT/UPDATE/DELETE)
export type VoteCallback = (payload: {
  new: Partial<CommentVote>;
  old: Partial<CommentVote>;
  eventType?: string;
  [key: string]: unknown;
}) => void;
