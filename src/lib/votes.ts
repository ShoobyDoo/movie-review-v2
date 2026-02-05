import { supabase } from "./supabase";
import type {
  CommentVote,
  CommentVoteCounts,
  DbResponse,
  DbErrorResponse,
} from "./types";

/**
 * Vote on a comment (upvote or downvote)
 * Uses upsert to update existing vote if user already voted
 * @param commentId Comment's unique identifier
 * @param voteType Vote type: 1 for upvote, -1 for downvote
 * @returns Created or updated vote data
 */
export async function voteOnComment(
  commentId: string,
  voteType: 1 | -1,
): Promise<DbResponse<CommentVote>> {
  // Try to insert vote (will fail if already exists due to unique constraint)
  const response = await supabase
    .from("comment_votes")
    .upsert(
      {
        comment_id: commentId,
        vote_type: voteType,
      },
      {
        onConflict: "comment_id,user_id",
      },
    )
    .select()
    .single();

  return { data: response.data as CommentVote | null, error: response.error };
}

/**
 * Remove a user's vote from a comment
 * @param commentId Comment's unique identifier
 * @returns Error if removal fails
 */
export async function removeVote(commentId: string): Promise<DbErrorResponse> {
  const { error } = await supabase
    .from("comment_votes")
    .delete()
    .eq("comment_id", commentId);

  return { error };
}

/**
 * Get vote counts for a comment
 * @param commentId Comment's unique identifier
 * @returns Object with upvote and downvote counts
 */
export async function getCommentVotes(
  commentId: string,
): Promise<DbResponse<CommentVoteCounts>> {
  const response = await supabase.rpc("get_comment_vote_counts", {
    comment_uuid: commentId,
  });

  return {
    data: response.data as CommentVoteCounts | null,
    error: response.error,
  };
}
