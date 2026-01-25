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
        
        # Правильный вызов
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        
        # Берем первый доступный transcript и fetch его
        transcript = transcript_list.find_transcript(['en']).fetch()
        
        text = " ".join(item["text"] for item in transcript)

        return {
            "video_id": video_id,
            "transcript": text,
            "source": "youtube_transcript_api"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
