"""Small, dependency-light evaluation harness for CareerVue matching changes."""

import json
from pathlib import Path
from typing import Dict, Iterable, Set


def skill_metrics(predicted: Iterable[str], expected: Iterable[str]) -> Dict[str, float]:
    predicted_set: Set[str] = {value.lower() for value in predicted}
    expected_set: Set[str] = {value.lower() for value in expected}
    true_positive = len(predicted_set & expected_set)
    precision = true_positive / len(predicted_set) if predicted_set else 0.0
    recall = true_positive / len(expected_set) if expected_set else 0.0
    f1 = (
        2 * precision * recall / (precision + recall)
        if precision + recall
        else 0.0
    )
    return {
        "precision": round(precision, 3),
        "recall": round(recall, 3),
        "f1": round(f1, 3),
    }


def run(cases_path: str = "evaluation/cases.json") -> Dict[str, float]:
    cases = json.loads(Path(cases_path).read_text(encoding="utf-8"))
    totals = {"precision": 0.0, "recall": 0.0, "f1": 0.0}
    for case in cases:
        metrics = skill_metrics(case["predicted_skills"], case["expected_skills"])
        for key in totals:
            totals[key] += metrics[key]
    count = max(len(cases), 1)
    return {key: round(value / count, 3) for key, value in totals.items()}


if __name__ == "__main__":
    print(json.dumps(run(), indent=2))
