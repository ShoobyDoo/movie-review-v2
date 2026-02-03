import { supabase } from "./supabase";
import type {
  CustomList,
  CustomListMovie,
  CustomListUpdate,
  CustomListWithCount,
  CustomListWithFullMovies,
  CustomListWithUserAndCount,
  DbResponse,
  DbErrorResponse,
} from "./types";

/**
 * Create a new custom list
 * @param name Name of the custom list
 * @param description Optional description of the list
 * @param isPublic Whether the list is publicly visible (default: false)
 * @returns Created custom list
 */
export async function createCustomList(
  name: string,
  description?: string,
  isPublic: boolean = false,
): Promise<DbResponse<CustomList>> {
  const { data, error } = await supabase
    .from("custom_lists")
    .insert({
      name,
      description: description || null,
      is_public: isPublic,
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Get all custom lists for a user with movie counts
 * @param userId User's unique identifier
 * @returns Array of custom lists with movie counts
 */
export async function getUserCustomLists(
  userId: string,
): Promise<DbResponse<CustomListWithCount[]>> {
  const { data, error } = await supabase
    .from("custom_lists")
    .select(
      `
      *,
      custom_list_movies(count)
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Get a specific custom list by ID with all movies
 * @param listId Custom list's unique identifier
 * @returns Custom list with full movie data
 */
export async function getCustomListById(
  listId: string,
): Promise<DbResponse<CustomListWithFullMovies>> {
  const { data, error } = await supabase
    .from("custom_lists")
    .select(
      `
      *,
      custom_list_movies(
        id,
        added_at,
        movie:movies(*)
      )
    `,
    )
    .eq("id", listId)
    .single();

  return { data, error };
}

/**
 * Get all public custom lists with movie counts
 * @param limit Maximum number of lists to return (default: 20)
 * @returns Array of public custom lists with movie counts and user info
 */
export async function getPublicCustomLists(
  limit: number = 20,
): Promise<DbResponse<CustomListWithUserAndCount[]>> {
  const { data, error } = await supabase
    .from("custom_lists")
    .select(
      `
      *,
      user:profiles(username, display_name, avatar_url),
      custom_list_movies(count)
    `,
    )
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data, error };
}

/**
 * Update a custom list
 * @param listId Custom list's unique identifier
 * @param updates Partial custom list updates
 * @returns Updated custom list
 */
export async function updateCustomList(
  listId: string,
  updates: CustomListUpdate,
): Promise<DbResponse<CustomList>> {
  const { data, error } = await supabase
    .from("custom_lists")
    .update(updates)
    .eq("id", listId)
    .select()
    .single();

  return { data, error };
}

/**
 * Delete a custom list (will cascade delete all movies in the list)
 * @param listId Custom list's unique identifier
 * @returns Error if deletion fails
 */
export async function deleteCustomList(
  listId: string,
): Promise<DbErrorResponse> {
  const { error } = await supabase
    .from("custom_lists")
    .delete()
    .eq("id", listId);

  return { error };
}

/**
 * Add a movie to a custom list
 * @param listId Custom list's unique identifier
 * @param movieId Movie's unique identifier
 * @returns Created custom list movie entry
 */
export async function addMovieToCustomList(
  listId: string,
  movieId: string,
): Promise<DbResponse<CustomListMovie>> {
  const { data, error } = await supabase
    .from("custom_list_movies")
    .insert({
      list_id: listId,
      movie_id: movieId,
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Remove a movie from a custom list
 * @param listId Custom list's unique identifier
 * @param movieId Movie's unique identifier
 * @returns Error if removal fails
 */
export async function removeMovieFromCustomList(
  listId: string,
  movieId: string,
): Promise<DbErrorResponse> {
  const { error } = await supabase
    .from("custom_list_movies")
    .delete()
    .eq("list_id", listId)
    .eq("movie_id", movieId);

  return { error };
}
