from model.predictor import predict_species
import json

from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

BIRDS_DATA_PATH = Path(__file__).resolve().parent / "birds.json"

with open(BIRDS_DATA_PATH, "r", encoding="utf-8") as file:
    birds_data = json.load(file)

app = FastAPI(title="Birds Canopy Backend")

# Allow local frontend development servers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_FORMATS = {
    ".wav", ".mp3", ".ogg", ".flac", ".m4a", ".aac"
}

MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB


@app.get("/")
def home():
    return {"message": "Birds Canopy Backend Running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected."
        )

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_FORMATS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported audio format. "
                "Upload WAV, MP3, OGG, FLAC, M4A, or AAC."
            )
        )

    filename = f"{uuid4().hex}{extension}"
    filepath = UPLOAD_DIR / filename
    total_size = 0

    try:
        with filepath.open("wb") as output:
            while True:
                chunk = await file.read(1024 * 1024)

                if not chunk:
                    break

                total_size += len(chunk)

                if total_size > MAX_FILE_SIZE:
                    raise HTTPException(
                        status_code=413,
                        detail=(
                            "Audio file is too large. "
                            "Maximum size is 100 MB."
                        )
                    )

                output.write(chunk)

        if total_size == 0:
            raise HTTPException(
                status_code=400,
                detail="The uploaded audio file is empty."
            )

    except HTTPException:
        filepath.unlink(missing_ok=True)
        raise

    except OSError:
        filepath.unlink(missing_ok=True)
        raise HTTPException(
            status_code=500,
            detail="Could not save the uploaded audio."
        )

    finally:
        await file.close()

    # Temporary response until ML and MongoDB are integrated
    try:
        results = predict_species(filepath)

        species = results["species"]
        bird_info = birds_data.get(species)

        return {
            "success": True,
            "species": species,
            "confidence": results["confidence"],
            "selected_case": results["selected_case"],
            "filename": filename,
            "bird_info": bird_info,
            "message": "Bird prediction completed successfully."
        }

    except Exception as error:
        raise HTTPException(
        status_code=500,
        detail=f"Prediction failed: {error}"
    )

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    schema = get_openapi(
        title=app.title,
        version=app.version,
        routes=app.routes,
    )

    schema["openapi"] = "3.0.3"

    components = schema.get("components", {}).get("schemas", {})

    for component in components.values():
        properties = component.get("properties", {})

        for prop in properties.values():
            if prop.get("contentMediaType") == "application/octet-stream":
                prop.pop("contentMediaType", None)
                prop["format"] = "binary"

    app.openapi_schema = schema
    return schema


app.openapi = custom_openapi
