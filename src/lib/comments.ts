import { supabase } from "./supabase";
import type { CommentWithUser, DbResponse, DbErrorResponse } from "./types";

/**
 * Create a new comment on a review
 * @param reviewId Review's unique identifier
 * @param commentText Comment content text
 * @returns Created comment with user data
 */
export async function createComment(
  reviewId: string,
  commentText: string,
): Promise<DbResponse<CommentWithUser>> {
  const response = await supabase
    .from("comments")
    .insert({
      review_id: reviewId,
      comment_text: commentText,
    })
    .select(
      `
      *,
      user:profiles(username, display_name, avatar_url)
    `,
    )
    .single();

  return {
    data: response.data as CommentWithUser | null,
    error: response.error,
  };
}

/**
 * Get all comments for a specific review
 * @param reviewId Review's unique identifier
 * @returns Array of comments with user data
 */
export async function getReviewComments(
  reviewId: string,
): Promise<DbResponse<CommentWithUser[]>> {
  const response = await supabase
    .from("comments")
    .select(
      `
      *,
      user:profiles(username, display_name, avatar_url)
    `,
    )
    .eq("review_id", reviewId)
    .order("created_at", { ascending: true });

  return { data: response.data, error: response.error };
}

/**
 * Delete a comment
 * @param commentId Comment's unique identifier
 * @returns Error if deletion fails
 */
export async function deleteComment(
  commentId: string,
): Promise<DbErrorResponse> {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  return { error };
}
