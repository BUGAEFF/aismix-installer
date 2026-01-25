from fastapi import FastAPI

app = FastAPI(title="Transcript Service")

@app.get("/")
def root():
    return {
        "service": "script.aismix.com",
        "status": "running"
    }

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/transcript/{video_id}")
def get_transcript(video_id: str):
    return {
        "video_id": video_id,
        "transcript": None,
        "source": "not_implemented_yet"
    }
