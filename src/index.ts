import { Injector, Logger, types } from "replugged";
import * as osuAPI from "./osuAPI";

const inject = new Injector();
const logger = Logger.plugin("Replugged-Osu");
const { ApplicationCommandOptionType } = types;

export async function start(): Promise<void> {
  inject.utils.registerSlashCommand({
    name: "OsuUser",
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
        const user = await osuAPI.getUser(userName);
        if (send)
          return {
            send: true,
            result: `## [${user?.username}](https://osu.ppy.sh/users/${user?.id})
            PP: ${user?.statistics.pp}
            Score: ${user?.statistics.ranked_score}`,
          };
        else
          return {
            send: false,
            embeds: [
              {
                color: 0xe089b6,
                title: `${user?.username}`,
                url: `https://osu.ppy.sh/users/${user?.id}`,
                description: `PP: ${user?.statistics.pp}
              Score: ${user?.statistics.ranked_score}`,
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
