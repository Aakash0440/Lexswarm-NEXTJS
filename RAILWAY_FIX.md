# Fix Railway $PORT error

The logs show: Error: Invalid value for '--port': '$PORT' is not a valid integer

This means Railway isn't expanding the $PORT env variable. Fix it:

## Option 1 — Set start command in Railway dashboard (easiest)

1. Go to Railway → your Lexswarm service → Settings
2. Find "Start Command" 
3. Set it to exactly:
   uvicorn api.main:app --host 0.0.0.0 --port $PORT

## Option 2 — Add Procfile to your lexswarm backend repo

Create a file called exactly "Procfile" (no extension) in C:\Users\DELL\Desktop\lexswarm\ with this content:
   web: uvicorn api.main:app --host 0.0.0.0 --port $PORT

Then push:
   git add Procfile
   git commit -m "add Procfile for Railway"
   git push

## Option 3 — Fix railway.json

Open C:\Users\DELL\Desktop\lexswarm\railway.json and make sure it has:
{
  "deploy": {
    "startCommand": "uvicorn api.main:app --host 0.0.0.0 --port $PORT"
  }
}

Then push the change.

After any of these fixes, Railway will redeploy and the $PORT error will be gone.
