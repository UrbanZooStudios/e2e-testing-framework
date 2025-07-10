import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const CREDENTIALS_PATH = path.join(__dirname, '../../credentials.json');
const TOKEN_PATH = path.join(__dirname, '../../token.json');

const DEBUG = true;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// More robust extraction of plain text or HTML fallback..
function extractPlainText(payload: any): string | null {
  if (!payload) return null;

  const decode = (data: string) => Buffer.from(data, 'base64').toString('utf-8');

  const extractPart = (parts: any[]): string | null => {
    for (const part of parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return decode(part.body.data);
      }
    }
    for (const part of parts) {
      if (part.mimeType === 'text/html' && part.body?.data) {
        const html = decode(part.body.data);
        return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }
    for (const part of parts) {
      if (part.parts) {
        const nested = extractPart(part.parts);
        if (nested) return nested;
      }
    }
    return null;
  };

  if (payload.parts) return extractPart(payload.parts);
  if (payload.body?.data) return decode(payload.body.data);

  return null;
}

export async function getVerificationCode(subjectFilter: string): Promise<string | null> {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
  const { client_id, client_secret, redirect_uris } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    oAuth2Client.setCredentials(token);
  } else {
    const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
    console.log('Authorize this app by visiting this URL:\n', authUrl);
    throw new Error('OAuth token not found. Run auth flow manually first.');
  }

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  const query = `newer_than:1d`;

  const res = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults: 5,
  });

  const messages = res.data.messages || [];

  for (const msg of messages) {
    const msgRes = await gmail.users.messages.get({
      userId: 'me',
      id: msg.id!,
      format: 'full',
    });

    const subjectHeader = msgRes.data.payload?.headers
      ?.find(h => h?.name?.toLowerCase() === 'subject');
    const subject = subjectHeader?.value;

    if (DEBUG) {
      console.log('✉️ Found subject:', subject);
    }

    if (!subject?.toLowerCase().includes(subjectFilter.toLowerCase())) continue;

    const decoded = extractPlainText(msgRes.data.payload);
    if (!decoded) continue;

    if (DEBUG) {
      console.log('📨 Email content:\n', decoded);
    }

    const codeMatch = decoded.match(/\b\d{6}\b/);
    if (codeMatch) return codeMatch[0];
  }

  return null;
}

export async function waitForVerificationCode(subjectFilter: string, timeoutMs = 60000): Promise<string | null> {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const code = await getVerificationCode(subjectFilter);
    if (code) return code;

    console.log('⌛ Waiting for verification email...');
    await sleep(5000);
  }

  console.warn('⏰ Timed out waiting for verification code.');
  return null;
}
