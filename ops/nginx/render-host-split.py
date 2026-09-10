#!/usr/bin/env python3
from __future__ import annotations

import pathlib
import re
import sys

if len(sys.argv) != 3:
    raise SystemExit("usage: render-host-split.py <source.conf> <destination.conf>")

source_path = pathlib.Path(sys.argv[1])
destination_path = pathlib.Path(sys.argv[2])
source = source_path.read_text(encoding="utf-8")

# Remove only Certbot-generated redirect guards for apex and www.
source = re.sub(
    r"\n\s*if \(\$host = (?:www\.)?klyrow\.com\) \{.*?\}\s*# managed by Certbot\s*",
    "\n",
    source,
    flags=re.S,
)


def rewrite_server_name(match: re.Match[str]) -> str:
    names = [
        name
        for name in match.group(1).split()
        if name not in {"klyrow.com", "www.klyrow.com"}
    ]
    if not names:
        raise SystemExit("transformation would leave an empty server_name directive")
    return "server_name " + " ".join(names) + ";"


source = re.sub(r"server_name\s+([^;]+);", rewrite_server_name, source)

for protected in ("app.klyrow.com", "api.klyrow.com", "track.klyrow.com", "bounce.klyrow.com"):
    if protected not in source:
        raise SystemExit(f"protected hostname missing after transformation: {protected}")

if re.search(r"server_name[^;]*(?:^|\s)(?:www\.)?klyrow\.com(?:\s|;|$)", source):
    raise SystemExit("apex or www remains in the transformed legacy configuration")

destination_path.write_text(source, encoding="utf-8")
