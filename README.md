# Auto Story Generator

A private, browser-only story personalizer. Paste a story, add characters, mark original names, and enter replacement names. Copy the live result. Three example stories are included. Story text is never sent to a server or stored; refreshing clears your work.

## Develop

No package installation or build is needed. Use Node.js 24 for tests and Python 3 for serving:

```sh
npm test
npm start
```

Open the locally served site on port 8000. Use an HTTP server rather than opening the HTML file directly because JavaScript modules require it.

## Publish

Push these files to `main`, then open the repository's **Settings → Pages** and select **GitHub Actions** as the source. The included workflow tests and deploys the static site. Run the “Deploy GitHub Pages” workflow manually if Pages was enabled after the initial push.

Expected address once successfully deployed: https://pugplayzyt.github.io/auto-story-gen/

## Marking names

“Mark all” uses exact, case-sensitive whole-name matches. You can also select text in the editor, choose a character, and click “Mark name”. Markers such as `{{character-1}}` represent that character's occurrences. The preview replaces markers with the new name, or retains the original if the new field is blank. Removing a character restores their original name in the editor.
