"""Application services shared by the CareerVue API."""

import io
from typing import Any, Dict

from utils.linkedin_generator import (
    calculate_ats_score,
    generate_about_section,
    generate_headline,
    generate_keyword_suggestions,
)
from utils.scoring_engine import calculate_resume_strength
from utils.semantic_matcher import semantic_insights
from utils.skill_matcher import (
    calculate_skill_match,
    extract_skill_evidence,
    extract_skills,
)
from utils.text_extraction import estimate_reading_time, extract_text, get_word_count


def validate_job_description(job_description: str) -> str:
    value = (job_description or "").strip()
    if len(value) < 10:
        raise ValueError("Job description must contain at least 10 characters.")
    return value


def extract_resume(file_content: bytes, filename: str) -> str:
    extension = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if extension not in {"pdf", "docx", "doc"}:
        raise ValueError("Unsupported file format. Please upload PDF or DOCX.")
    return extract_text(io.BytesIO(file_content), extension)


def analyze_resume(
    file_content: bytes,
    filename: str,
    job_description: str,
    matcher: Any,
    nlp: Any,
) -> Dict[str, Any]:
    resume_text = extract_resume(file_content, filename)
    jd_text = validate_job_description(job_description)
    resume_skills = extract_skills(resume_text, matcher, nlp)
    jd_skills = extract_skills(jd_text, matcher, nlp)

    return {
        "filename": filename,
        "text_stats": {
            "word_count": get_word_count(resume_text),
            "reading_time_min": estimate_reading_time(resume_text),
            "characters": len(resume_text),
        },
        "skills": {
            "resume_skills": resume_skills,
            "jd_skills": jd_skills,
            "resume_evidence": extract_skill_evidence(resume_text, matcher, nlp),
            "jd_evidence": extract_skill_evidence(jd_text, matcher, nlp),
        },
        "match_analysis": calculate_skill_match(resume_skills, jd_skills),
        "semantic_insights": semantic_insights(resume_text, jd_text),
        "scores": calculate_resume_strength(
            nlp, resume_text, jd_text, resume_skills, jd_skills
        ),
    }


def optimize_linkedin(
    file_content: bytes,
    filename: str,
    job_description: str,
    matcher: Any,
    nlp: Any,
) -> Dict[str, Any]:
    resume_text = extract_resume(file_content, filename)
    jd_text = validate_job_description(job_description)
    resume_skills = extract_skills(resume_text, matcher, nlp)
    jd_skills = extract_skills(jd_text, matcher, nlp)
    ats_score, ats_feedback = calculate_ats_score(resume_text)

    return {
        "headline": generate_headline(resume_text, resume_skills[:6]),
        "about_section": generate_about_section(
            resume_text, resume_skills, jd_text
        ),
        "recommended_keywords": generate_keyword_suggestions(
            resume_skills, jd_skills
        ),
        "ats_score": {"score": ats_score, "feedback": ats_feedback},
    }
