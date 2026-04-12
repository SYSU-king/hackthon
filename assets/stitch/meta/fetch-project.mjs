import { StitchToolClient } from '@google/stitch-sdk';
const client = new StitchToolClient({ apiKey: process.env.STITCH_API_KEY });
const result = await client.callTool('get_project', { name: 'projects/8477727617233002131' }).catch((error) => ({ error: String(error) }));
await client.close();
console.log(JSON.stringify(result, null, 2));
