import { Injector, Logger, types, common } from "replugged";
import * as osuAPI from "./osuAPI";

const inject = new Injector();
const logger = Logger.plugin("Replugged-Osu");
const { ApplicationCommandOptionType } = types;
function modeNamificator(
  mode?: string,
  displayName?: boolean,
  fallback?: string,
): string | undefined {
  // eslint-disable-next-line no-undefined
  let Mode: string | undefined = mode ? mode.toLowerCase() : undefined;
  switch (Mode) {
    case "ctb":
    case "catch":
    case "fruits":
    case "osu!catch":
      Mode = displayName ? "osu!catch" : "fruits";
      break;
    case "mania":
    case "osu!mania":
      Mode = displayName ? "osu!mania" : "mania";
      break;
    case "drums":
    case "taiko":
    case "osu!taiko":
      Mode = displayName ? "osu!taiko" : "taiko";
      break;
    case "osu":
    case "osu!":
    case "standard":
    case "osu!standard":
      Mode = displayName ? "osu!" : "osu";
      break;
    default:
      // eslint-disable-next-line no-undefined
      return fallback ? modeNamificator(fallback, displayName) : undefined;
  }
  return Mode;
}
function toRegionalIndicatorSymbols(input: string): string {
  // Unicode code point for 'A'
  const baseCodePoint = "A".charCodeAt(0);
  // Unicode code point for Regional Indicator Symbol Letter A
  const regionalIndicatorBase = 0x1f1e6;

  return Array.from(input.toUpperCase())
    .map((char) => {
      const codePoint = char.charCodeAt(0);
      if (codePoint >= baseCodePoint && codePoint <= baseCodePoint + 25) {
        return String.fromCodePoint(regionalIndicatorBase + (codePoint - baseCodePoint));
      } else {
        // Return the character as is if it's not a letter from A-Z
        return char;
      }
    })
    .join("");
}
// eslint-disable-next-line @typescript-eslint/require-await
export async function start(): Promise<void> {
  inject.utils.registerSlashCommand({
    name: "osuUser",
    description: "allows you to look up an Osu! user",
    options: [
      {
        name: "User",
        description: "Username of the user you want to lookup",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "Mode",
        description: "Which mode do you want to check?",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
    executor: async (interaction) => {
      const userName = interaction.getValue("User");
      const mode = modeNamificator(interaction.getValue("Mode"));
      let osuUser;
      try {
        osuUser = await osuAPI.getUser(userName, mode);
      } catch (error) {
        logger.error("Error fetching user:", error);
        return {
          send: false,
          result: "Encoutered an error while fetching user!",
        };
      }
      const discordUser = osuUser?.discord
        ? common.users.findByTag(osuUser.discord.split("#")[0])
        : null;

      if (!osuUser)
        return {
          send: false,
          result: `User **${userName}** not found!`,
        };
      else {
        return {
          send: false,
          result: null,
          embeds: [
            {
              color: osuUser.profile_colour
                ? `0x${osuUser.profile_colour.split("#")[1]}`
                : `0xff79b8`,
              author: discordUser
                ? {
                    name: discordUser.username,
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    proxy_icon_url: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
                    url: `${window.location.origin}/users/${discordUser.id}`,
                  }
                : undefined,
              title: osuUser.username,
              thumbnail: {
                url: osuUser.avatar_url, //doesn't work for some reason
                width: 50,
                height: 50,
              },
              url: `https://osu.ppy.sh/users/${osuUser.id}`,
              //description: `${modeNamificator(mode, true, osuUser.playmode)}`,
              fields: [
                {
                  name: `${modeNamificator(mode, true, osuUser.playmode)}`,
                  inline: false,
                },
                {
                  name: "PP",
                  value: `${osuUser.statistics.pp}`,
                  inline: true,
                },
                {
                  name: `Ranking🗺️ [⛰️] (${toRegionalIndicatorSymbols(osuUser.country.code)})`,
                  value: `#${osuUser.statistics.global_rank} [#${osuUser.rank_highest.rank}] (#${osuUser.statistics.country_rank}) `,
                  inline: true,
                },
              ],
              timestamp: osuUser.is_online ? undefined : osuUser.last_visit,
              footer: {
                text: osuUser.is_online ? "Online" : "Last Seen", //TODO: add status icons
                icon_url: osuUser.is_online
                  ? "https://raw.githubusercontent.com/lisekilis/Replugged-Osu/main/assets/user-status-icon-online.png"
                  : "https://raw.githubusercontent.com/lisekilis/Replugged-Osu/main/assets/user-status-icon-offline.png",
              },
              type: "rich",
            },
          ],
        };
      }
    },
  });
}

export function stop(): void {
  inject.uninjectAll();
}
