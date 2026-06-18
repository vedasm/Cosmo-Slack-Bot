require("dotenv").config();

const { App } = require("@slack/bolt");
const axios = require("axios");

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
    const { data: apod } = await axios.get(
      "https://api.nasa.gov/planetary/apod",
      {
        params: {
          api_key: process.env.NASA_API_KEY
        },
        timeout: 10000
      }
    );

    if (apod.media_type === "image") {
      await respond({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*🌌 NASA Astronomy Picture of the Day*\n*${apod.title}*\n\n${apod.explanation}`
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
              text: `*🎥 NASA APOD*\n*${apod.title}*\n${apod.explanation}\n\n${apod.url}`
            }
          }
        ]
      });
    }
  } catch (error) {
    console.error(
      "NASA APOD Error:",
      error.response?.data || error.message
    );

    await respond({
      text: "❌ Failed to fetch NASA Astronomy Picture of the Day."
    });
  }
});

app.command("/csb-iss", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get('http://api.open-notify.org/iss-now.json');
    const { latitude, longitude } = response.data.iss_position;
    const timestamp = new Date(response.data.timestamp * 1000).toUTCString();

    // OpenStreetMap-based static map, no API key required
    const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=3&size=600x450&markers=${latitude},${longitude},red-pushpin`;

    await respond({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `🛰️ *International Space Station Locator*\n\nThe ISS is currently flying over Earth at these exact coordinates!`
          }
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `🌐 *Latitude:* \`${latitude}\`` },
            { type: "mrkdwn", text: `🌐 *Longitude:* \`${longitude}\`` }
          ]
        },
        {
          type: "image",
          title: {
            type: "plain_text",
            text: `Satellite view pinned at ${timestamp}`
          },
          image_url: mapUrl,
          alt_text: "Map showing the current location of the ISS"
        }
      ]
    });

  } catch (error) {
    console.error("Error fetching ISS tracking data:", error);
    await respond({
      text: "❌ Houston, we have a problem. I couldn't connect to the ISS tracking radar right now. Try again in a second!"
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
/csb-apod - Gives NASA Astronomy Picture of the Day`
  });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();