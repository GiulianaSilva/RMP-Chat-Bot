import 'dotenv/config';
import { writeFile } from 'fs';

// Import necessary components from the @google/genai library
import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai';
import mime from 'mime-types';

async function saveBinaryFile(fileName: string, content: Buffer) {
  writeFile(fileName, content, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing file ${fileName}:`, err);
      return;
    }
    console.log(`File ${fileName} saved to file system.`);
  });
}

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const config = {
    temperature: 0.25,
    responseModalities: [
      'image',
      'text',
    ],
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,  // Block most
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,  // Block most
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,  // Block most
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,  // Block most
      },
    ],
    responseMimeType: 'text/plain',
  };

  const model = 'gemini-2.0-flash-exp-image-generation';

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  for await (const chunk of response) {
    if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
      continue;
    }

    if (chunk.candidates[0].content.parts[0].inlineData) {
      const fileName = 'ENTER_FILE_NAME';
      const inlineData = chunk.candidates[0].content.parts[0].inlineData;
      // Use mime.lookup to get the file type
      let fileExtension = mime.extension(inlineData.mimeType || '');
      let buffer = Buffer.from(inlineData.data || '', 'base64');
      saveBinaryFile(`${fileName}.${fileExtension}`, buffer);
    } else {
      console.log(chunk.text);
    }
  }
}

main();
