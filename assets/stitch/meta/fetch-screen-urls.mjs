import { stitch } from '@google/stitch-sdk';
const projectId = '8477727617233002131';
const screenIds = [
  '0f67e2ca1d744bfe960622c66b13a8b7',
  'b532765517ea4a6491f3b7f5a0362bf9',
  '1e03d2df82b941bf96acf793a03f4eec',
  '70fef224eb49493a8f4f4a4dedf6fbfe',
];
const project = stitch.project(projectId);
const screens = [];
for (const id of screenIds) {
  const screen = await project.getScreen(id);
  screens.push({
    id,
    html: await screen.getHtml(),
    image: await screen.getImage(),
  });
}
console.log(JSON.stringify({ projectId, screens }, null, 2));
