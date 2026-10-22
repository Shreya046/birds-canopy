
import tensorflow as tf
import tensorflow_hub as hub

# Google Perch 2.0 model URL
PERCH_MODEL_URL = (
    "https://www.kaggle.com/models/google/"
    "bird-vocalization-classifier/tensorFlow2/perch_v2_cpu/1"
)

_perch_model = None


def load_perch_model():
    """Load Google Perch 2.0 once and reuse it."""
    global _perch_model

    if _perch_model is None:
        print("Loading Google Perch 2.0...")
        _perch_model = hub.load(PERCH_MODEL_URL)
        print("Google Perch 2.0 loaded successfully!")

    return _perch_model
