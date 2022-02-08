import { Router } from 'express';
import { google } from 'googleapis';
import { config } from '../config';

const oauth2Client = new google.auth.OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  'http://localhost:8080/auth/google/callback',
);

const scopes = [
  'https://www.googleapis.com/auth/youtube.readonly',
];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

export const googleAuthRouter = Router();

googleAuthRouter.get('/', (request, response) => {
  response.redirect(url);
});
