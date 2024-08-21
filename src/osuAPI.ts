import { Logger } from "replugged";
import { GetUserResult, User } from "./types";
const logger = Logger.plugin("Replugged-Osu");
export async function getUser(userName: string, mode?: string): Promise<GetUserResult> {
  try {
    // Replace with the correct "osu!" API endpoint later
    const response = mode
      ? await fetch(`https://api.obamabot.me/v2/osu/users?user=${userName}&mode=${mode}`)
      : await fetch(`https://api.obamabot.me/v2/osu/users?user=${userName}`);

    const { status } = response;
    if (!response.ok && status !== 404) {
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }

    const user = (await response.json()) as User;
    return {
      user,
      status,
    };
  } catch (error) {
    logger.error("Error fetching user data:", error);
    return {
      user: null,
      status: 500,
    };
  }
}
