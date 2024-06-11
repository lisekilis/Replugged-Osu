export function modeNameFormatter(
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
      return fallback ? modeNameFormatter(fallback, displayName) : undefined;
  }
  return Mode;
}
export function getRegionalFlag(input: string): string {
  return Array.from(input.toUpperCase())
    .map((char) => {
      const codePoint = char.charCodeAt(0);
      if (codePoint >= 65 && codePoint <= 90) {
        return String.fromCodePoint(0x1f1e6 + (codePoint - 65));
      } else {
        return char;
      }
    })
    .join("");
}
