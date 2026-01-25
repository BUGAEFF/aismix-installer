from fastapi import FastAPI

app = FastAPI(title="Transcript Service")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
def root():
    return {"service": "script.aismix.com"}

