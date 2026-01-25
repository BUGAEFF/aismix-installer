from fastapi import FastAPI, HTTPException
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

app = FastAPI(title="Transcript Service")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"service": "script.aismix.com"}


@app.get("/transcript/{video_id}")
def get_transcript(video_id: str):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        text = " ".join(item["text"] for item in transcript)

        return {
            "video_id": video_id,
            "transcript": text,
            "source": "youtube_transcript_api"
        }

    except TranscriptsDisabled:
        raise HTTPException(status_code=404, detail="Transcripts disabled")

    except NoTranscriptFound:
        raise HTTPException(status_code=404, detail="No transcript found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
