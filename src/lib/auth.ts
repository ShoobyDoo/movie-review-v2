import { supabase } from "./supabase";

/**
 * Sign up a new user with email and password
 * @param email User's email address
 * @param password User's password
 * @param username Desired username
 * @returns Authentication response with user data
 */
export async function signUp(
  email: string,
  password: string,
  username: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: username,
      },
    },
  });

  return { data, error };
}

/**
 * Sign in an existing user with email and password
 * @param email User's email address
 * @param password User's password
 * @returns Authentication response with user data
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

/**
 * Sign out the current user
 * @returns Error if sign out fails
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get the currently authenticated user
 * @returns User object and error if any
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}
