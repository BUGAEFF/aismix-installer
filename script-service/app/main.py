from fastapi import FastAPI, HTTPException
import sys

app = FastAPI(title="Transcript Service")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/debug")
def debug():
    """Debug endpoint to check imports"""
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        
        return {
            "youtube_transcript_api_imported": True,
            "module_path": str(YouTubeTranscriptApi.__module__),
            "attributes": dir(YouTubeTranscriptApi),
            "python_version": sys.version
        }
    except Exception as e:
        return {
            "error": str(e),
            "type": str(type(e))
        }


@app.get("/")
def root():
    return {"service": "script.aismix.com"}


@app.get("/transcript/{video_id}")
def get_transcript(video_id: str):
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        text = " ".join(item["text"] for item in transcript_list)

        return {
            "video_id": video_id,
            "transcript": text,
            "source": "youtube_transcript_api"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
