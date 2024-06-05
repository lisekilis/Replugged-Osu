import { Logger } from "replugged";
const logger = Logger.plugin("Replugged-Osu");
interface User {
  custom: {
    hit_accuracy: string;
    time_played: string;
    total_score: string;
    playcount: string;
    pp_rank: string;
    pp_country_rank: string;
    pp_raw: string;
    user_profile: string;
    playstyles: string;
    format_join_date: string;
    format_last_visit: string;
    country_code: string;
  };
  recent_activity: unknown[];
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
  profile_colour: string | null;
  username: string;
  cover_url: string;
  discord: string;
  has_supported: boolean;
  interests: string | null;
  join_date: string;
  location: string;
  max_blocks: number;
  max_friends: number;
  occupation: string | null;
  playmode: string;
  playstyle: string[];
  post_count: number;
  profile_order: string[];
  title: string | null;
  title_url: string | null;
  twitter: string | null;
  website: string | null;
  country: {
    code: string;
    name: string;
  };
  cover: {
    custom_url: string | null;
    url: string;
    id: string;
  };
  kudosu: {
    available: number;
    total: number;
  };
  account_history: unknown[];
  active_tournament_banner: unknown | null;
  active_tournament_banners: unknown[];
  badges: unknown[];
  beatmap_playcounts_count: number;
  comments_count: number;
  favourite_beatmapset_count: number;
  follower_count: number;
  graveyard_beatmapset_count: number;
  groups: unknown[];
  guest_beatmapset_count: number;
  loved_beatmapset_count: number;
  mapping_follower_count: number;
  monthly_playcounts: {
    start_date: string;
    count: number;
  }[];
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
  replays_watched_counts: {
    start_date: string;
    count: number;
  }[];
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
  user_achievements: {
    achieved_at: string;
    achievement_id: number;
  }[];
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

export async function getUser(userName: string): Promise<User | null> {
  try {
    // Replace with the correct "osu!" API endpoint
    const response = await fetch("https://osu.ppy.sh/api/v2/users?user=" + userName);

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }

    const userData = (await response.json()) as User;
    return userData;
  } catch (error) {
    logger.error("Error fetching user data:", error);
    return null; // Or handle the error differently
  }
}
