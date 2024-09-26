# asr_server/server.py

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
import torch
import tempfile

app = FastAPI()

# CORS-Konfiguration, um Anfragen von Next.js zuzulassen
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialisierung des ASR-Pipelines beim Start
asr_pipeline = None

@app.on_event("startup")
def load_model():
    global asr_pipeline
    device = 0 if torch.cuda.is_available() else -1
    asr_pipeline = pipeline(
        "automatic-speech-recognition",
        model="openai/whisper-small",  # Wechsel zu einem kleineren Modell
        device=device,
        # Optional: Sprache vorgeben, z.B., 'german'
        # model_kwargs={"language": "german"}
    )

@app.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    if not audio:
        raise HTTPException(status_code=400, detail="Keine Audiodatei hochgeladen.")

    try:
        audio_data = await audio.read()

        with tempfile.NamedTemporaryFile(delete=True, suffix=".mp3") as tmp:
            tmp.write(audio_data)
            tmp.flush()
            result = asr_pipeline(tmp.name)

        return {"text": result["text"]}

    except Exception as e:
        print(f"Transkriptionsfehler: {e}")
        raise HTTPException(status_code=500, detail="Transkription fehlgeschlagen.")
