# Healthcare Communication During Blood Draws

An interactive PSYC 3374 Honors project by Swaroop Sapkota, Sam Houston State University.

Four age groups, communication tips, example conversations, explanations, references, and optional device-based read-aloud. Responsive for phones, tablets, and computers. These are learning examples, not instructions for performing venipuncture.

## Publish with GitHub Pages

In Settings → Pages, select **Deploy from a branch**, branch **main**, folder **/docs**, then Save. The `docs` folder contains the ready-to-publish website.

## Editing

- `app/guide.json`: guide content and references.
- `app/page.tsx`: navigation and layout.
- `app/globals.css`: responsive styles.
- `app/conversation.tsx` and `lib/conversation-speech.ts`: read-aloud controls.

Use Node.js 22.13 or later. Run `npm ci`, `npm test`, and `npm run build`. Commit both the edited source and regenerated `docs` folder so GitHub Pages receives the update. Run `npm run dev` for local development.

Read-aloud uses voices available on the reader's device. Availability and voice quality vary by browser and operating system; the written dialogue remains available when speech fails. Resume repeats the current line. Audio stops when leaving a conversation.
