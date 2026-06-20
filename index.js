require("dotenv").config();

const { App } = require("@slack/bolt");
const axios = require("axios");
const https = require("https");
const http = require("http");
const httpsAgent = new https.Agent({ keepAlive: false });
const httpAgent = new http.Agent({ keepAlive: false });
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const APOD_CACHE = path.join(__dirname, "cache", "apod.json");

async function updateAPODCache() {
  try {
    console.log("Updating NASA APOD Cache...");

    const { data } = await axios.get(
      "https://api.nasa.gov/planetary/apod",
      {
        params: {
          api_key: process.env.NASA_API_KEY
        },
        timeout: 10000,
        httpsAgent
      }
    );

    if (!fs.existsSync(path.dirname(APOD_CACHE))) {
      fs.mkdirSync(path.dirname(APOD_CACHE), { recursive: true });
    }

    fs.writeFileSync(
      APOD_CACHE,
      JSON.stringify(data, null, 2)
    );

    console.log("NASA APOD cache updated.");
  } catch (err) {
    console.error("NASA Cache Update Failed:", err.message);
  }
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/csb-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/csb-catfact", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/csb-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
        `${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

app.command("/csb-apod", async ({ ack, respond }) => {
  await ack();
  try {
    if (!fs.existsSync(APOD_CACHE)) {
      await updateAPODCache();
    }
    const apod = JSON.parse(
      fs.readFileSync(APOD_CACHE)
    );
    if (apod.media_type === "image") {
      await respond({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
`*🌌 NASA Astronomy Picture of the Day*
*${apod.title}*

${apod.explanation}`
            }
          },
          {
            type: "image",
            image_url: apod.hdurl || apod.url,
            alt_text: apod.title
          }
        ]
      });
    } else {
      await respond({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
`*🎥 NASA APOD*
*${apod.title}*
${apod.explanation}
${apod.url}`
            }
          }
        ]
      });
    }
  } catch (err) {
    console.error(err);
    await respond({
      text: "❌ Unable to load cached NASA APOD."
    });
  }
});

app.command("/csb-orbit", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get('http://api.open-notify.org/astros.json', { timeout: 8000, httpAgent });
    const totalHumans = response.data.number;
    const peopleInSpace = response.data.people;
    const astronautList = peopleInSpace.map(person => {
      return `🚀 *${person.name}* aboard the *${person.craft}*`;
    }).join('\n');

    const astronautText = (astronautList || "Wait, according to the tracking radar, nobody is up there right now... that's weird.").slice(0, 2900);

    await respond({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `👨‍🚀👩‍🚀 *Live Orbit Report*\n\nThere are currently *${totalHumans}* human beings orbiting Earth right now!`
          }
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: astronautText
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `📊 Data pulled live from Open-Notify | Current Time: ${new Date().toUTCString()}`
            }
          ]
        }
      ]
    });

  } catch (error) {
    console.error("Error fetching space orbit data:", error);
    await respond({
      text: "❌ The space radar communication link is down. I couldn't scan Earth's orbit. Try again in a bit!"
    });
  }
});

app.command("/csb-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
      `Available Commands:
/csb-ping - Check bot latency
/csb-catfact - Get a cat fact
/csb-joke - Tell u a Joke!
/csb-apod - Gives NASA Astronomy Picture of the Day
/csb-orbit - See how many humans are currently orbiting Earth
/csb-help - Show this help message
*Cosmo Slack Bot* | Developed by Veda`
  });
});

(async () => {
  await updateAPODCache();
  cron.schedule("0 */12 * * *", async () => {
    await updateAPODCache();
  });
  await app.start();
  console.log("Bot is running!");
})();