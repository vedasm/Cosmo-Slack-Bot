# 🤖 Cosmo Slack Bot

A fun, lightweight Slack bot built with the [Slack Bolt SDK](https://slack.dev/bolt-js/) for Node.js. Cosmo brings cat facts, jokes, NASA's Astronomy Picture of the Day, and more right into your Slack workspace via slash commands.

---

## ✨ Features

| Command | Description |
|---|---|
| `/csb-ping` | Check bot latency (Pong!) |
| `/csb-catfact` | Get a random cat fact 🐱 |
| `/csb-joke` | Hear a random joke 😄 |
| `/csb-apod` | NASA Astronomy Picture of the Day 🌌 |
| `/csb-help` | List all available commands |

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (≥ 18)
- **Framework**: [@slack/bolt](https://www.npmjs.com/package/@slack/bolt) v4
- **HTTP Client**: [axios](https://www.npmjs.com/package/axios)
- **Config**: [dotenv](https://www.npmjs.com/package/dotenv)
- **Connection**: Socket Mode (no public URL needed)

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- A Slack workspace where you can install apps
- A [NASA API key](https://api.nasa.gov/) (free)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/cosmo-slack-bot.git
cd cosmo-slack-bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and create a new app **From scratch**.
2. Under **OAuth & Permissions**, add the following **Bot Token Scopes**:
   - `commands`
   - `chat:write`
3. Under **Socket Mode**, enable it and generate an **App-Level Token** with the `connections:write` scope.
4. Under **Slash Commands**, create each command:
   - `/csb-ping`
   - `/csb-catfact`
   - `/csb-joke`
   - `/csb-apod`
   - `/csb-help`
5. Install the app to your workspace and copy the **Bot User OAuth Token**.

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-level-token
NASA_API_KEY=your-nasa-api-key
```

> **Tip:** You can use `DEMO_KEY` as your NASA API key for testing (rate-limited to 30 requests/hour).

### 5. Run the bot

```bash
node index.js
```

You should see:

```
bot is running!
```

---

## 📁 Project Structure

```
cosmo-slack-bot/
├── index.js        # Main bot logic and command handlers
├── package.json
├── .env            # Environment variables (not committed)
└── .gitignore
```

---

## 🔌 External APIs Used

| API | Endpoint | Docs |
|---|---|---|
| Cat Facts | `https://catfact.ninja/fact` | [catfact.ninja](https://catfact.ninja/) |
| Official Joke API | `https://official-joke-api.appspot.com/random_joke` | [GitHub](https://github.com/15Dkatz/official_joke_api) |
| NASA APOD | `https://api.nasa.gov/planetary/apod` | [api.nasa.gov](https://api.nasa.gov/) |

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `SLACK_BOT_TOKEN` | Bot User OAuth Token (starts with `xoxb-`) |
| `SLACK_APP_TOKEN` | App-Level Token for Socket Mode (starts with `xapp-`) |
| `NASA_API_KEY` | NASA Open APIs key ([get one free](https://api.nasa.gov/)) |

---

## 📜 License

ISC