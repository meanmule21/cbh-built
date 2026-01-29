# Deployment Checklist – Changes on GitHub but Not on Live Site

If you've pushed to GitHub successfully but the live site still shows old content, work through this list.

---

## 1. Confirm What You're Seeing

- **Live URL:** Are you checking the exact production URL (e.g. `https://cbh-built.vercel.app` or your custom domain)?
- **Browser cache:** Try a hard refresh (**Ctrl+Shift+R** or **Cmd+Shift+R**) or open the site in an **Incognito/Private** window.
- **CDN cache:** Vercel’s edge cache can take a minute. Wait 1–2 minutes after a deploy, then hard refresh again.

---

## 2. Check Vercel Deployments

1. Go to [vercel.com](https://vercel.com) → your project **cbh-built**.
2. Open the **Deployments** tab.
3. Check:
   - **Did a new deployment start** after your last push? (Look at the time and commit message.)
   - **Status:** Should be **Ready** (green). If it’s **Building** or **Error**, wait or open the deployment and check the logs.
4. Click the latest deployment → **Visit** and confirm that URL shows your changes.

If **no new deployment** appears after your push, Vercel isn’t receiving the push (see step 4).

---

## 3. Force a Fresh Deploy (Clear Cache)

Sometimes Vercel serves a cached build even though GitHub is updated.

1. In Vercel: **Deployments** tab.
2. Click the **three dots (⋯)** on the latest deployment (or the one you want).
3. Choose **Redeploy**.
4. Enable **“Use existing Build Cache”** = **OFF** (clear cache).
5. Click **Redeploy**.

Wait for the build to finish, then hard refresh the live URL (or use Incognito).

---

## 4. Make Sure Vercel Is Watching the Right Repo & Branch

1. Vercel dashboard → your project → **Settings** → **Git**.
2. Confirm:
   - **Connected Repository:** `meanmule21/cbh-built` (or your actual repo).
   - **Production Branch:** usually `main`. Your pushes must go to this branch for production to update.

If the repo or branch is wrong, connect the correct repo/branch and redeploy.

---

## 5. Confirm GitHub Has Your Latest Commit

1. Open `https://github.com/meanmule21/cbh-built` (or your repo).
2. Check the **default branch** (e.g. `main`) and the **latest commit** message/time.
3. Ensure this matches the commit you just pushed from your machine.

If the latest commit on GitHub is old, the push didn’t reach GitHub (e.g. wrong remote or branch). Push again from your repo.

---

## 6. Reconnect Git Integration (If Nothing Else Works)

1. Vercel → Project **Settings** → **Git**.
2. **Disconnect** the repository.
3. **Connect** it again (same GitHub account and repo).
4. Trigger a new deploy: either push an empty commit, or use **Redeploy** (with cache off) from the Deployments tab.

---

## Quick Summary

| Symptom | What to do |
|--------|------------|
| New deployment in Vercel, but site looks old | Hard refresh, Incognito; wait 1–2 min; **Redeploy with “Use existing Build Cache” OFF**. |
| No new deployment after push | Check Vercel **Git** settings (repo + production branch); confirm latest commit on GitHub. |
| Build fails | Open the failed deployment in Vercel, read the **Build Logs**, fix the reported error. |
| Not sure if it’s cache | **Redeploy** with cache disabled, then check the live URL in Incognito. |

After a successful redeploy with cache cleared, the live site should match your GitHub `main` branch. If it still doesn’t, the next step is to share the exact Vercel deployment status (e.g. “last deployment: time, commit, Ready/Error”) and the exact URL you’re checking.
