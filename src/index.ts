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
        const user = await osuAPI.getUser(userName);
        const status = user?.is_online
          ? `Currently online 🟢`
          : `Last Seen <t:${new Date(user?.last_visit).valueOf()}:R>`;
        const discord = user?.discord ? common.users.findByTag(user.discord.split("#")[0]) : null;
        if (send)
          return {
            send: true,
            result: `## [${user?.username}](https://osu.ppy.sh/users/${user?.id})
            ### PP: ${user?.statistics.pp}
            ### Score: ${user?.statistics.ranked_score}`,
          };
        else
          return {
            send: false,
            embeds: [
              {
                color: 0xe089b6,
                author: discord
                  ? {
                      name: discord.username,
                      // eslint-disable-next-line @typescript-eslint/naming-convention
                      proxy_icon_url: `https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}.png`,
                      url: `${common.api.getAPIBaseURL().split("api")[0]}users/${discord.id}`,
                    }
                  : null,
                title: user?.username,
                thumbnail: {
                  url: user?.avatar_url, //doesn't work for some reason
                },
                url: `https://osu.ppy.sh/users/${user?.id}`,
                description: `${status}
                PP: ${user?.statistics.pp}
              Score: ${user?.statistics.ranked_score}
              `,
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
