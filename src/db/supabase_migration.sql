-- Movie Review v2 - Supabase Database Schema

-- ============================================================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

-- ============================================================================
-- 2. MOVIES TABLE (cached OMDB data)
-- ============================================================================
CREATE TABLE movies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  imdb_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  year TEXT,
  rated TEXT,
  released TEXT,
  runtime TEXT,
  genre TEXT,
  director TEXT,
  writer TEXT,
  actors TEXT,
  plot TEXT,
  language TEXT,
  country TEXT,
  awards TEXT,
  poster_url TEXT,
  metascore TEXT,
  imdb_rating TEXT,
  imdb_votes TEXT,
  type TEXT, -- movie, series, episode
  box_office TEXT,
  production TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 3. REVIEWS TABLE
-- ============================================================================
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE NOT NULL,
  rating NUMERIC(3,1) NOT NULL,
  review_text TEXT,
  is_public BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 10),
  CONSTRAINT one_review_per_user_per_movie UNIQUE(user_id, movie_id)
);

-- ============================================================================
-- 4. COMMENTS TABLE
-- ============================================================================
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT comment_not_empty CHECK (char_length(trim(comment_text)) > 0)
);

-- ============================================================================
-- 5. COMMENT VOTES TABLE
-- ============================================================================
CREATE TABLE comment_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  vote_type SMALLINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT vote_type_valid CHECK (vote_type IN (-1, 1)),
  CONSTRAINT one_vote_per_user_per_comment UNIQUE(comment_id, user_id)
);

-- ============================================================================
-- 6. SAVED MOVIES TABLE (watchlist, favorites, watched)
-- ============================================================================
CREATE TYPE list_type AS ENUM ('watchlist', 'favorites', 'watched');

CREATE TABLE saved_movies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE NOT NULL,
  list_type list_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT unique_user_movie_list UNIQUE(user_id, movie_id, list_type)
);

-- ============================================================================
-- 7. USER FOLLOWS TABLE (follow system)
-- ============================================================================
CREATE TABLE user_follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT no_self_follow CHECK (follower_id != following_id),
  CONSTRAINT unique_follow UNIQUE(follower_id, following_id)
);

-- ============================================================================
-- 8. CUSTOM LISTS TABLE (user-created movie collections)
-- ============================================================================
CREATE TABLE custom_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT list_name_not_empty CHECK (char_length(trim(name)) > 0)
);

-- ============================================================================
-- 9. CUSTOM LIST MOVIES TABLE (many-to-many)
-- ============================================================================
CREATE TABLE custom_list_movies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID REFERENCES custom_lists(id) ON DELETE CASCADE NOT NULL,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT unique_movie_per_list UNIQUE(list_id, movie_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_profiles_username ON profiles(username);

CREATE INDEX idx_movies_imdb_id ON movies(imdb_id);
CREATE INDEX idx_movies_title ON movies(title);

CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_movie_id ON reviews(movie_id);
CREATE INDEX idx_reviews_is_public ON reviews(is_public);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

CREATE INDEX idx_comments_review_id ON comments(review_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

CREATE INDEX idx_comment_votes_comment_id ON comment_votes(comment_id);
CREATE INDEX idx_comment_votes_user_id ON comment_votes(user_id);

CREATE INDEX idx_saved_movies_user_id ON saved_movies(user_id);
CREATE INDEX idx_saved_movies_movie_id ON saved_movies(movie_id);
CREATE INDEX idx_saved_movies_list_type ON saved_movies(list_type);

CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);

CREATE INDEX idx_custom_lists_user_id ON custom_lists(user_id);
CREATE INDEX idx_custom_list_movies_list_id ON custom_list_movies(list_id);
CREATE INDEX idx_custom_list_movies_movie_id ON custom_list_movies(movie_id);

-- ============================================================================
-- TRIGGERS FOR updated_at TIMESTAMPS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movies_updated_at BEFORE UPDATE ON movies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_lists_updated_at BEFORE UPDATE ON custom_lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_list_movies ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- MOVIES POLICIES (readable by everyone, writable by authenticated users)
CREATE POLICY "Movies are viewable by everyone"
  ON movies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert movies"
  ON movies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update movies"
  ON movies FOR UPDATE
  USING (auth.role() = 'authenticated');

-- REVIEWS POLICIES
CREATE POLICY "Public reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- COMMENTS POLICIES
CREATE POLICY "Comments on public reviews are viewable by everyone"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reviews
      WHERE reviews.id = comments.review_id
      AND (reviews.is_public = true OR reviews.user_id = auth.uid())
    )
  );

