import { supabase } from "./supabase";
import type {
  UserFollow,
  FollowerWithProfile,
  FollowingWithProfile,
  DbResponse,
  DbErrorResponse,
} from "./types";

/**
 * Follow a user
 * @param followingId ID of the user to follow
 * @returns Created follow relationship
 */
export async function followUser(
  followingId: string,
): Promise<DbResponse<UserFollow>> {
  const response = await supabase
    .from("user_follows")
    .insert({
      following_id: followingId,
    })
    .select()
    .single();

  return { data: response.data as UserFollow | null, error: response.error };
}

/**
 * Unfollow a user
 * @param followingId ID of the user to unfollow
 * @returns Error if unfollowing fails
 */
export async function unfollowUser(
  followingId: string,
): Promise<DbErrorResponse> {
  const { error } = await supabase
    .from("user_follows")
    .delete()
    .eq("following_id", followingId);

  return { error };
}

/**
 * Get all followers of a user
 * @param userId User's unique identifier
 * @returns Array of follower profiles
 */
export async function getFollowers(
  userId: string,
): Promise<DbResponse<FollowerWithProfile[]>> {
  const { data, error } = await supabase
    .from("user_follows")
    .select(
      `
      follower:profiles!follower_id(*)
    `,
    )
    .eq("following_id", userId);

  return { data: data as FollowerWithProfile[] | null, error };
}

/**
 * Get all users that a user is following
 * @param userId User's unique identifier
 * @returns Array of followed user profiles
 */
export async function getFollowing(
  userId: string,
): Promise<DbResponse<FollowingWithProfile[]>> {
  const { data, error } = await supabase
    .from("user_follows")
    .select(
      `
      following:profiles!following_id(*)
    `,
    )
    .eq("follower_id", userId);

  return { data: data as FollowingWithProfile[] | null, error };
}

/**
 * Check if a user is following another user
 * @param followerId ID of the potential follower
 * @param followingId ID of the user being followed
 * @returns Boolean indicating follow status
 */
export async function isFollowing(
  followerId: string,
  followingId: string,
): Promise<boolean> {
  const response = await supabase.rpc("is_following", {
    follower_uuid: followerId,
    following_uuid: followingId,
  });

  return response.data as boolean;
}
