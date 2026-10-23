
import json
import logging
from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.responses import JSONResponse

from model.predictor import predict_species

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load bird information once
BASE_DIR = Path(__file__).resolve().parent
BIRDS_DATA_PATH = BASE_DIR / "birds.json"

with BIRDS_DATA_PATH.open("r", encoding="utf-8") as file:
    birds_data = json.load(file)

if not isinstance(birds_data, dict):
    raise ValueError("birds.json must contain a JSON object.")

app = FastAPI(title="Birds Canopy Backend")

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
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "No file selected"
            },
        )

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_FORMATS:
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "Unsupported file format"
            },
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
                    return JSONResponse(
                        status_code=413,
                        content={
                            "success": False,
                            "message": "Audio file exceeds the 100 MB limit"
                        },
                    )

                output.write(chunk)

        if total_size == 0:
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "message": "Uploaded file is empty"
                },
            )

        # Predict species using the existing model pipeline
        try:
            results = predict_species(filepath)
        except Exception:
            logger.exception("Bird prediction failed")
            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "message": "Prediction failed"
                },
            )

        species = results.get("species")
        bird_info = birds_data.get(species)

        if not bird_info:
            return JSONResponse(
                status_code=404,
                content={
                    "success": False,
                    "message": "Species not found in birds database"
                },
            )

        # Return every field available for this bird in birds.json
        return {
            "success": True,
            "species": species,
            "confidence": results["confidence"],
            "selected_case": results["selected_case"],
            "filename": filename,
            "bird_info": bird_info,
            "message": "Bird prediction completed successfully."
        }

    except OSError:
        logger.exception("Audio file operation failed")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Could not process uploaded audio"
            },
        )

    finally:
        await file.close()
        filepath.unlink(missing_ok=True)


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
