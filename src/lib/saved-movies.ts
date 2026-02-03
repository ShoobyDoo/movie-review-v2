import { supabase } from "./supabase";
import type {
  SavedMovie,
  SavedMovieWithDetails,
  ListType,
  DbResponse,
  DbErrorResponse,
} from "./types";

/**
 * Add a movie to a user's list (watchlist, favorites, or watched)
 * @param movieId Movie's unique identifier
 * @param listType Type of list: 'watchlist', 'favorites', or 'watched'
 * @returns Created saved movie entry
 */
export async function addToList(
  movieId: string,
  listType: ListType,
): Promise<DbResponse<SavedMovie>> {
  const { data, error } = await supabase
    .from("saved_movies")
    .insert({
      movie_id: movieId,
      list_type: listType,
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Remove a movie from a user's list
 * @param movieId Movie's unique identifier
 * @param listType Type of list: 'watchlist', 'favorites', or 'watched'
 * @returns Error if removal fails
 */
export async function removeFromList(
  movieId: string,
  listType: ListType,
): Promise<DbErrorResponse> {
  const { error } = await supabase
    .from("saved_movies")
    .delete()
    .eq("movie_id", movieId)
    .eq("list_type", listType);

  return { error };
}

/**
 * Get all movies in a user's specific list
 * @param userId User's unique identifier
 * @param listType Type of list: 'watchlist', 'favorites', or 'watched'
 * @returns Array of saved movies with full movie data
 */
export async function getUserList(
  userId: string,
  listType: ListType,
): Promise<DbResponse<SavedMovieWithDetails[]>> {
  const { data, error } = await supabase
    .from("saved_movies")
    .select(
      `
      *,
      movie:movies(*)
    `,
    )
    .eq("user_id", userId)
    .eq("list_type", listType)
    .order("created_at", { ascending: false });

  return { data, error };
}
