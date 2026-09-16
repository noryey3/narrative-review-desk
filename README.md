# Narrative Review Desk, deployable version

Same tool as the artifact, packaged so it can live on its own URL.

## What changed from the artifact

The artifact could call the model directly because Claude.ai handled the key for it.
On your own hosting that will not work, so this version calls `/api/claude`, a small
serverless function that holds the key server-side and forwards the request. The key
never reaches the browser.

Saved presets moved from artifact storage to `localStorage`, so they live in whichever
browser you use.

## Files

```
index.html        the app
api/claude.js     serverless proxy to the Anthropic API
```

## Deploy

1. Get an API key from console.anthropic.com. This is a paid key and every review
   spends from it, so treat it like a card number.
2. Put these files in a folder or a Git repo.
3. In Vercel, create a new project from that folder or repo. No build step, no framework
   preset needed. Vercel picks up `api/claude.js` on its own.
4. In Project Settings, Environment Variables, add:
   - `ANTHROPIC_API_KEY` set to your key
   - `APP_PASSCODE` set to any word you choose
5. Deploy.

The passcode is the part worth not skipping. A public URL with a live API key behind it
means anyone who finds it is spending your money. With `APP_PASSCODE` set, the page asks
once and remembers it in that browser. If you ever need to reset it, clear the site data
or run `localStorage.removeItem('nrd:pass')` in the browser console.

## Cost

Every review is one model call, and a review with a PDF pack attached costs more than a
plain paste, since the pages go through as images. The rewrite and the figure sheet are
each one more call. A rough month of steady use lands in single-digit dollars, but check
your console usage after the first week rather than trusting that estimate.

## Client data

Once this is hosted, source packs are moving through your own Vercel deployment. Nothing
is stored there, the function forwards and forgets, but if a client agreement restricts
where their financials can go, that is worth checking before you put real packs through
a public URL.
