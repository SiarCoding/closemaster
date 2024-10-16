import { NextRequest, NextResponse } from 'next/server';
import { RealtimeSession } from 'speechmatics';
import fs from 'fs';
import path from 'path';
import os from 'os';

const API_KEY = process.env.SPEECHMATICS_API_KEY;

if (!API_KEY) {
  console.error('Speechmatics API key is not set in environment variables');
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    const text = formData.get('text') as string | null;

    if (audioFile) {
      // Speech-to-text logic
      const tempDir = os.tmpdir();
      const tempFilePath = path.join(tempDir, 'temp_audio.wav');
      const fileBuffer = Buffer.from(await audioFile.arrayBuffer());
      fs.writeFileSync(tempFilePath, fileBuffer);

      const session = new RealtimeSession({ apiKey: API_KEY as string });
      let transcription = '';

      return new Promise((resolve, reject) => {
        session.addListener('Error', (error) => {
          console.error('Session error:', error);
          reject(new Error('Fehler bei der Transkription'));
        });

        session.addListener('AddTranscript', (message) => {
          if (message.metadata && message.metadata.transcript) {
            transcription += message.metadata.transcript;
          }
        });

        session.addListener('EndOfTranscript', () => {
          resolve(NextResponse.json({ transcription }));
        });

        session
          .start({
            transcription_config: {
              language: 'de',
              operating_point: 'enhanced',
              enable_partials: true,
              max_delay: 2,
            },
            audio_format: { type: 'file' },
          })
          .then(() => {
            const fileStream = fs.createReadStream(tempFilePath);

            fileStream.on('data', (sample: string | Buffer) => {
              if (Buffer.isBuffer(sample)) {
                session.sendAudio(sample);
              } else {
                session.sendAudio(Buffer.from(sample));
              }
            });

            fileStream.on('end', () => {
              session.stop();
              fs.unlinkSync(tempFilePath);
            });
          })
          .catch((error) => {
            console.error('Error starting session:', error.message);
            reject(new Error('Fehler beim Starten der Transkription'));
          });
      });
    } else if (text) {
      // Text-to-speech logic
      // For this example, we'll use a simple text-to-speech API
      const response = await fetch(`http://api.voicerss.org/?key=${process.env.VOICERSS_API_KEY}&hl=de-de&src=${encodeURIComponent(text)}`);
      
      if (!response.ok) {
        throw new Error('Text-to-speech conversion failed');
      }

      const audioBuffer = await response.arrayBuffer();
      
      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
        },
      });
    } else {
      return NextResponse.json({ error: 'Keine Audiodatei oder Text gefunden' }, { status: 400 });
    }
  } catch (error) {
    console.error('Fehler bei Speech-to-Speech:', error);
    return NextResponse.json({ error: 'Fehler bei der Speech-to-Speech-Verarbeitung' }, { status: 500 });
  }
}