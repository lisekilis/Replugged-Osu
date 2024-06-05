import { Logger } from "replugged";
import { User } from "./types";
const logger = Logger.plugin("Replugged-Osu");

export async function getUser(userName: string): Promise<User | null> {
  try {
    // Replace with the correct "osu!" API endpoint
    const response = await fetch("https://api.obamabot.me/v2/osu/users?user=" + userName);

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
