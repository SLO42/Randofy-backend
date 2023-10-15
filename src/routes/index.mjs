import { LANDING } from "./landing-route.mjs";
import { LOGIN } from "./login-route.mjs";
import { RANDOM } from "./randomSong-route.mjs";
import { MARKDOWN } from "./markdown-route.mjs";
import { TOKEN } from "./token-route.mjs";

// const ROUTES = {
//   "/": "Home Page",
//   "/login": "login route using Spotify 20Auth",
//   "/random": "generates random song",
//   "/markdown": "generates markdown compliant svg of random song",
//   "/svg-s": "generates small svg of a random song",
//   "/svg-m": "generates medium svg of a random song",
//   "/svg-l": "generates large svg of a random song",
// };

export const currentRoutes = {
  LANDING: ["/", "Home Page"],
  LOGIN: ["/login", "login route using Spotify 2OAuth"],
  RANDOM: ["/random", "generates random song"],
  MARKDOWN: ["/markdown", "generates markdown compliant svg of random song"],
  TOKEN: ["/token", "generates token for Spotify 2OAuth"],
};

export default {
  LANDING,
  RANDOM,
  MARKDOWN,
  TOKEN,
  LOGIN,
};
