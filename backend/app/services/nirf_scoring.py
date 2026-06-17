"""
NIRF Scoring Engine — Implements official NIRF weightage framework.
Weights: TLR=30%, RPC=30%, GO=20%, OI=10%, PR=10%
"""
from dataclasses import dataclass
from typing import Optional
import math


@dataclass
class TLRInput:
    total_faculty: int
    phd_faculty: int
    total_students: int
    avg_experience_years: float
    financial_resources_inr: float
    library_expenditure_inr: float
    lab_expenditure_inr: float
    sanctioned_faculty: Optional[int] = None


@dataclass
class RPCInput:
    scopus_papers: int
    wos_papers: int
    total_citations: int
    h_index: int
    patents_filed: int
    patents_granted: int
    consultancy_revenue_inr: float
    sponsored_projects_count: int
    sponsored_amount_inr: float


@dataclass
class GOInput:
    total_graduates: int
    placed_industry: int
    higher_studies: int
    self_employed: int
    median_salary_inr: float
    phd_graduates: int
    phd_faculty: int
    total_faculty: int


@dataclass
class OIInput:
    total_students: int
    women_students: int
    ews_students: int
    sc_students: int
    st_students: int
    obc_students: int
    physically_disabled: int
    international_students: int
    states_represented: int


@dataclass
class PRInput:
    academic_reputation_score: float    # 0-100 from NIRF surveys
    employer_reputation_score: float    # 0-100
    alumni_engagement_score: float      # 0-100
    media_visibility_score: float       # 0-100


@dataclass
class NIRFScoreResult:
    tlr: float
    rpc: float
    go: float
    oi: float
    pr: float
    total: float
    estimated_rank: int
    parameter_percentages: dict
    improvement_potential: dict


