/* eslint-disable @typescript-eslint/naming-convention */
export interface GetUserResult {
  user: User | null;
  status: number;
}
export interface User {
  avatar_url: string;
  country_code: string;
  default_group: string;
  id: number;
  is_active: boolean;
  is_bot: boolean;
  is_deleted: boolean;
  is_online: boolean;
  is_supporter: boolean;
  last_visit: string;
  pm_friends_only: boolean;
  profile_colour: string;
  username: string;
  cover_url: string;
  discord: string;
  has_supported: boolean;
  interests: string;
  join_date: string;
  kudosu: {
    total: number;
    available: number;
  };
  location: string;
  max_blocks: number;
  max_friends: number;
  occupation: string;
  playmode: string;
  playstyle: string;
  post_count: number;
  profile_hue: number;
  profile_order: string[];
  title: string?;
  title_url: string;
  twitter: string;
  website: string;
  country: {
    code: string;
    name: string;
  };
  cover: {
    custom_url: string;
    url: string;
    id: number;
  };
  account_history: [];
  active_tournament_banner: string;
  badges: Array<{
    awarded_at: string;
    description: string;
    image_url: string;
    url: string;
  }>;
  beatmap_playcounts_count: number;
  comments_count: number;
  favourite_beatmapset_count: number;
  follower_count: number;
  graveyard_beatmapset_count: number;
  groups: {
    colour: string;
    has_listing: boolean;
    has_playmodes: boolean;
    id: number;
    identifier: string;
    is_probationary: boolean;
    name: string;
    short_name: string;
    playmodes: string[];
  };
  guest_beatmapset_count: number;
  loved_beatmapset_count: number;
  mapping_follower_count: number;
  monthly_playcounts: Array<{
    start_date: string;
    count: number;
  }>;
  nominated_beatmapset_count: number;
  page: {
    html: string;
    raw: string;
  };
  pending_beatmapset_count: number;
  previous_usernames: string[];
  rank_highest: {
    rank: number;
    updated_at: string;
  };
  ranked_beatmapset_count: number;
  replays_watched_counts: Array<{
    start_date: string;
    count: number;
  }>;
  scores_best_count: number;
  scores_first_count: number;
  scores_pinned_count: number;
  scores_recent_count: number;
  statistics: {
    count_100: number;
    count_300: number;
    count_50: number;
    count_miss: number;
    level: {
      current: number;
      progress: number;
    };
    global_rank: number;
    global_rank_exp: number;
    pp: number;
    pp_exp: number;
    ranked_score: number;
    hit_accuracy: number;
    play_count: number;
    play_time: number;
    total_score: number;
    total_hits: number;
    maximum_combo: number;
    replays_watched_by_others: number;
    is_ranked: boolean;
    grade_counts: {
      ss: number;
      ssh: number;
      s: number;
      sh: number;
      a: number;
    };
    country_rank: number;
    rank: {
      country: number;
    };
  };
  support_level: number;
  user_achievements: Array<{
    achieved_at: string;
    achievement_id: number;
  }>;
  rank_history: {
    mode: string;
    data: number[];
  };
  rankHistory: {
    mode: string;
    data: number[];
  };
  ranked_and_approved_beatmapset_count: number;
  unranked_beatmapset_count: number;
}
