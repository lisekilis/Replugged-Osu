import { Injector, Logger, types, common } from "replugged";
import * as osuAPI from "./osuAPI";

const inject = new Injector();
const logger = Logger.plugin("Replugged-Osu");
const { ApplicationCommandOptionType } = types;

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
        name: "Send",
        description: "Do you want the result to be sent?",
        type: ApplicationCommandOptionType.Boolean,
        required: false,
      },
    ],
    executor: async (interaction) => {
      const userName = interaction.getValue("User");
      const send = interaction.getValue("Send");

      try {
        logger.log();
        const osuUser = await osuAPI.getUser(userName);
        const status = osuUser?.is_online
          ? `🟢 Currently online `
          : `⚫ Last Seen <t:${new Date(osuUser?.last_visit).valueOf()}:R>`;
        const discordUser = osuUser?.discord
          ? common.users.findByTag(osuUser.discord.split("#")[0])
          : null;
        if (send)
          return {
            send: true,
            result: `## [${osuUser?.username}](https://osu.ppy.sh/users/${osuUser?.id})
            ### PP: ${osuUser?.statistics.pp}
            ### Score: ${osuUser?.statistics.ranked_score}`,
          };
        else
          return {
            send: false,
            embeds: [
              {
                color: 0xff79b8,
                author: discordUser
                  ? {
                      name: discordUser.username,
                      // eslint-disable-next-line @typescript-eslint/naming-convention
                      proxy_icon_url: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
                      url: `${window.location.origin}users/${discordUser.id}`,
                    }
                  : null,
                title: osuUser?.username,
                thumbnail: {
                  url: osuUser?.avatar_url, //doesn't work for some reason
                  width: 50,
                  height: 50,
                },
                url: `https://osu.ppy.sh/users/${osuUser?.id}`,
                description: `PP: ${osuUser?.statistics.pp}
                Score: ${osuUser?.statistics.ranked_score}
                `,
                timestamp: osuUser?.is_online ? null : new Date(osuUser.last_visit).valueOf(),
                footer: {
                  text: osuUser?.is_online ? "Online" : "Last Seen", //TODO: add status icons
                },
              },
            ],
          };
      } catch (error) {
        logger.error("Error fetching user:", error);
        return {
          send: false,
          result: "Encoutered an error while fetching user!",
        };
      }
    },
  });
}

export function stop(): void {
  inject.uninjectAll();
}