class NIRFScoringEngine:
    """
    Official NIRF scoring engine with parameter weights:
    TLR = 30 pts, RPC = 30 pts, GO = 20 pts, OI = 10 pts, PR = 10 pts
    """

    MAX_SCORES = {"tlr": 30, "rpc": 30, "go": 20, "oi": 10, "pr": 10}

    def calculate_tlr(self, d: TLRInput) -> float:
        faculty = max(d.total_faculty, 1)
        students = max(d.total_students, 1)

        # Student-Faculty Ratio (ideal ≤ 15:1)
        sf_ratio = students / faculty
        sf_score = max(0, min(100, 100 - (sf_ratio - 15) * 3))

        # PhD qualification ratio (target > 75%)
        phd_ratio = (d.phd_faculty / faculty) * 100
        phd_score = min(100, phd_ratio * (100 / 75))

        # Faculty experience
        exp_score = min(100, (d.avg_experience_years / 20) * 100)

        # Financial resources per student
        fin_per_student = d.financial_resources_inr / students
        fin_score = min(100, (fin_per_student / 100000) * 100)

        # Library ratio (target > 5% of total expenditure)
        lib_ratio = (d.library_expenditure_inr / max(d.financial_resources_inr, 1)) * 100
        lib_score = min(100, (lib_ratio / 5) * 100)

        # Lab ratio (target > 7%)
        lab_ratio = (d.lab_expenditure_inr / max(d.financial_resources_inr, 1)) * 100
        lab_score = min(100, (lab_ratio / 7) * 100)

        weighted = (
            sf_score  * 0.25 +
            phd_score * 0.30 +
            exp_score * 0.10 +
            fin_score * 0.20 +
            lib_score * 0.075 +
            lab_score * 0.075
        )
        return round(min(30, (weighted / 100) * 30), 2)

    def calculate_rpc(self, d: RPCInput, total_faculty: int = 1) -> float:
        faculty = max(total_faculty, 1)
        total_papers = d.scopus_papers + d.wos_papers

        # Publications per faculty
        pub_per_faculty = total_papers / faculty
        pub_score = min(100, (pub_per_faculty / 6) * 100)

        # Citations per paper
        cit_per_paper = d.total_citations / max(total_papers, 1)
        cit_score = min(100, (cit_per_paper / 10) * 100)

        # H-Index
        h_score = min(100, (d.h_index / 60) * 100)

        # Patents
        total_patents = d.patents_filed + d.patents_granted * 1.5
        patent_score = min(100, (total_patents / 50) * 100)

        # Consultancy
        con_score = min(100, (d.consultancy_revenue_inr / 10_000_000) * 100)

        # Sponsored projects
        proj_score = min(100, (d.sponsored_projects_count / 30) * 100)

        weighted = (
            pub_score    * 0.30 +
            cit_score    * 0.25 +
            h_score      * 0.10 +
            patent_score * 0.15 +
            con_score    * 0.10 +
            proj_score   * 0.10
        )
        return round(min(30, (weighted / 100) * 30), 2)

    def calculate_go(self, d: GOInput) -> float:
        total = max(d.total_graduates, 1)

        # Outcome rate
        total_outcomes = d.placed_industry + d.higher_studies + d.self_employed
        outcome_pct = (total_outcomes / total) * 100
        outcome_score = min(100, (outcome_pct / 90) * 100)

        # Median salary (target ₹7 Lakh+)
        sal_score = min(100, (d.median_salary_inr / 700_000) * 100)

        # PhD graduates
        phd_grad_pct = (d.phd_graduates / total) * 100
        phd_score = min(100, phd_grad_pct * 20)

        weighted = outcome_score * 0.60 + sal_score * 0.30 + phd_score * 0.10
        return round(min(20, (weighted / 100) * 20), 2)

    def calculate_oi(self, d: OIInput) -> float:
        total = max(d.total_students, 1)

        # Women ratio (target ≥ 33%)
        women_pct = (d.women_students / total) * 100
        women_score = min(100, (women_pct / 33) * 100)

        # EWS/SC/ST/OBC
        reserved = d.ews_students + d.sc_students + d.st_students + d.obc_students
        reserved_pct = (reserved / total) * 100
        reserved_score = min(100, (reserved_pct / 50) * 100)

        # Regional diversity
        regional_score = min(100, (d.states_represented / 30) * 100)

        # Disabled students
        disabled_pct = (d.physically_disabled / total) * 100
        disabled_score = min(100, disabled_pct * 30)

        # International students
        int_pct = (d.international_students / total) * 100
        int_score = min(100, int_pct * 20)

        weighted = (
            women_score    * 0.30 +
            reserved_score * 0.30 +
            regional_score * 0.20 +
            disabled_score * 0.10 +
            int_score      * 0.10
        )
        return round(min(10, (weighted / 100) * 10), 2)

    def calculate_pr(self, d: PRInput) -> float:
        weighted = (
            d.academic_reputation_score  * 0.40 +
            d.employer_reputation_score  * 0.35 +
            d.alumni_engagement_score    * 0.15 +
            d.media_visibility_score     * 0.10
        )
        return round(min(10, (weighted / 100) * 10), 2)

    def estimate_rank(self, total_score: float) -> int:
        """Rough rank estimation based on score percentile."""
        if total_score >= 90: return max(1,  int((100 - total_score) * 0.5))
        if total_score >= 80: return max(5,  int((100 - total_score) * 2))
        if total_score >= 70: return max(30, int((100 - total_score) * 5))
        if total_score >= 60: return max(80, int((100 - total_score) * 8))
        return max(150,       int((100 - total_score) * 12))

    def calculate_all(
        self,
        tlr: TLRInput,
        rpc: RPCInput,
        go: GOInput,
        oi: OIInput,
        pr: PRInput,
    ) -> NIRFScoreResult:
        tlr_score = self.calculate_tlr(tlr)
        rpc_score = self.calculate_rpc(rpc, tlr.total_faculty)
        go_score  = self.calculate_go(go)
        oi_score  = self.calculate_oi(oi)
        pr_score  = self.calculate_pr(pr)
        total     = round(tlr_score + rpc_score + go_score + oi_score + pr_score, 2)

        pcts = {
            "tlr": round((tlr_score / 30) * 100, 1),
            "rpc": round((rpc_score / 30) * 100, 1),
            "go":  round((go_score  / 20) * 100, 1),
            "oi":  round((oi_score  / 10) * 100, 1),
            "pr":  round((pr_score  / 10) * 100, 1),
        }

        potential = {
            "tlr": round(30  - tlr_score, 2),
            "rpc": round(30  - rpc_score, 2),
            "go":  round(20  - go_score,  2),
            "oi":  round(10  - oi_score,  2),
            "pr":  round(10  - pr_score,  2),
        }

        return NIRFScoreResult(
            tlr=tlr_score, rpc=rpc_score, go=go_score, oi=oi_score, pr=pr_score,
            total=total,
            estimated_rank=self.estimate_rank(total),
            parameter_percentages=pcts,
            improvement_potential=potential,
        )


scoring_engine = NIRFScoringEngine()
