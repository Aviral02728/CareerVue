"""Optional local semantic matching for evidence-based resume insights.

The existing score remains the default. This module is deliberately optional:
CareerVue can run with spaCy/scikit-learn alone, while installations with
sentence-transformers can enable richer section and requirement matching.
"""

import os
import re
from functools import lru_cache
from typing import Any, Dict, List


def _enabled() -> bool:
    return os.getenv("CAREERVUE_ENABLE_EMBEDDINGS", "false").lower() in {
        "1",
        "true",
        "yes",
    }


def _reranker_enabled() -> bool:
    return os.getenv("CAREERVUE_ENABLE_RERANKER", "false").lower() in {
        "1",
        "true",
        "yes",
    }


def _chunks(text: str) -> List[str]:
    chunks = [
        re.sub(r"\s+", " ", chunk).strip()
        for chunk in re.split(r"[\n.!?]+", text)
    ]
    return [chunk for chunk in chunks if len(chunk.split()) >= 5][:80]


@lru_cache(maxsize=1)
def _load_model() -> Any:
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer(
        os.getenv("CAREERVUE_EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    )


@lru_cache(maxsize=1)
def _load_reranker() -> Any:
    from sentence_transformers import CrossEncoder

    return CrossEncoder(
        os.getenv(
            "CAREERVUE_RERANKER_MODEL",
            "cross-encoder/ms-marco-MiniLM-L-6-v2",
        )
    )


def semantic_insights(resume_text: str, jd_text: str) -> Dict[str, Any]:
    """Return local semantic evidence without changing the existing score."""
    if not _enabled():
        return {
            "enabled": False,
            "method": "disabled",
            "message": "Set CAREERVUE_ENABLE_EMBEDDINGS=true to enable local semantic matching.",
        }

    try:
        from sentence_transformers import util

        resume_chunks = _chunks(resume_text)
        jd_chunks = _chunks(jd_text)
        if not resume_chunks or not jd_chunks:
            return {"enabled": True, "method": "sentence-transformers", "matches": []}

        model = _load_model()
        resume_vectors = model.encode(resume_chunks, convert_to_tensor=True)
        jd_vectors = model.encode(jd_chunks, convert_to_tensor=True)
        scores = util.cos_sim(jd_vectors, resume_vectors)
        matches = []
        reranker = _load_reranker() if _reranker_enabled() else None
        for jd_index, row in enumerate(scores):
            candidate_indices = [
                int(index) for index in row.argsort(descending=True)[:3]
            ]
            best_index = candidate_indices[0]
            score = float(row[best_index])
            method = "sentence-transformers"
            if reranker is not None:
                pairs = [
                    [jd_chunks[jd_index], resume_chunks[index]]
                    for index in candidate_indices
                ]
                rerank_scores = reranker.predict(pairs)
                best_position = max(
                    range(len(rerank_scores)),
                    key=lambda position: float(rerank_scores[position]),
                )
                best_index = candidate_indices[best_position]
                score = float(rerank_scores[best_position])
                method = "sentence-transformers + cross-encoder"
            matches.append(
                {
                    "requirement": jd_chunks[jd_index],
                    "evidence": resume_chunks[best_index],
                    "similarity": round(score, 3),
                    "supported": score >= (0.55 if reranker is None else 0.35),
                }
            )
        matches.sort(key=lambda item: item["similarity"], reverse=True)
        return {
            "enabled": True,
            "method": method,
            "model": os.getenv("CAREERVUE_EMBEDDING_MODEL", "all-MiniLM-L6-v2"),
            "reranker": (
                os.getenv(
                    "CAREERVUE_RERANKER_MODEL",
                    "cross-encoder/ms-marco-MiniLM-L-6-v2",
                )
                if reranker is not None
                else None
            ),
            "matches": matches[:20],
        }
    except ImportError:
        return {
            "enabled": False,
            "method": "unavailable",
            "message": "Install sentence-transformers to enable local semantic matching.",
        }
    except Exception as exc:
        return {
            "enabled": False,
            "method": "error",
            "message": f"Local semantic matching failed: {exc}",
        }
