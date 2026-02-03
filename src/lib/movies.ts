import { supabase } from "./supabase";
import type { Movie, OMDBMovieData, DbResponse } from "./types";

/**
 * Get an existing movie or create a new one from OMDB data
 * @param omdbData Movie data from OMDB API
 * @returns Movie object with only the ID
 */
export async function getOrCreateMovie(
  omdbData: OMDBMovieData,
): Promise<DbResponse<Pick<Movie, "id">>> {
  // Check if movie exists
  const { data: existing } = await supabase
    .from("movies")
    .select("id")
    .eq("imdb_id", omdbData.imdbID)
    .single();

  if (existing) {
    return { data: existing, error: null };
  }

  // Create new movie
  const { data, error } = await supabase
    .from("movies")
    .insert({
      imdb_id: omdbData.imdbID,
      title: omdbData.Title,
      year: omdbData.Year,
      poster_url: omdbData.Poster,
      plot: omdbData.Plot,
      genre: omdbData.Genre,
      director: omdbData.Director,
      actors: omdbData.Actors,
      imdb_rating: omdbData.imdbRating,
    })
    .select()
    .single();

  return { data, error };
}
