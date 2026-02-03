import { supabase } from "./supabase";
import type {
  Review,
  ReviewUpdate,
  ReviewWithDetails,
  ReviewWithFullDetails,
  ReviewWithMovie,
  DbResponse,
  DbErrorResponse,
} from "./types";

/**
 * Create a new review for a movie
 * @param movieId Movie's unique identifier
 * @param rating Rating score (1-10)
 * @param reviewText Review content text
 * @param isPublic Whether the review is publicly visible (default: true)
 * @returns Created review data
 */
export async function createReview(
  movieId: string,
  rating: number,
  reviewText: string,
  isPublic: boolean = true,
): Promise<DbResponse<Review>> {
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      movie_id: movieId,
      rating,
      review_text: reviewText,
      is_public: isPublic,
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Get public reviews with user and movie details
 * @param limit Maximum number of reviews to return (default: 10)
 * @returns Array of public reviews with joined user and movie data
 */
export async function getPublicReviews(
  limit: number = 10,
): Promise<DbResponse<ReviewWithDetails[]>> {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      user:profiles(username, display_name, avatar_url),
      movie:movies(id, title, poster_url, year)
    `,
    )
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data, error };
}

/**
 * Get a specific review by ID with full details
 * @param reviewId Review's unique identifier
 * @returns Review with full user and movie data
 */
export async function getReviewById(
  reviewId: string,
): Promise<DbResponse<ReviewWithFullDetails>> {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      user:profiles(*),
      movie:movies(*)
    `,
    )
    .eq("id", reviewId)
    .eq("is_public", true)
    .single();

  return { data, error };
}

/**
 * Get all public reviews by a specific user
 * @param userId User's unique identifier
 * @returns Array of user's reviews with movie data
 */
export async function getUserReviews(
  userId: string,
): Promise<DbResponse<ReviewWithMovie[]>> {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      movie:movies(id, title, poster_url, year)
    `,
    )
    .eq("user_id", userId)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  return { data, error };
}

/**
 * Update an existing review
 * @param reviewId Review's unique identifier
 * @param updates Partial review updates
 * @returns Updated review data
 */
export async function updateReview(
  reviewId: string,
  updates: ReviewUpdate,
): Promise<DbResponse<Review>> {
  const { data, error } = await supabase
    .from("reviews")
    .update(updates)
    .eq("id", reviewId)
    .select()
    .single();

  return { data, error };
}

/**
 * Delete a review
 * @param reviewId Review's unique identifier
 * @returns Error if deletion fails
 */
export async function deleteReview(reviewId: string): Promise<DbErrorResponse> {
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

  return { error };
}
