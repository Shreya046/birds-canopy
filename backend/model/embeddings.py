
import librosa
import numpy as np
import tensorflow as tf

from .perch_model import load_perch_model

SAMPLE_RATE = 32000
WINDOW_SAMPLES = 5 * SAMPLE_RATE


def load_audio(audio_path):
    """Load audio as mono at 32 kHz."""
    waveform, _ = librosa.load(
        audio_path,
        sr=SAMPLE_RATE,
        mono=True,
    )

    if len(waveform) == 0:
        raise ValueError("The audio file is empty.")

    return waveform.astype(np.float32)


def split_audio(waveform):
    """Split audio into consecutive 5-second chunks."""
    if len(waveform) < WINDOW_SAMPLES:
        waveform = np.pad(
            waveform,
            (0, WINDOW_SAMPLES - len(waveform)),
        )

    num_chunks = int(np.ceil(len(waveform) / WINDOW_SAMPLES))
    chunks = []

    for i in range(num_chunks):
        start = i * WINDOW_SAMPLES
        chunk = waveform[start:start + WINDOW_SAMPLES]

        if len(chunk) < WINDOW_SAMPLES:
            chunk = np.pad(
                chunk,
                (0, WINDOW_SAMPLES - len(chunk)),
            )

        chunks.append(chunk.astype(np.float32))

    return chunks


def generate_embeddings(audio_path):
    """Generate one 1536-dimensional Perch embedding per chunk."""
    waveform = load_audio(audio_path)
    chunks = split_audio(waveform)

    model = load_perch_model()
    serving_fn = model.signatures["serving_default"]

    embeddings = []

    for chunk in chunks:
        audio_tensor = tf.convert_to_tensor(
            chunk[np.newaxis, :],
            dtype=tf.float32,
        )

        output = serving_fn(inputs=audio_tensor)
        embedding = output["embedding"].numpy()[0]

        if embedding.shape != (1536,):
            raise ValueError(
                f"Expected 1536 embedding values, got {embedding.shape}"
            )

        embeddings.append(embedding)

    return chunks, np.asarray(embeddings, dtype=np.float32)
