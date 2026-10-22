
from pathlib import Path
from collections import Counter
import pickle
import numpy as np

from .embeddings import generate_embeddings


MODEL_DIR = Path(__file__).resolve().parent / "trained_models"

CASE1_MODEL_PATH = MODEL_DIR / "case1_logistic_regression.pkl"
CASE2_MODEL_PATH = MODEL_DIR / "case2_logistic_regression.pkl"


def load_model(model_path):
    """Load an existing trained classifier."""
    if not model_path.is_file():
        raise FileNotFoundError(f"Model not found: {model_path}")

    with open(model_path, "rb") as file:
        return pickle.load(file)


case1_model = load_model(CASE1_MODEL_PATH)
case2_model = load_model(CASE2_MODEL_PATH)


def predict_species(audio_path):
    """Predict bird species using Case 1 and Case 2.
    Return the prediction with the higher confidence.
    """

    audio_path = Path(audio_path)

    if not audio_path.is_file():
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    # Generate embeddings for all consecutive 5-second chunks.
    chunks, embeddings = generate_embeddings(str(audio_path))

    if len(embeddings) == 0:
        raise ValueError("No audio embeddings were generated.")

    # --------------------------------------------------
    # CASE 1: Select top two chunks by embedding magnitude
    # --------------------------------------------------
    embedding_scores = np.linalg.norm(embeddings, axis=1)

    top_k = min(2, len(embeddings))
    top2_indices = np.argsort(embedding_scores)[::-1][:top_k]
    top2_embeddings = embeddings[top2_indices]

    predictions = case1_model.predict(top2_embeddings)
    probabilities = case1_model.predict_proba(top2_embeddings)
    confidences = probabilities.max(axis=1)

    # Majority vote.
    unique_labels, label_counts = np.unique(
        predictions, return_counts=True
    )
    final_index = int(np.argmax(label_counts))
    case1_prediction = unique_labels[final_index]

    matching_confidences = confidences[
        predictions == case1_prediction
    ]
    case1_confidence = float(matching_confidences.mean())

    # --------------------------------------------------
    # CASE 2: Select the highest-energy audio chunk
    # --------------------------------------------------
    chunk_energies = np.array([
        np.mean(chunk ** 2) for chunk in chunks
    ])

    highest_energy_index = int(np.argmax(chunk_energies))
    case2_embedding = embeddings[
        highest_energy_index
    ].reshape(1, -1)

    case2_prediction = case2_model.predict(case2_embedding)[0]
    case2_probabilities = case2_model.predict_proba(case2_embedding)[0]
    case2_confidence = float(case2_probabilities.max())

    # --------------------------------------------------
    # FINAL: Choose the case with higher confidence
    # --------------------------------------------------
    if case1_confidence >= case2_confidence:
        final_species = str(case1_prediction).strip()
        final_confidence = case1_confidence * 100
        selected_case = "Case 1"
    else:
        final_species = str(case2_prediction).strip()
        final_confidence = case2_confidence * 100
        selected_case = "Case 2"

    return {
        "species": final_species,
        "confidence": round(final_confidence, 2),
        "selected_case": selected_case,
    }


if __name__ == "__main__":
    audio_path = input("Enter the audio file path: ").strip().strip('"')

    try:
        results = predict_species(audio_path)

        print("\n--- Final Bird Species Prediction ---")
        print(f"Species: {results['species']}")
        print(f"Confidence: {results['confidence']}%")
        
    except Exception as error:
        print(f"\nPrediction failed: {error}")
