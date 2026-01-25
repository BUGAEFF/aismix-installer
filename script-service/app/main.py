from fastapi import FastAPI, HTTPException

app = FastAPI(title="Transcript Service")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"service": "script.aismix.com"}


@app.get("/check-methods")
def check_methods():
    """Check available methods"""
    from youtube_transcript_api import YouTubeTranscriptApi
    import inspect
    
    methods = [method for method in dir(YouTubeTranscriptApi) 
               if not method.startswith('_')]
    
    # Get method signatures
    method_info = {}
    for method in methods:
        try:
            attr = getattr(YouTubeTranscriptApi, method)
            if callable(attr):
                sig = str(inspect.signature(attr))
                method_info[method] = sig
        except:
            method_info[method] = "Unable to get signature"
    
    return {
        "methods": methods,
        "signatures": method_info
    }


@app.get("/transcript/{video_id}")
def get_transcript(video_id: str):
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        
        # Try direct call
        result = YouTubeTranscriptApi.fetch(video_id)
        
        return {
            "video_id": video_id,
            "result": result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
