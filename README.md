# 🤖 Keppo - Discord Event Bot

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Discord.js-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord.js" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
</p>

<p align="center">
  A powerful Discord bot for managing recurring and one-time events with automated notifications.
</p>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#-usage)
  - [Commands](#commands)
  - [Event Types](#event-types)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [License](#-license)

---

## 🎯 About

**Keppo** is a Discord bot built with NestJS that helps communities manage events efficiently. Whether you need to schedule one-time announcements or set up recurring reminders, Keppo handles it all with an intuitive slash command interface.

### Why Keppo?

- 📅 **Flexible Scheduling**: Support for one-time events, daily, weekly, and custom cron-based schedules
- 🎨 **Modern UI**: Interactive modals and select menus for a seamless user experience
- ⚡ **Real-time Notifications**: Automated event notifications sent directly to configured Discord channels
- 🏗️ **Enterprise-grade Architecture**: Built with NestJS best practices, dependency injection, and modular design

---

## ✨ Features

### 🔑 User Management
- **Registration**: Create an account with email and password
- **Login**: Link your Discord account to your user profile
- **Secure Authentication**: Passwords hashed with bcrypt

### 📆 Event Management
- **One-Time Events**: Schedule events for a specific date and time
- **Daily Events**: Set up events that repeat every day at a specific time
- **Weekly Events**: Configure events for specific days of the week
- **Custom Recurring Events**: Advanced scheduling with cron expressions

### 🔔 Notifications
- **Channel Configuration**: Set default notification channels per Discord server
- **Event-Specific Channels**: Override default channel for individual events
- **Automated Delivery**: Events are automatically triggered and notifications sent on schedule

### 🎨 User Experience
- **Slash Commands**: Modern Discord slash command interface
- **Interactive Modals**: User-friendly forms for data input
- **Select Menus**: Easy event type and frequency selection
- **Event Listing**: View all your scheduled events
- **Event Deletion**: Remove events with a simple select menu

---

## 🛠️ Tech Stack

### Core Framework
- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Discord Integration
- **[Discord.js v14](https://discord.js.org/)** - Powerful Discord API library
- **Slash Commands** - Modern Discord command interface
- **Modals & Select Menus** - Interactive UI components

### Database & ORM
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[SQLite](https://www.sqlite.org/)** - Lightweight database (development)
- **PostgreSQL-ready** - Easy migration for production

### Scheduling & Utilities
- **[@nestjs/schedule](https://docs.nestjs.com/techniques/task-scheduling)** - Cron job management
- **[cron-parser](https://www.npmjs.com/package/cron-parser)** - Cron expression parsing
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**
- **Discord Bot Token** ([Create one here](https://discord.com/developers/applications))

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:barretoga/keppo.git
   cd keppo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

### Configuration

1. **Create environment file**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**
   
   Open `.env` and fill in your credentials:

   ```env
   # Application
   PORT=3000

   # Database
   DATABASE_URL="file:./prisma/dev.db"

   # Discord Bot
   DISCORD_TOKEN=your_discord_bot_token_here
   DISCORD_CLIENT_ID=your_discord_client_id_here
   DISCORD_CHANNEL_ID=your_default_channel_id_here  # Optional
   ```

   **How to get Discord credentials:**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application or select an existing one
   - **Bot Token**: Navigate to `Bot` → Click `Reset Token`
   - **Client ID**: Navigate to `General Information` → Copy `Application ID`
   - **Channel ID**: Enable Developer Mode in Discord → Right-click a channel → `Copy ID`

3. **Invite the bot to your server**
   
   Use this URL (replace `YOUR_CLIENT_ID`):
   ```
   https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2048&scope=bot%20applications.commands
   ```

---

## 💻 Usage

### Starting the Bot

```bash
# Development mode (with hot-reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### Commands

#### 🔐 Authentication

| Command | Description |
|---------|-------------|
| `/register` | Create a new account with email and password |
| `/login` | Link your Discord account to your user profile |

#### ⚙️ Configuration

| Command | Description |
|---------|-------------|
| `/setup` | Set the current channel as default for event notifications |

#### 📅 Event Management

| Command | Subcommand | Description |
|---------|------------|-------------|
| `/event` | `create` | Create a new event (one-time or recurring) |
| `/event` | `list` | View all your scheduled events |
| `/event` | `delete` | Delete an existing event |

### Event Types

#### 1️⃣ One-Time Event
Schedule an event for a specific date and time.

**Example:**
- Title: "Project Deadline"
- Date: `2025-12-31 23:59`
- Description: "Final submission for Q4 project"

#### 🔁 Daily Event
Repeats every day at a specific time.

**Example:**
- Title: "Daily Standup"
- Time: `09:00`
- Description: "Team sync meeting"

#### 📆 Weekly Event
Repeats every week on a specific day.

**Example:**
- Title: "Weekly Review"
- Day: `Friday`
- Time: `15:00`
- Description: "End of week team review"

#### ⚙️ Custom Recurring Event
Advanced scheduling with cron expressions.

**Example:**
- Title: "Monthly Report"
- Cron: `0 9 1 * *` (9 AM on the 1st of every month)
- Description: "Generate monthly analytics report"

**Cron Format:**
```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, Sunday = 0 or 7)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

---

## 📁 Project Structure

```
keppo/
├── prisma/
│   ├── migrations/          # Database migrations
│   └── schema.prisma        # Prisma schema definition
├── src/
│   ├── auth/                # Authentication module
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── discord/             # Discord bot module
│   │   ├── builders/        # UI component builders
│   │   │   ├── modal.builder.ts
│   │   │   └── select-menu.builder.ts
│   │   ├── handlers/        # Interaction handlers
│   │   │   ├── command.handler.ts
│   │   │   ├── modal.handler.ts
│   │   │   └── select-menu.handler.ts
│   │   ├── validators/      # Input validation
│   │   │   └── event-input.validator.ts
│   │   ├── exceptions/      # Custom exceptions
│   │   │   └── discord.exceptions.ts
│   │   ├── discord.constants.ts
│   │   ├── discord.types.ts
│   │   ├── discord.module.ts
│   │   └── discord.service.ts
│   ├── events/              # Event management module
│   │   ├── events.module.ts
│   │   └── events.service.ts
│   ├── prisma/              # Database module
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── scheduler/           # Task scheduling module
│   │   ├── scheduler.module.ts
│   │   └── scheduler.service.ts
│   ├── app.module.ts        # Root module
│   └── main.ts              # Application entry point
├── test/                    # E2E tests
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── nest-cli.json            # NestJS CLI configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

<p align="center">Made with ❤️ and TypeScript</p>
