#!/usr/bin/env python3
"""Fill the Forensic Assessments webapp's own data store, data/central.json, with only the central-catalogue fields it needs.
Read-only against the central catalogue (https://cedwyn.bucklerfamily.estate/api/catalogue/). data/central.json is a derived
cache: never edit it by hand; the central catalogue stays the single source of truth.
Forensic Assessments journals institutions, not catalogue IDs, so its field set is per institution: for every institution in
data.json (slug, name) the store holds the catalogue records whose title or holder names that institution, with id, kind, title,
date_display, date_sort, status, holder and page (newest first), plus a count. The institution list comes from data.json, so
an institution the journal adds is picked up on the next run with no hand-kept list. The file is rewritten only when a record
it holds changed, and a run that cannot read the whole catalogue listing leaves it as it was. Run by
.github/workflows/sync-central.yml every 6 hours. — Sion's Tab agent"""
import json, sys, time, datetime, pathlib, urllib.request
ROOT = pathlib.Path(__file__).resolve().parent.parent
API = 'https://cedwyn.bucklerfamily.estate/api/catalogue/'
FIELDS = ('id', 'kind', 'title', 'date_display', 'date_sort', 'status', 'holder', 'page')
KINDS = {'evidence', 'artifact', 'missing_record'}
OUT = ROOT / 'data' / 'central.json'   # served at /forensic/data/central.json
insts = [(i.get('slug'), i.get('name')) for i in json.loads((ROOT / 'data.json').read_text(encoding='utf-8')).get('institutions', [])
         if i.get('slug') and i.get('name')]
def names(n):
    out = [n]
    if '(' in n: out.append(n.split('(')[0].strip())   # "Information Commissioner's Office (ICO)" -> also the name before the bracket
    for sep in (' / ', ' — '):                          # "Welsh Office / Wales Office" -> also each part
        if sep in out[-1]: out += [p.strip() for p in out[-1].split(sep)]
    return [x for x in dict.fromkeys(out) if len(x) >= 4]
all_rows, total, off = [], None, 0
try:   # one paged listing (/api/catalogue?limit=500&offset=N, edge-cached) matched here, not one uncached search per name (8 Nov 2026, D1 read load)
    while True:
        req = urllib.request.Request(f"{API.rstrip('/')}?limit=500&offset={off}", headers={'User-Agent': 'cedwyn-webapp-sync/1.1'})
        page = json.load(urllib.request.urlopen(req, timeout=60))
        rows = page.get('items') or []
        total = page.get('total', total)
        all_rows += rows
        off += len(rows)
        if not rows or (total is not None and off >= total): break
        time.sleep(1)
except Exception as e:
    sys.exit(f'catalogue listing could not be read ({e}); data/central.json left as it was')
if total is None or len({it.get('id') for it in all_rows if it.get('id')}) < total:
    sys.exit(f'catalogue listing incomplete ({len(all_rows)} of {total}); data/central.json left as it was')
by = {}
for slug, name in insts:
    recs = {}
    for nm in names(name):
        for it in all_rows:
            hay = ((it.get('title') or '') + ' ' + (it.get('holder') or '')).lower()
            if it.get('id') and it.get('kind') in KINDS and nm.lower() in hay:
                recs[it['id']] = {k: it.get(k) for k in FIELDS}
    rows = sorted(recs.values(), key=lambda r: (r.get('date_sort') or '', r['id']), reverse=True)
    by[slug] = {'name': name, 'count': len(rows), 'records': rows}
prev = {}
try: prev = json.loads(OUT.read_text(encoding='utf-8'))
except Exception: pass
if prev.get('institutions') == by:
    print('no change', sum(v['count'] for v in by.values())); sys.exit(0)
doc = {
    'source': API.rstrip('/'),
    'note': "The Forensic Assessments webapp's own data store: for each institution in data.json, the central-catalogue records "
            'whose title or holder names it. Derived and read-only; never edit by hand (tools/sync_central.py rewrites it).',
    'fields': list(FIELDS),
    'match': 'institution name (also the name before any bracket, and each part either side of a slash or dash) found in the record title or holder',
    'synced_utc': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
    'count': sum(v['count'] for v in by.values()), 'institutions': by}
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(doc, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print('written', len(by), 'institutions', doc['count'], 'records')
