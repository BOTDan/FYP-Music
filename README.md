# FYP-Music
Web Application to combine music streaming services. Uses React and Express. University FYP.

## Description
This is a web application designed to combine music streaming services, allowing for listening to music from different providers.
Currently, Spotify and YouTube are supported, with plans for Apple Music and SoundCloud in the future.

## Running
To run this project, clone it, then do the following:
- `npm i` in the root folder.
- `npm i` in the "client" folder.
- Set up configuration (see [Configuration](#Configuration) section).
- For development:
  - Run `npm run dev` in the root folder to launch the server.
  - Run `npm run start` in the "client" folder to launch the client.
- For production:
  - Run `npm run build` in the "client" folder to build the client.
  - Run `npm run build` in the root folder to build the server.
  - Run `npm run start` in the root folder to launch the built server.

## Configuration
The following environment variables can be set for the server. Some of these have default values, but are unlikely to work.
A `.env` file inside the project root can be used, and will be automatically loaded.
- `PORT` - The port to host through
- `DB_HOST` - The hostname of the psql database.
- `DB_PORT` - The port of the psql database.
- `DB_DATABASE` - The name of the database to use.
- `DB_USERNAME` - The username of the user to use to access the database.
- `DB_PASSWORD` - The password of the user to use to access toe database.
- `GOOGLE_CLIENT_ID` - Google client ID. Generated from Google developer console for OAuth logins.
- `GOOGLE_CLIENT_SECRET` - Google client secret. Generated from Google developer console for OAuth logins.
- `SPOTIFY_CLIENT_ID` - Spotify client ID. Generated from Spotify for Developers for OAuth logins.
- `SPOTIFY_CLIENT_SECRET` - Spotify client secret. Generated from Spotify for Developers for OAuth logins.
- `YOUTUBE_API_KEY` - YouTube API key.

## Linting and Tests
Linting is configured for this project. This can be run using `npm run lint`. Auto-fixable problems can be fixed using `npm run lint-fix`. 

Some automated tests have been set up for the server's database. These can be ran using `npm run test`.

All automated tests and linting must pass for a succesful pull request. These checks will be automatically run via GitHub actions.
