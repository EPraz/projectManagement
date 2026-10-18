"""Combine only the real Taskboard retake with the exact original encoded shots."""
import copy
import hashlib
import json
import os
from pathlib import Path
import sys
import time

ROOT = Path(__file__).resolve().parents[3]
RECORDING = ROOT / ".scratch/portfolio-presentation/recording"
SCENES = {"taskboard", "ticket-state", "live-ticket", "task-move", "live-task"}

def compose(base, retake):
    if not all(path.is_relative_to(RECORDING) for path in [base, retake]):
        raise ValueError("Both takes must belong to this project's local recording directory.")
    original = json.loads((base / "manifest.json").read_text(encoding="utf-8"))
    partial = json.loads((retake / "manifest.json").read_text(encoding="utf-8"))
    if partial["rehearsal"] or {scene["id"] for scene in partial["scenes"]} != SCENES:
        raise ValueError("Use an actual five-scene Taskboard retake.")
    if not partial["checks"]["websocket"]["persistence"] or partial["checks"]["websocket"]["observerReloads"] != 0:
        raise ValueError("Retake synchronization and persistence must be verified.")
    destination = RECORDING / f"edit-taskboard-{int(time.time())}"
    destination.mkdir()
    manifest = copy.deepcopy(original)
    manifest["applicationCommit"] = partial["applicationCommit"]
    manifest["origin"] = partial["origin"]
    manifest["checks"] = partial["checks"]
    manifest["checks"]["scenes"] = len(original["scenes"])
    for source in manifest["sources"].values():
        source["file"] = os.path.relpath(base / source["file"], destination)
    for name, source in partial["sources"].items():
        manifest["sources"]["retake-" + name] = {**source, "file": os.path.relpath(retake / source["file"], destination)}
    for index, scene in enumerate(manifest["scenes"]):
        if scene["id"] in SCENES:
            replacement = copy.deepcopy(next(item for item in partial["scenes"] if item["id"] == scene["id"]))
            if replacement["rawSeconds"] > scene["rawSeconds"] + 0.15:
                raise ValueError("Retake action exceeds the original chapter budget.")
            replacement["rawSeconds"] = scene["rawSeconds"]
            replacement["source"] = "retake-" + replacement["source"]
            manifest["scenes"][index] = replacement
        else:
            shot = base / "edit" / f"{index:02}-{scene['id']}.mp4"
            scene["reuseEncoded"] = {"file": os.path.relpath(shot, destination), "sha256": hashlib.sha256(shot.read_bytes()).hexdigest()}
    manifest["sourceRevisions"] = [
        {"commit": original["applicationCommit"], "take": base.name, "scenes": [s["id"] for s in original["scenes"] if s["id"] not in SCENES]},
        {"commit": partial["applicationCommit"], "take": retake.name, "scenes": [s["id"] for s in partial["scenes"]]},
    ]
    manifest["partialRetake"] = {"start": 60.2, "end": 104.32, "baseTake": base.name, "retake": retake.name, "preservedEncodedShots": 12}
    (destination / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    (RECORDING / "latest-edit.json").write_text(json.dumps({"output": str(destination)}, indent=2) + "\n", encoding="utf-8")
    print(destination)

if __name__ == "__main__":
    compose(Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve())
