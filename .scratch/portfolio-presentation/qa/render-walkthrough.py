"""Render a real Playwright take, English captions, and a chronological review strip.

Tools are local to the ignored recording directory; no runtime dependency changes.
"""
import json
import hashlib
import shutil
import os
import math
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, os.environ.get("PRESENTATION_TOOLS", str(ROOT / ".scratch/portfolio-presentation/recording/tools")))
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
FONT = str(ROOT / "frontend/public/fonts/plex-400.ttf")
BOLD = str(ROOT / "frontend/public/fonts/plex-600.ttf")
WIDTH, HEIGHT, FPS = 1920, 1080, 25


def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else FONT, size)


def metadata(file):
    frames = imageio_ffmpeg.read_frames(str(file))
    info = next(frames)
    frames.close()
    return info


def run(arguments):
    result = subprocess.run([FFMPEG, "-hide_banner", "-loglevel", "error", "-y", *map(str, arguments)], capture_output=True, text=True)
    if result.returncode:
        raise RuntimeError(result.stderr[-6000:])


def synchronization_offset(file, wall_time):
    # A brief blue marker exists only in the pre-roll, outside the final edit.
    # Locate its first captured frame rather than estimating from close-time padding.
    result = subprocess.run([FFMPEG, "-hide_banner", "-loglevel", "error", "-i", str(file), "-t", "12", "-vf", "fps=25,crop=8:8:0:0", "-pix_fmt", "rgb24", "-f", "rawvideo", "pipe:1"], capture_output=True)
    if result.returncode:
        raise RuntimeError(result.stderr.decode(errors="replace"))
    size = 8 * 8 * 3
    for frame in range(len(result.stdout) // size):
        pixels = result.stdout[frame * size:(frame + 1) * size]
        r, g, b = (sum(pixels[channel::3]) / 64 for channel in range(3))
        if r < 40 and g < 40 and b > 200:
            return wall_time - frame / FPS
    raise ValueError("No synchronization marker found in the pre-roll.")


def wrapped(draw, text, face, width):
    lines = []
    current = ""
    for word in text.split():
        candidate = f"{current} {word}".strip()
        if current and draw.textlength(candidate, font=face) > width:
            lines.append(current)
            current = word
        else:
            current = candidate
    return [*lines, current]


def overlay(file, scene, caption, index, count):
    canvas = Image.new("RGBA", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(canvas)
    draw.text((180, 5), "EP / PROJECT MANAGEMENT", font=font(22, True), fill="#91B8FF")
    draw.text((505, 8), "PLAN · BUILD · DELIVER", font=font(17), fill="#B8C4D5")
    title = scene["title"]
    title_width = draw.textlength(title, font=font(19))
    draw.text((1740 - title_width, 7), title, font=font(19), fill="#F2F2EF")
    if scene["source"] != "mobile":
        draw.rectangle((179, 39, 1740, 840), outline="#35405A", width=1)
    else:
        draw.rounded_rectangle((1212, 34, 1594, 846), radius=22, outline="#4B5873", width=2)
        draw.text((180, 240), "Same workflow.", font=font(62, True), fill="#F2F2EF")
        draw.text((180, 322), "Smaller screen.", font=font(62, True), fill="#91B8FF")
        for y, text in [(466, "Clear navigation"), (534, "Real sprint workflows"), (602, "Light and dark appearance")]:
            draw.ellipse((184, y + 12, 192, y + 20), fill="#91B8FF")
            draw.text((218, y), text, font=font(29), fill="#B8C4D5")
    face = font(28)
    lines = wrapped(draw, caption, face, 1650)
    if len(lines) > 2:
        raise ValueError(f"Caption is too long: {caption}")
    # Keep captions above the native controls/gradient, including paused fullscreen playback.
    y = 852 + (64 - len(lines) * 32) / 2
    for line in lines:
        w = draw.textlength(line, font=face)
        draw.text(((WIDTH - w) / 2, y), line, font=face, fill="#F2F2EF")
        y += 32
    draw.rectangle((0, 1077, WIDTH, 1079), fill="#2A354C")
    draw.rectangle((0, 1077, round(WIDTH * (index + 1) / count), 1079), fill="#91B8FF")
    canvas.save(file)


def timestamp(seconds):
    milliseconds = round(seconds * 1000)
    hours, milliseconds = divmod(milliseconds, 3600000)
    minutes, milliseconds = divmod(milliseconds, 60000)
    whole, milliseconds = divmod(milliseconds, 1000)
    return f"{hours:02}:{minutes:02}:{whole:02}.{milliseconds:03}"


def apply_frame_holds(output, holds):
    """Hide recorded loading frames without moving captions or later chapters."""
    for index, hold in enumerate(holds):
        original = output.with_suffix(f".before-hold-{index}.mp4")
        output.replace(original)
        run(["-i", original, "-i", original, "-filter_complex",
             f"[0:v][1:v]freezeframes=first={hold['first']}:last={hold['last']}:replace={hold['replace']}[v]",
             "-map", "[v]", "-an", "-r", FPS, "-c:v", "libx264",
             "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
             "-movflags", "+faststart", output])


def render(take):
    manifest = json.loads((take / "manifest.json").read_text(encoding="utf-8"))
    if manifest["rehearsal"]:
        raise ValueError("Render an actual recorded take, not a rehearsal.")
    working = take / "edit"
    working.mkdir(exist_ok=True)
    destination = ROOT / "frontend/public/walkthrough"
    destination.mkdir(parents=True, exist_ok=True)
    offsets = {}
    for name, source in manifest["sources"].items():
        info = metadata(take / source["file"])
        offsets[name] = synchronization_offset(take / source["file"], source["syncWallTime"])
        print(f"{name}: {info['duration']:.2f}s, wall offset {offsets[name]:.3f}s", flush=True)
    chapters = []
    vtt = ["WEBVTT", ""]
    elapsed = 0
    files = []
    for index, scene in enumerate(manifest["scenes"]):
        seconds = math.ceil(scene["rawSeconds"] * FPS) / FPS
        start = max(0, scene["start"] - offsets[scene["source"]])
        chapter = {"id": scene["id"], "title": scene["title"], "start": round(elapsed, 3), "duration": seconds}
        chapters.append(chapter)
        overlays = []
        for number, caption in enumerate(scene["captions"]):
            image = working / f"{index:02}-{number}.png"
            overlay(image, scene, caption, index, len(manifest["scenes"]))
            overlays.append(image)
            a = elapsed + seconds * number / len(scene["captions"])
            b = elapsed + seconds * (number + 1) / len(scene["captions"])
            vtt.extend([f"{timestamp(a)} --> {timestamp(b)}", caption, ""])
        output = working / f"{index:02}-{scene['id']}.mp4"
        files.append(output)
        if scene.get("reuseEncoded"):
            source = (take / scene["reuseEncoded"]["file"]).resolve()
            if not source.is_relative_to(ROOT / ".scratch/portfolio-presentation/recording"):
                raise ValueError("Reused footage must stay in local recording storage.")
            if hashlib.sha256(source.read_bytes()).hexdigest() != scene["reuseEncoded"]["sha256"]:
                raise ValueError("Preserved shot differs from the reviewed base edit.")
            shutil.copy2(source, output)
            print(f"Preserving original encoded shot: {scene['id']}", flush=True)
            elapsed += seconds
            continue
        arguments = ["-ss", f"{start:.3f}", "-i", take / manifest["sources"][scene["source"]]["file"]]
        for image in overlays:
            arguments += ["-loop", "1", "-framerate", FPS, "-i", image]
        if scene["source"] == "mobile":
            app = "scale=370:800:flags=lanczos"
            x, y = 1218, 40
        elif scene.get("camera") == "gentle-center":
            # A subtle camera move over the actual application footage, never synthetic UI.
            app = "crop=iw:ih-20:0:0,zoompan=z='1+0.08*if(between(on,150,275),sin((on-150)*PI/125),0)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1560x800:fps=25"
            x, y = 180, 40
        else:
            app = "crop=iw:ih-20:0:0,scale=1560:800:flags=lanczos"
            x, y = 180, 40
        filters = [f"[0:v]trim=duration={seconds},setpts=PTS-STARTPTS,fps={FPS},tpad=stop_mode=clone:stop_duration=0.12,{app},setsar=1[app]", f"color=c=0x171717:s={WIDTH}x{HEIGHT}:r={FPS}:d={seconds}[bg]", f"[bg][app]overlay={x}:{y}:shortest=1[base]"]
        previous = "base"
        for number in range(len(overlays)):
            a = seconds * number / len(overlays)
            b = seconds * (number + 1) / len(overlays)
            label = f"caption{number}"
            filters.append(f"[{previous}][{number + 1}:v]overlay=0:0:enable='gte(t,{a})*lt(t,{b})':shortest=1[{label}]")
            previous = label
        arguments += ["-filter_complex_threads", "2", "-filter_complex", ";".join(filters), "-map", f"[{previous}]", "-t", seconds, "-an", "-r", FPS, "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", output]
        print(f"Rendering {index + 1}/{len(manifest['scenes'])}: {scene['id']} ({seconds:.2f}s)", flush=True)
        run(arguments)
        apply_frame_holds(output, scene.get("frameHolds", []))
        elapsed += seconds
    concatenation = working / "shots.txt"
    concatenation.write_text("\n".join(f"file '{file.as_posix()}'" for file in files), encoding="utf-8")
    final = destination / "project-management-walkthrough.mp4"
    run(["-f", "concat", "-safe", "0", "-i", concatenation, "-c", "copy", "-movflags", "+faststart", final])
    (destination / "project-management-walkthrough.vtt").write_text("\n".join(vtt), encoding="utf-8")
    poster = destination / "poster.jpg"
    run(["-ss", "6", "-i", final, "-frames:v", "1", "-q:v", "2", poster])
    # Decode the full file to catch truncated or corrupt frames.
    run(["-i", final, "-f", "null", "-"])
    info = metadata(final)
    report = {"applicationCommit": manifest["applicationCommit"], "origin": manifest["origin"], "duration": info["duration"], "size": info["size"], "fps": info["fps"], "bytes": final.stat().st_size, "audio": "none; English captions are embedded", "checks": manifest["checks"], "chapters": chapters, "fullDecode": "passed", "files": ["frontend/public/walkthrough/project-management-walkthrough.mp4", "frontend/public/walkthrough/project-management-walkthrough.vtt", "frontend/public/walkthrough/poster.jpg"]}
    if manifest.get("sourceRevisions"):
        report["sourceRevisions"] = manifest["sourceRevisions"]
        report["partialRetake"] = manifest["partialRetake"]
        report["preservedShots"] = [{"id": scene["id"], "sha256": scene["reuseEncoded"]["sha256"]} for scene in manifest["scenes"] if scene.get("reuseEncoded")]
    (take / "render-report.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    story = []
    for chapter, scene in zip(chapters, manifest["scenes"]):
        story.append({**chapter, "title": scene["title"].split(" / ", 1)[-1], "captions": scene["captions"]})
    media = {"title": "From planning to delivery", "duration": info["duration"], "width": WIDTH, "height": HEIGHT, "fps": FPS,
             "video": "/walkthrough/project-management-walkthrough.mp4", "poster": "/walkthrough/poster.jpg",
             "captions": "/walkthrough/project-management-walkthrough.vtt", "chapters": story}
    generated = ROOT / "frontend/src/pages/walkthrough"
    generated.mkdir(parents=True, exist_ok=True)
    (generated / "walkthrough.json").write_text(json.dumps(media, indent=2) + "\n", encoding="utf-8")
    transcript = ["# Project Management walkthrough", "", "Silent product walkthrough with English text embedded in the picture.", "",
                  "Recorded against an isolated local API and PostgreSQL database with fictional data. Both browser sessions use real backend/WebSocket communication.", ""]
    for chapter in story:
        stamp = f"{int(chapter['start']) // 60}:{int(chapter['start']) % 60:02}"
        transcript.extend([f"## {stamp} — {chapter['title']}", "", *chapter["captions"], ""])
    (destination / "transcript.md").write_text("\n".join(transcript), encoding="utf-8")

    # Every two seconds, in chronological order, for review of the entire edit.
    review = take / "review"
    review.mkdir(exist_ok=True)
    run(["-i", final, "-vf", "fps=1/2,scale=480:270", review / "frame-%03d.jpg"])
    frames = sorted(review.glob("frame-*.jpg"))
    for batch in range(math.ceil(len(frames) / 12)):
        sheet = Image.new("RGB", (1920, 900), "#171717")
        draw = ImageDraw.Draw(sheet)
        for position, file in enumerate(frames[batch * 12:(batch + 1) * 12]):
            row, col = divmod(position, 4)
            x, y = col * 480, row * 300
            with Image.open(file) as frame:
                sheet.paste(frame, (x, y))
            time = (batch * 12 + position) * 2
            draw.text((x + 10, y + 273), timestamp(time)[:8], font=font(17), fill="#F2F2EF")
        sheet.save(review / f"sheet-{batch + 1:02}.jpg", quality=94)
    print(json.dumps(report, indent=2), flush=True)


if __name__ == "__main__":
    render(Path(sys.argv[1]).resolve())
