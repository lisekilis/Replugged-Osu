import { Injector, Logger, common, types } from "replugged";
import * as osuAPI from "./osuAPI";
import { getRegionalFlag, modeNameFormatter } from "./functions";

const inject = new Injector();
const logger = Logger.plugin("Replugged-Osu");
const { ApplicationCommandOptionType } = types;

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
      const mode = modeNameFormatter(interaction.getValue("Mode"));
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
                  name: `${modeNameFormatter(mode, true, osuUser.playmode)}`,
                  inline: false,
                },
                {
                  name: "PP",
                  value: `${osuUser.statistics.pp}`,
                  inline: true,
                },
                {
                  name: `Ranking🗺️ [⛰️] (${getRegionalFlag(osuUser.country.code)})`,
                  value: `#${osuUser.statistics.global_rank} [#${osuUser.rank_highest.rank}] (#${osuUser.statistics.country_rank}) `,
                  inline: true,
                },
              ],
              timestamp: osuUser.is_online ? undefined : osuUser.last_visit,
              footer: {
                text: osuUser.is_online ? "Online" : "Last Seen", //TODO: add status icons
                // eslint-disable-next-line @typescript-eslint/naming-convention
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
