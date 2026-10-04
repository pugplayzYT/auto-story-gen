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

## Settings and offline installation

Open **Settings** to choose Light, Dark, or Use device setting. The appearance preference is saved on this device. Stories remain temporary.

On the HTTPS GitHub Pages site, wait for Settings to show **Ready for offline use on this device**. Use **Install app** when offered, or your browser's install menu. On iOS, use Safari → Share → Add to Home Screen. Browser support determines which install option is available. After the initial cache completes, the editor, examples and name replacement work without internet. Copy your work before closing or reloading; offline support does not save your story.

The service worker caches only the static app files and is scoped to this repository's URL. When changing the app shell or its file list, bump the cache version in `sw.js`. New content also refreshes during online visits. No external fonts or runtime services are required.
