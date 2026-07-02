import { definePlugin, param } from '@fraqjs/fraq';

export const FaceReactionPlugin = definePlugin({
  name: 'face-reaction',
  apply(ctx) {
    const router = ctx.router.filter((session) => session.raw.message_scene === 'group');

    // react emoji/face to current message
    const reactCmd = router.group('react');
    reactCmd
      .rawPattern()
      .arg('reaction', param.str())
      .execute(async (session, { reaction }) => {
        const reactionId = reaction.codePointAt(0);
        if (!reactionId || reactionId < 0xff) return; // is an ASCII character, not a valid emoji
        await session.reaction('emoji', reactionId.toString());
      });
    reactCmd
      .rawPattern()
      .arg('reaction', param.segment('face'))
      .execute(async (session, { reaction }) => {
        await session.reaction('face', reaction.data.face_id);
      });
    reactCmd
      .rawPattern()
      .arg('type', param.union('emoji', 'face'))
      .arg('reaction', param.str())
      .execute(async (session, { type, reaction }) => {
        if (type === 'emoji') {
          const reactionId = reaction.codePointAt(0);
          if (!reactionId || reactionId < 0xff) return; // is an ASCII character, not a valid emoji
          await session.reaction('emoji', reactionId.toString());
        } else if (type === 'face') {
          await session.reaction('face', reaction);
        }
      });

    // react emoji/face to a referenced message
    router
      .rawPattern()
      .arg('reference', param.segment('reply'))
      .arg('literal', param.literal('react'))
      .arg('reaction', param.str())
      .execute(async (session, { reference, reaction }) => {
        const reactionId = reaction.codePointAt(0);
        if (!reactionId || reactionId < 0xff) return; // is an ASCII character, not a valid emoji
        await ctx.client.send_group_message_reaction({
          group_id: session.raw.peer_id,
          message_seq: reference.data.message_seq,
          reaction_type: 'emoji',
          reaction: reactionId.toString(),
        });
      });
    router
      .rawPattern()
      .arg('reference', param.segment('reply'))
      .arg('literal', param.literal('react'))
      .arg('reaction', param.segment('face'))
      .execute(async (session, { reference, reaction }) => {
        await ctx.client.send_group_message_reaction({
          group_id: session.raw.peer_id,
          message_seq: reference.data.message_seq,
          reaction_type: 'face',
          reaction: reaction.data.face_id,
        });
      });

    router
      .rawPattern()
      .arg('reference', param.segment('reply'))
      .arg('literal', param.literal('react'))
      .arg('type', param.union('emoji', 'face'))
      .arg('reaction', param.str())
      .execute(async (session, { reference, type, reaction }) => {
        if (type === 'emoji') {
          const reactionId = reaction.codePointAt(0);
          if (!reactionId || reactionId < 0xff) return; // is an ASCII character, not a valid emoji
          await ctx.client.send_group_message_reaction({
            group_id: session.raw.peer_id,
            message_seq: reference.data.message_seq,
            reaction_type: 'emoji',
            reaction: reactionId.toString(),
          });
        } else if (type === 'face') {
          await ctx.client.send_group_message_reaction({
            group_id: session.raw.peer_id,
            message_seq: reference.data.message_seq,
            reaction_type: 'face',
            reaction: reaction,
          });
        }
      });
  },
});

export default FaceReactionPlugin;
