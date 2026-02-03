import { supabase } from "./supabase";
import type { Comment, CommentCallback, VoteCallback } from "./types";
import type { RealtimeChannel } from "@supabase/supabase-js";

/**
 * Subscribe to new comments on a review in real-time
 * @param reviewId Review's unique identifier
 * @param callback Function to call when a new comment is inserted
 * @returns Realtime channel subscription
 */
export function subscribeToReviewComments(
  reviewId: string,
  callback: CommentCallback,
): RealtimeChannel {
  const channel = supabase
    .channel(`review:${reviewId}:comments`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "comments",
        filter: `review_id=eq.${reviewId}`,
      },
      (payload) => {
        callback(payload.new as Comment);
      },
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to vote changes on a comment in real-time
 * @param commentId Comment's unique identifier
 * @param callback Function to call when votes are added, updated, or removed
 * @returns Realtime channel subscription
 */
export function subscribeToCommentVotes(
  commentId: string,
  callback: VoteCallback,
): RealtimeChannel {
  const channel = supabase
    .channel(`comment:${commentId}:votes`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "comment_votes",
        filter: `comment_id=eq.${commentId}`,
      },
      (payload) => {
        callback(payload);
      },
    )
    .subscribe();

  return channel;
}

/**
 * Unsubscribe from a realtime channel
 * @param channel Realtime channel to unsubscribe from
 */
export function unsubscribe(channel: RealtimeChannel): void {
  void supabase.removeChannel(channel);
}
