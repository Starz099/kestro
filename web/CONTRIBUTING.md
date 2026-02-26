# Contributing to Kestro

This project is currently a solo mission. I have been cooking in this repository recently to build something meaningful, so it is not some massive corporate operation with strict bureaucracy. That being said, contributions are absolutely valid and appreciated.

If you see something that looks cooked or you have a vision for a new feature, just raise an issue and we can discuss the direction.

## Local Development Setup

To get the environment running on your machine, follow these steps. Ensure you have Bun installed because we are not using slow package managers here.

### Prerequisites

- Node.js 20 or higher
- Bun (the only valid choice)
- PostgreSQL instance

### Step by Step Guide

1. Clone your fork of the repository:

   ```bash
   git clone https://github.com/your-username/kestro.git
   cd kestro
   ```

2. Install the dependencies:

   ```bash
   bun install
   ```

3. Environment Configuration:
   Copy the .env.example file to .env and input your Clerk and PostgreSQL credentials. Do not leak these or it is over for you.

4. Launch:
   ```bash
   bun run dev
   ```

The application will be live at http://localhost:3000. If it does not start, check your logs because something is likely misconfigured.

## Final Note

Just be respectful and keep the code clean. If the PR is mid, I will let you know. If it is a massive W, it gets merged. Simple as that.
