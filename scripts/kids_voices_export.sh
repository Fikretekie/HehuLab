#!/bin/bash
# 🎙️ Kids website test voices: copies the approved recordings of Rodas's voices from HehuLab Voices
#   Tigrinya = Adiam Abraham, Amharic = mikal
# into one zip, ready to put in this repo's public/voices/ (that folder is not uploaded to GitHub: private test only).
# Run in AWS CloudShell:  bash ~/kids_voices_export.sh
# It only reads the voices data; it changes nothing there. The zip goes to s3://hehulab-voices-data/exports/.
set -e
cat > ~/kids_voices_export.py <<'PYEOF'
import boto3, json, os, shutil
from boto3.dynamodb.conditions import Key

BUCKET = "hehulab-voices-data"
WHO = {"ti": "adiam", "am": "mikal"}  # language -> part of the recorder's name
OUT = os.path.expanduser("~/kids_voices")
t = boto3.resource("dynamodb", region_name="us-east-1").Table("hehulab-voices")
s3 = boto3.client("s3", region_name="us-east-1")

def q(index, key, val):
    out, kw = [], {"IndexName": index, "KeyConditionExpression": Key(key).eq(val)}
    while True:
        r = t.query(**kw); out += r["Items"]
        if "LastEvaluatedKey" not in r: return out
        kw["ExclusiveStartKey"] = r["LastEvaluatedKey"]

shutil.rmtree(OUT, ignore_errors=True)
users = [u for u in q("GSI1", "GSI1PK", "USERS") if u.get("SK") == "PROFILE"]
for lang, name in WHO.items():
    people = [u for u in users if name in str(u.get("displayName", "")).lower()]
    if not people:
        print(f"STOP: nobody called '{name}' for {lang}"); continue
    u = people[0]
    recs = [r for r in q("GSI2", "GSI2PK", f"USER#{u['userId']}")
            if str(r.get("PK", "")).startswith("REC#") and (r.get("lang") or "ti") == lang
            and r.get("status") in ("approved", "auto_approved") and r.get("audioKey")]
    recs.sort(key=lambda r: r.get("createdAt", ""))  # newest last, so it wins when a text was recorded twice
    index = {}
    os.makedirs(f"{OUT}/{lang}", exist_ok=True)
    for r in recs:
        text = str(r.get("tigrinyaText") or "").strip()
        if not text:
            continue
        ext = r["audioKey"].rsplit(".", 1)[-1]
        index[text] = f"{r['recId']}.{ext}"
    for i, fname in enumerate(sorted(set(index.values()))):
        rec_id, ext = fname.rsplit(".", 1)
        key = next(r["audioKey"] for r in recs if r["recId"] == rec_id)
        s3.download_file(BUCKET, key, f"{OUT}/{lang}/{fname}")
        if i % 200 == 0:
            print(f"   {lang}: {i} files...")
    json.dump(index, open(f"{OUT}/{lang}.json", "w"), ensure_ascii=False, indent=0)
    print(f"✅ {lang}: {u.get('displayName')} · {len(index)} lines")
PYEOF
echo "1. Copying the approved recordings (a few minutes)..."
python3 ~/kids_voices_export.py
echo "2. Zipping..."
python3 -c "import shutil,os; shutil.make_archive(os.path.expanduser('~/kids_voices'), 'zip', os.path.expanduser('~/kids_voices'))"
ls -lh ~/kids_voices.zip
echo "3. Uploading to S3..."
aws s3 cp ~/kids_voices.zip s3://hehulab-voices-data/exports/kids_voices.zip
echo "✅ Done. Download it: S3 console → hehulab-voices-data → exports → kids_voices.zip, then attach it in the chat."
