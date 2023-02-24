# discord-ripbot

The Fabulous Ripbot Reborn for Discord

## How to develop

- Use Node 18.14.2
- Use Yarn
- Use Docker & Docker-compose
- Copy .env-sample to .env and fill in the details (get a bot token and client id from discord)
- Install development dependencies with `yarn install`
- Start the bot by running `docker-compose up`
- Stop the bot by running `docker-compose down`
- Dev-server runs nodemon so changes to code will be hot-reloaded

## Deploying slash-commands

- Run the deploy-commands script by running `docker-compose build && docker-compose -f docker-compose-deploy.yml up`

## Development guidelines

- Project uses ESLint, Prettier to maintain code style
- Linter and Prettier are ran precommit
- Use EditorConfig in your editor
