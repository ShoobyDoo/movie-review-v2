import { supabase } from "./supabase";
import type { Profile, ProfileUpdate, DbResponse } from "./types";

/**
 * Get a user's profile by user ID
 * @param userId User's unique identifier
 * @returns User profile data
 */
export async function getProfile(userId: string): Promise<DbResponse<Profile>> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return { data, error };
}

/**
 * Update a user's profile
 * @param userId User's unique identifier
 * @param updates Partial profile updates
 * @returns Updated profile data
 */
export async function updateProfile(
  userId: string,
  updates: ProfileUpdate,
): Promise<DbResponse<Profile>> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  return { data, error };
}