CREATE POLICY "Authenticated users can insert comments"
  ON comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM reviews
      WHERE reviews.id = review_id
      AND reviews.is_public = true
    )
  );

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- COMMENT VOTES POLICIES
CREATE POLICY "Comment votes are viewable by everyone"
  ON comment_votes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own votes"
  ON comment_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON comment_votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON comment_votes FOR DELETE
  USING (auth.uid() = user_id);

-- SAVED MOVIES POLICIES
CREATE POLICY "Users can view their own saved movies"
  ON saved_movies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved movies"
  ON saved_movies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved movies"
  ON saved_movies FOR DELETE
  USING (auth.uid() = user_id);

-- USER FOLLOWS POLICIES
CREATE POLICY "Follows are viewable by everyone"
  ON user_follows FOR SELECT
  USING (true);

CREATE POLICY "Users can follow others"
  ON user_follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others"
  ON user_follows FOR DELETE
  USING (auth.uid() = follower_id);

-- CUSTOM LISTS POLICIES
CREATE POLICY "Public lists are viewable by everyone, private lists only by owner"
  ON custom_lists FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own lists"
  ON custom_lists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lists"
  ON custom_lists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists"
  ON custom_lists FOR DELETE
  USING (auth.uid() = user_id);

-- CUSTOM LIST MOVIES POLICIES
CREATE POLICY "List movies are viewable if list is viewable"
  ON custom_list_movies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM custom_lists
      WHERE custom_lists.id = list_id
      AND (custom_lists.is_public = true OR custom_lists.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can add movies to their own lists"
  ON custom_list_movies FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM custom_lists
      WHERE custom_lists.id = list_id
      AND custom_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove movies from their own lists"
  ON custom_list_movies FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM custom_lists
      WHERE custom_lists.id = list_id
      AND custom_lists.user_id = auth.uid()
    )
  );

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get comment vote counts
CREATE OR REPLACE FUNCTION get_comment_vote_counts(comment_uuid UUID)
RETURNS TABLE(upvotes BIGINT, downvotes BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE vote_type = 1) AS upvotes,
    COUNT(*) FILTER (WHERE vote_type = -1) AS downvotes
  FROM comment_votes
  WHERE comment_id = comment_uuid;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get user follower/following counts
CREATE OR REPLACE FUNCTION get_user_follow_stats(user_uuid UUID)
RETURNS TABLE(followers_count BIGINT, following_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM user_follows WHERE following_id = user_uuid) AS followers_count,
    (SELECT COUNT(*) FROM user_follows WHERE follower_id = user_uuid) AS following_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to check if user is following another user
CREATE OR REPLACE FUNCTION is_following(follower_uuid UUID, following_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_follows
    WHERE follower_id = follower_uuid
    AND following_id = following_uuid
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get user's review count
CREATE OR REPLACE FUNCTION get_user_review_count(user_uuid UUID)
RETURNS BIGINT AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM reviews
    WHERE user_id = user_uuid
    AND is_public = true
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- TRIGGER TO AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for reviews with user info and comment counts
CREATE OR REPLACE VIEW reviews_with_details AS
SELECT
  r.*,
  p.username,
  p.display_name,
  p.avatar_url,
  m.title AS movie_title,
  m.poster_url AS movie_poster,
  m.year AS movie_year,
  (SELECT COUNT(*) FROM comments WHERE review_id = r.id) AS comment_count
FROM reviews r
JOIN profiles p ON r.user_id = p.id
JOIN movies m ON r.movie_id = m.id;

-- View for comments with user info and vote counts
CREATE OR REPLACE VIEW comments_with_details AS
SELECT
  c.*,
  p.username,
  p.display_name,
  p.avatar_url,
  (SELECT COUNT(*) FROM comment_votes WHERE comment_id = c.id AND vote_type = 1) AS upvotes,
  (SELECT COUNT(*) FROM comment_votes WHERE comment_id = c.id AND vote_type = -1) AS downvotes
FROM comments c
JOIN profiles p ON c.user_id = p.id;