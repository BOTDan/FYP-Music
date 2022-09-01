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

## Screenshots
![evaluation_fr1](https://user-images.githubusercontent.com/2904567/187913696-77bdd42b-4739-4740-98f6-862fdfe9c5e9.png)

![evaluation_fr1_2](https://user-images.githubusercontent.com/2904567/187913702-a31ed48f-c7d7-4998-9702-9e51e7ce4442.png)

![evaluation_fr2](https://user-images.githubusercontent.com/2904567/187913706-bb746d74-3a2c-4324-9d1e-c93ca856dbf9.png)

![evaluation_fr3](https://user-images.githubusercontent.com/2904567/187913710-b67ef70b-7a6d-481e-98ee-5202ccfc694c.png)

![evaluation_fr4_1](https://user-images.githubusercontent.com/2904567/187913712-1dab675f-cdb9-48ec-abac-f95a1bedda15.png)

![evaluation_fr4_2](https://user-images.githubusercontent.com/2904567/187913715-4d7abbd6-573b-49d7-9d9c-90524685bab7.png)

![evaluation_fr6](https://user-images.githubusercontent.com/2904567/187913718-f8d2288c-99bd-45f1-bfe2-fca8d21656dd.png)

![evaluation_fr6_2](https://user-images.githubusercontent.com/2904567/187913729-ec4def1f-8d7f-403a-9093-e0871018c3ec.png)

![evaluation_fr7](https://user-images.githubusercontent.com/2904567/187913735-355a36f1-34fa-4fb9-b414-affa024e2f6d.png)

![evaluation_fr8](https://user-images.githubusercontent.com/2904567/187913738-18689f8a-0292-40c7-b6a4-b952d71f6cc2.png)

![evaluation_fr8_2](https://user-images.githubusercontent.com/2904567/187913740-36f9e463-fe41-4805-a950-dc6f96002e5e.png)

![evaluation_fr9](https://user-images.githubusercontent.com/2904567/187913744-524212b8-4364-4fb5-9563-533ca21a387d.png)

