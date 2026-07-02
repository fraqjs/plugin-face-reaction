import { Context } from '@fraqjs/fraq';
import { createSimpleLogHandler } from '@fraqjs/mock';

import FaceReactionPlugin from '../src';

const ctx = Context.fromUrl('http://localhost:30001', {
  logHandler: createSimpleLogHandler(),
});

// If your plugin depends on other plugins, you should install them here as well.
ctx.install(FaceReactionPlugin);

ctx.start();

process.on('SIGINT', async () => {
  await ctx.stop();
  process.exit(0);
});
