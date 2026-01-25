from fastapi import FastAPI, HTTPException

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
        from youtube_transcript_api import YouTubeTranscriptApi
        
        # create item
        api = YouTubeTranscriptApi()
        
        # fetch 
        fetched = api.fetch(video_id, languages=['en'])
        
        # text
        text = " ".join(item["text"] for item in fetched.transcript)

        return {
            "video_id": video_id,
            "transcript": text,
            "source": "youtube_transcript_api"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
