# Cosmo Slack Bot

Cosmo is a small Slack bot that I created with js and the Slack Bolt SDK. I was looking for a method to share awesome space-related photos, quick facts, and even some silly jokes inside my Slack team through custom slash commands. It's always on and hosted by Nest so that it never loses connection!

--- 

## How I Made It & What I Learned
- Getting data from external APIs might seem as a straightforward task until you actually try to do it. The biggest challenge for me was the NASA Astronomy Picture of the Day (/csb-apod) command. I was constantly hitting API errors whenever I tried to get their response. It took me quite some time to figure out how to manually navigate their messy JSON structure, extract the specific image URL, title, and description, and finally give them into my JavaScript file and sent them as beautiful response.
- It was hard for me that if a bunch of people use the NASA command, the reply takes ages to come up or it ends up giving a failure error. To solve this out, I forced a wait/timeout of 10 secs manually in the script, so that the payload can load properly before it send it to the channel.
- Making the media inside a Slack channel looking neat is not even an easy task. I had to go through lot of trial and error before I found out how to compose a beautiful media card layout with Slack's Block Kit layout builder (it was such a big win to see that Pluto image at last come up perfectly! ).

## Commands

| Command | Description |
|---|---|
| `/csb-ping` | Just a simple latency check to make sure the bot is responsive and hasn't crashed. |
| `/csb-catfact` | Instantly fetches a random cat fact because every Slack workspace needs animal trivia. |
| `/csb-joke` | Instantly drops a funny joke right into the channel to brighten up the workspace. |
| `/csb-apod` | Pings NASA's open API to pull the Astronomy Picture of the Day along with its official description. |
| `/csb-help` | List all available commands and helps you when you forget a command |
| `/csb-orbit` | Gives the name of the person's orbiting around the Earth. |

## 📸 Screenshots

<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/dafc336e-d520-4f49-a30d-5bdaf7c87a33" width="400" alt="Bot command embed" /></td>
    <td><img src="https://github.com/user-attachments/assets/1c023005-911a-4278-b5da-5617421705b3" width="400" alt="Bot response" /></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/83827a72-2645-4062-99f9-0a30dd4bfc15" width="400" alt="Command list" /></td>
    <td><img src="https://github.com/user-attachments/assets/9d57b080-ef82-4f9d-939f-2a4d9d9a29c4" width="400" alt="Ping and cat fact" /></td>
  </tr>
</table>

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


## 🔌 External APIs Used

| API | Endpoint | Docs |
|---|---|---|
| Cat Facts | `https://catfact.ninja/fact` | [catfact.ninja](https://catfact.ninja/) |
| Official Joke API | `https://official-joke-api.appspot.com/random_joke` | [GitHub](https://github.com/15Dkatz/official_joke_api) |
| NASA APOD | `https://api.nasa.gov/planetary/apod` | [api.nasa.gov](https://api.nasa.gov/) |



## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `SLACK_BOT_TOKEN` | Bot User OAuth Token (starts with `xoxb-`) |
| `SLACK_APP_TOKEN` | App-Level Token for Socket Mode (starts with `xapp-`) |
| `NASA_API_KEY` | NASA Open APIs key ([get one free](https://api.nasa.gov/)) |

