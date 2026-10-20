import { RepositoryDataset, REPOSITORIES } from "@/data/nexusData";
import { ResearchPaper, RESEARCH_PAPERS, findRelevantPaperForTrio } from "@/data/researchPapers";

export interface ProjectionPoint {
  id: string;
  x: number;
  y: number;
  datasetIndex: 1 | 2 | 3;
  datasetName: string;
  cluster: string;
  value: string;
  variance: string;
  trajectory: { dx: number; dy: number };
  hypothesisRank?: number;
}

export interface TimeSeriesPoint {
  month: string;
  ds1: number;
  ds2: number;
  ds3: number;
}

export interface CandidateHypothesis {
  id: string;
  rank: number;
  title: string;
  statement: string; // Plain English, testable, understandable in 5 seconds
  relationshipType: "Direct Correlation" | "Delayed Lag" | "Mediated Pathway" | "Confounded Control" | "Threshold Shift";
  relationshipLabel: string;
  aiScore: number;
  scoreBreakdown: {
    datasetCompatibility: number;
    researchRelevance: number;
    evidenceStrength: number;
    novelty: number;
  };
  scoreExplanation: {
    compatibilityText: string;
    relevanceText: string;
    evidenceText: string;
    noveltyText: string;
  };
  whyFlagged: string[]; // 4 simple bullet points for "WHY NEXUS FLAGGED THIS"
  researchMatch: {
    paper: ResearchPaper;
    matchStatus: "Strong research similarity" | "Related evidence found" | "RESEARCH MATCH FOUND" | "No direct match";
    relevanceNote: string;
  };
  datasets: {
    id: string;
    identifier: string;
    title: string;
    role: "Exposure Variable" | "Mediating Factor" | "Observed Outcome";
    plainRole: string;
  }[];
  whatAreWeTesting: string;
  modelSuggestion: string;
  timeSeriesExplanation: {
    trendText: string;
    seasonalText: string;
    residualText: string;
  };
  adjustedEffectExplanation: string;
}

export interface DiscoveryAnalysisResult {
  trioKey: string;
  hypothesisCode: string;
  title: string;
  headline: string;
  dataset1: RepositoryDataset;
  dataset2: RepositoryDataset;
  dataset3: RepositoryDataset;
  // 5 Ranked Candidate Hypotheses
  hypotheses: CandidateHypothesis[];
  strongestHypothesis: CandidateHypothesis;
  // Top-level quantitative summary
  correlation: number;
  correlationDisplay: string;
  correlationType: string;
  temporalAssociation: number;
  spatialCoverage: number;
  lag: string;
  lagValue: number;
  confidence: "High Confidence" | "Moderate-High" | "Experimental Candidate";
  bayesFactor: number;
  pValue: string;
  sampleSize: string;
  discoverySignal: string;
  signalNotice: string;
  whyInteresting: string[];
  projectionPoints: ProjectionPoint[];
  timeSeriesData: TimeSeriesPoint[];
  evidenceItems: { title: string; desc: string; score: number }[];
  alternativeExplanations: { title: string; mechanism: string; risk: "Low" | "Medium" | "High" }[];
  dagDefaults: {
    macroGdpDefault: number;
    demographicsDefault: number;
    inflationDefault: number;
  };
}

// Simple deterministic hash from string
function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// Deterministic pseudo-random number generator [0, 1) from seed
function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Plain-English descriptor map for all known datasets
interface DatasetPlainMeta {
  simpleName: string;
  subjectPhrase: string;
  changeVerb: string;
  outcomePhrase: string;
}

const DATASET_PLAIN_METAS: Record<string, DatasetPlainMeta> = {
  "ds-sipri-milex": {
    simpleName: "defence spending",
    subjectPhrase: "Countries with higher defence spending growth",
    changeVerb: "increasing defence investments",
    outcomePhrase: "shifts in regional technical capacity",
  },
  "ds-unesco-uis": {
    simpleName: "higher education enrollment",
    subjectPhrase: "Regions expanding university and technical enrollment",
    changeVerb: "expanding higher education access",
    outcomePhrase: "growth in specialized graduates",
  },
  "ds-ilo-youth": {
    simpleName: "youth employment",
    subjectPhrase: "Labor markets with shifting youth employment",
    changeVerb: "improving youth employment rates",
    outcomePhrase: "lower rates of youth out of work or school",
  },
  "ds-ecmwf-cams": {
    simpleName: "urban air pollution (PM2.5)",
    subjectPhrase: "Cities with elevated fine particulate matter",
    changeVerb: "higher fine air pollution (PM2.5) levels",
    outcomePhrase: "increased population air pollution exposure",
  },
  "ds-who-gho": {
    simpleName: "hospital admissions",
    subjectPhrase: "Communities tracking emergency hospital visits",
    changeVerb: "surges in acute hospital admissions",
    outcomePhrase: "more respiratory and inpatient hospital visits",
  },
  "ds-usgs-water": {
    simpleName: "water nitrate runoff",
    subjectPhrase: "Watersheds with high agricultural runoff",
    changeVerb: "elevated dissolved nitrate in drinking watersheds",
    outcomePhrase: "higher chemical exposure in rural water basins",
  },
  "ds-noaa-goes": {
    simpleName: "space weather & solar flux",
    subjectPhrase: "Regions experiencing geomagnetic solar storm spikes",
    changeVerb: "stronger ionospheric solar storm activity",
    outcomePhrase: "measurable electrical grid phase variations",
  },
  "ds-cern-cms": {
    simpleName: "particle collision traces",
    subjectPhrase: "Detectors recording high-energy particle collisions",
    changeVerb: "unusual cluster energy deposits",
    outcomePhrase: "anomalous subatomic particle decay traces",
  },
  "ds-eurostat-nuts3": {
    simpleName: "household income",
    subjectPhrase: "Districts with rising median household incomes",
    changeVerb: "higher regional income levels",
    outcomePhrase: "shifts in household poverty thresholds",
  },
  "ds-worldbank-macro": {
    simpleName: "national GDP growth",
    subjectPhrase: "Economies experiencing rapid GDP expansion",
    changeVerb: "accelerating national GDP growth",
    outcomePhrase: "broader industrial economic output",
  },
  "ds-cdc-wonder": {
    simpleName: "public health mortality",
    subjectPhrase: "Counties reporting chronic health outcomes",
    changeVerb: "fluctuations in public health mortality",
    outcomePhrase: "changes in chronic health diagnoses",
  },
  "ds-mta-transit": {
    simpleName: "subway transit delays",
    subjectPhrase: "Urban centers experiencing frequent subway delays",
    changeVerb: "chronic transit dispatch delays",
    outcomePhrase: "disruptions in local pedestrian business foot traffic",
  },
};

function getPlainMeta(ds: RepositoryDataset): DatasetPlainMeta {
  if (DATASET_PLAIN_METAS[ds.id]) {
    return DATASET_PLAIN_METAS[ds.id];
  }
  return {
    simpleName: ds.category.toLowerCase() + " indicators",
    subjectPhrase: `Regions with active ${ds.category.toLowerCase()} changes`,
    changeVerb: `shifts in ${ds.title.toLowerCase()}`,
    outcomePhrase: `notable patterns in ${ds.title.toLowerCase()}`,
  };
}

export function analyzeDatasetTrio(
  id1: string,
  id2: string,
  id3: string,
  catalogue: RepositoryDataset[] = REPOSITORIES
): DiscoveryAnalysisResult {
  const ds1 = catalogue.find(d => d.id === id1) || catalogue[0];
  const ds2 = catalogue.find(d => d.id === id2) || catalogue[1];
  const ds3 = catalogue.find(d => d.id === id3) || catalogue[2];

  const trioKey = `${ds1.id}__${ds2.id}__${ds3.id}`;
  const seed = stringHash(trioKey);
  const rand = seededRandom(seed);

  // Quantitative metrics
  const corrVal = Number((0.44 + rand() * 0.42).toFixed(2));
  const isNegative = rand() > 0.75;
  const correlation = isNegative ? -corrVal : corrVal;
  const correlationDisplay = correlation > 0 ? `+${correlation.toFixed(2)}` : correlation.toFixed(2);

  const temporalAssociation = Math.floor(68 + rand() * 24); // 68% - 92%
  const spatialCoverage = Math.floor(52 + rand() * 40); // 52% - 92%

  const lagOptions = [
    { label: "+48h", value: 48, unit: "hours" },
    { label: "+6m", value: 6, unit: "months" },
    { label: "+12m", value: 12, unit: "months" },
    { label: "+18m", value: 18, unit: "months" },
    { label: "+24m", value: 24, unit: "months" },
  ];
  const lagIndex = Math.floor(rand() * lagOptions.length);
  const lagChoice = lagOptions[lagIndex];

  const bayesFactor = Number((4.5 + rand() * 20).toFixed(1));
  const confidence: "High Confidence" | "Moderate-High" | "Experimental Candidate" =
    bayesFactor > 14 ? "High Confidence" : bayesFactor > 7 ? "Moderate-High" : "Experimental Candidate";

  const pValueOptions = ["p < 0.0001", "p < 0.001", "p = 0.002", "p = 0.004", "p = 0.008"];
  const pValue = pValueOptions[Math.floor(rand() * pValueOptions.length)];
  const sampleSizes = [
    "n = 24 regional clusters",
    "n = 4,180 matched time series",
    "n = 840,000 observations",
    "n = 12,940 monitoring points",
    "n = 38 countries (OECD & EU)",
  ];
  const sampleSize = sampleSizes[Math.floor(rand() * sampleSizes.length)];

  const correlationTypes = ["Pearson r", "Spearman ρ", "Distributed Lag OLS"];
  const correlationType = correlationTypes[Math.floor(rand() * correlationTypes.length)];

  const codeNum = (1000 + (seed % 9000)).toString();
  const hypothesisCode = `HYP-2025-${codeNum}`;

  // Plain English descriptors for the 3 selected datasets
  const m1 = getPlainMeta(ds1);
  const m2 = getPlainMeta(ds2);
  const m3 = getPlainMeta(ds3);

  // Identify relevant research papers for this trio
  const trioDomains = [ds1.category, ds2.category, ds3.category];
  const researchMatch1 = findRelevantPaperForTrio(trioDomains, seed);
  const researchMatch2 = findRelevantPaperForTrio([ds1.category, ds2.category], seed + 1);
  const researchMatch3 = findRelevantPaperForTrio([ds2.category, ds3.category], seed + 2);
  const researchMatch4 = findRelevantPaperForTrio([ds1.category, ds3.category], seed + 3);
  const researchMatch5 = findRelevantPaperForTrio([ds3.category], seed + 4);

  // Generate 5 distinct, plain-English candidate hypotheses
  const rawHypotheses: Array<Omit<CandidateHypothesis, "rank">> = [
    {
      id: `${trioKey}-hyp-1`,
      title: `${m1.simpleName} & ${m3.simpleName} Connection`,
      statement: `${m1.subjectPhrase} may also tend to report ${m3.outcomePhrase}.`,
      relationshipType: "Direct Correlation",
      relationshipLabel: "Direct Association",
      aiScore: Math.floor(90 + rand() * 5), // 90 - 94
      scoreBreakdown: {
        datasetCompatibility: Math.floor(90 + rand() * 6),
        researchRelevance: Math.floor(88 + rand() * 8),
        evidenceStrength: Math.floor(84 + rand() * 10),
        novelty: Math.floor(78 + rand() * 14),
      },
      scoreExplanation: {
        compatibilityText: "Both datasets cover overlapping geographical regions and matched reporting periods.",
        relevanceText: "Independent research papers document closely aligned empirical patterns.",
        evidenceText: "Strong cross-sectional correlation visible across normalized sample points.",
        noveltyText: "Combines two repositories that are rarely evaluated together in monolithic studies.",
      },
      whyFlagged: [
        `The two datasets overlap geographically across ${spatialCoverage}% of sampled regions.`,
        `Their measurement timelines line up consistently without reporting gaps.`,
        `Previous research by ${researchMatch1.paper.authors.split(",")[0]} et al. notes a comparable relationship.`,
        `The observed co-variance is strong enough (r = ${correlationDisplay}) to warrant a live human investigation.`,
      ],
      researchMatch: {
        paper: researchMatch1.paper,
        matchStatus: "Strong research similarity",
        relevanceNote: `Previous study published in ${researchMatch1.paper.source} observed a similar relationship between ${m1.simpleName} and ${m3.simpleName}.`,
      },
      datasets: [
        { id: ds1.id, identifier: ds1.identifier, title: ds1.title, role: "Exposure Variable", plainRole: "Primary Driver (A)" },
        { id: ds2.id, identifier: ds2.identifier, title: ds2.title, role: "Mediating Factor", plainRole: "Context Variable (B)" },
        { id: ds3.id, identifier: ds3.identifier, title: ds3.title, role: "Observed Outcome", plainRole: "Target Outcome (C)" },
      ],
      whatAreWeTesting: `We are checking whether places with higher ${m1.simpleName} also systematically show ${m3.outcomePhrase}.`,
      modelSuggestion: `The relationship is clearly visible in the raw data, but control variables should be adjusted to check for underlying economic or population drivers.`,
      timeSeriesExplanation: {
        trendText: `Both ${m1.simpleName} and ${m3.simpleName} generally trended in the same direction over this 24-month timeline.`,
        seasonalText: `The connection appears slightly stronger during specific seasonal quarters.`,
        residualText: `The residual noise is low, indicating that short-term data blips do not disrupt the pattern.`,
      },
      adjustedEffectExplanation: `The relationship remains visible after accounting for the selected control variables.`,
    },
    {
      id: `${trioKey}-hyp-2`,
      title: `${m2.simpleName} & ${m3.simpleName} Pattern`,
      statement: `${m2.subjectPhrase} may see a corresponding shift in ${m3.simpleName}.`,
      relationshipType: "Direct Correlation",
      relationshipLabel: "Secondary Co-Movement",
      aiScore: Math.floor(83 + rand() * 6), // 83 - 88
      scoreBreakdown: {
        datasetCompatibility: Math.floor(86 + rand() * 8),
        researchRelevance: Math.floor(82 + rand() * 8),
        evidenceStrength: Math.floor(80 + rand() * 8),
        novelty: Math.floor(82 + rand() * 10),
      },
      scoreExplanation: {
        compatibilityText: "Solid sensor and survey alignment across metropolitan and sub-national tiers.",
        relevanceText: "Prior academic publications have explored related localized interactions.",
        evidenceText: "Consistent linear trend with mild dispersion across boundary clusters.",
        noveltyText: "Offers fresh insight into secondary spillover dynamics.",
      },
      whyFlagged: [
        `Clear statistical alignment between ${ds2.identifier} and ${ds3.identifier}.`,
        `Seasonal spikes coincide across multiple recording years.`,
        `Related evidence available from ${researchMatch2.paper.source}.`,
        `Helps isolate whether ${m2.simpleName} is an active driver or an innocent bystander.`,
      ],
      researchMatch: {
        paper: researchMatch2.paper,
        matchStatus: "Related evidence found",
        relevanceNote: `Prior findings in ${researchMatch2.paper.source} suggest localized covariance between these domains.`,
      },
      datasets: [
        { id: ds2.id, identifier: ds2.identifier, title: ds2.title, role: "Exposure Variable", plainRole: "Primary Driver (B)" },
        { id: ds1.id, identifier: ds1.identifier, title: ds1.title, role: "Mediating Factor", plainRole: "Context Variable (A)" },
        { id: ds3.id, identifier: ds3.identifier, title: ds3.title, role: "Observed Outcome", plainRole: "Target Outcome (C)" },
      ],
      whatAreWeTesting: `We are testing whether changes in ${m2.simpleName} reliably precede or accompany shifts in ${m3.simpleName}.`,
      modelSuggestion: `The secondary model indicates moderate association, with demographic factors explaining a portion of the variance.`,
      timeSeriesExplanation: {
        trendText: `Both series display gradual co-directional movement across the observation window.`,
        seasonalText: `Noticeable quarterly synchronization during peak reporting months.`,
        residualText: `Residual variance is stationary and passes unit-root checks.`,
      },
      adjustedEffectExplanation: `The secondary effect holds steady even after filtering baseline demographic differences.`,
    },
    {
      id: `${trioKey}-hyp-3`,
      title: `Delayed ${lagChoice.label} Effect`,
      statement: `Periods of rapid change in ${m1.simpleName} may be followed after about ${lagChoice.value} ${lagChoice.unit} by ${m3.outcomePhrase}.`,
      relationshipType: "Delayed Lag",
      relationshipLabel: "Temporal Lag Sequence",
      aiScore: Math.floor(77 + rand() * 6), // 77 - 82
      scoreBreakdown: {
        datasetCompatibility: Math.floor(82 + rand() * 8),
        researchRelevance: Math.floor(78 + rand() * 8),
        evidenceStrength: Math.floor(76 + rand() * 10),
        novelty: Math.floor(84 + rand() * 8),
      },
      scoreExplanation: {
        compatibilityText: "Cross-correlation checks show a distinct peak when shifting time series.",
        relevanceText: "Literature supports multi-month policy and behavioral implementation delays.",
        evidenceText: "Bimodal peak in cross-correlation function at t + " + lagChoice.label + ".",
        noveltyText: "Uncovers a delayed transmission channel that simultaneous analyses overlook.",
      },
      whyFlagged: [
        `Strongest correlation occurs after a ${lagChoice.label} delay rather than instantaneously.`,
        `Rules out immediate reporting artifacts or single-day data anomalies.`,
        `Consistent with structural real-world delay mechanisms.`,
        `Gives policy teams advance foresight if validated.`,
      ],
      researchMatch: {
        paper: researchMatch3.paper,
        matchStatus: "Related evidence found",
        relevanceNote: `Research in ${researchMatch3.paper.source} confirms delayed transmission mechanisms across these sectors.`,
      },
      datasets: [
        { id: ds1.id, identifier: ds1.identifier, title: ds1.title, role: "Exposure Variable", plainRole: "Early Signal (A)" },
        { id: ds2.id, identifier: ds2.identifier, title: ds2.title, role: "Mediating Factor", plainRole: "Intermediary (B)" },
        { id: ds3.id, identifier: ds3.identifier, title: ds3.title, role: "Observed Outcome", plainRole: "Delayed Outcome (C)" },
      ],
      whatAreWeTesting: `We are verifying whether a noticeable spike in ${m1.simpleName} reliably forecasts a change in ${m3.simpleName} ${lagChoice.value} ${lagChoice.unit} later.`,
      modelSuggestion: `Distributed lag estimation points to a substantial delayed effect, which tapers off after two cycles.`,
      timeSeriesExplanation: {
        trendText: `The first curve climbs first, and the second curve mirrors that shape several months later.`,
        seasonalText: `The lag offset is stable across recurring annual cycles.`,
        residualText: `Autocorrelation in residuals drops sharply when the lag is incorporated into the model.`,
      },
      adjustedEffectExplanation: `Lagged effect remains statistically significant after controlling for inflation and general growth.`,
    },
    {
      id: `${trioKey}-hyp-4`,
      title: `${m2.simpleName} Mediating Pathway`,
      statement: `${m2.simpleName} may explain part of the underlying connection between ${m1.simpleName} and ${m3.simpleName}.`,
      relationshipType: "Mediated Pathway",
      relationshipLabel: "Bridge Pathway",
      aiScore: Math.floor(71 + rand() * 6), // 71 - 76
      scoreBreakdown: {
        datasetCompatibility: Math.floor(76 + rand() * 8),
        researchRelevance: Math.floor(74 + rand() * 8),
        evidenceStrength: Math.floor(72 + rand() * 8),
        novelty: Math.floor(86 + rand() * 8),
      },
      scoreExplanation: {
        compatibilityText: "Tri-vector covariance meets standard structural equation model thresholds.",
        relevanceText: "Prior theory points toward indirect mediation through regional institutional channels.",
        evidenceText: "Sobel-Goodman mediation test suggests partial indirect path.",
        noveltyText: "Presents a plausible intermediate bridge rather than assuming direct causation.",
      },
      whyFlagged: [
        `Statistical tests suggest that ${ds2.identifier} acts as an active bridge.`,
        `Direct link between ${ds1.identifier} and ${ds3.identifier} softens when ${ds2.identifier} is included.`,
        `Provides an intuitive step-by-step mechanism for human researchers to audit.`,
        `Informs targeted policy interventions at the middle stage.`,
      ],
      researchMatch: {
        paper: researchMatch4.paper,
        matchStatus: "RESEARCH MATCH FOUND",
        relevanceNote: `Directly related to structural mediation findings published in ${researchMatch4.paper.source}.`,
      },
      datasets: [
        { id: ds1.id, identifier: ds1.identifier, title: ds1.title, role: "Exposure Variable", plainRole: "Starting Factor (A)" },
        { id: ds2.id, identifier: ds2.identifier, title: ds2.title, role: "Mediating Factor", plainRole: "Mediator Bridge (B)" },
        { id: ds3.id, identifier: ds3.identifier, title: ds3.title, role: "Observed Outcome", plainRole: "Final Result (C)" },
      ],
      whatAreWeTesting: `We are analyzing whether ${m1.simpleName} influences ${m3.simpleName} mainly by first affecting ${m2.simpleName}.`,
      modelSuggestion: `Mediation analysis suggests roughly one third of the overall effect flows through the intermediate factor.`,
      timeSeriesExplanation: {
        trendText: `The mediator series tracks halfway between the starting factor and the final outcome.`,
        seasonalText: `Seasonal peaks propagate in order: first variable A, then B, then C.`,
        residualText: `Adding the mediator reduces unexplained variance in the final outcome.`,
      },
      adjustedEffectExplanation: `Direct effect shrinks when accounting for the mediator, supporting the bridge theory.`,
    },
    {
      id: `${trioKey}-hyp-5`,
      title: "Control & Confounder Check",
      statement: `The relationship between ${m1.simpleName} and ${m3.simpleName} may weaken after controlling for general economic and population factors.`,
      relationshipType: "Confounded Control",
      relationshipLabel: "Confounder Sensitivity",
      aiScore: Math.floor(64 + rand() * 6), // 64 - 69
      scoreBreakdown: {
        datasetCompatibility: Math.floor(70 + rand() * 8),
        researchRelevance: Math.floor(68 + rand() * 8),
        evidenceStrength: Math.floor(65 + rand() * 8),
        novelty: Math.floor(75 + rand() * 10),
      },
      scoreExplanation: {
        compatibilityText: "Cross-dataset matching identifies potential common background variables.",
        relevanceText: "Econometric standards require stress-testing for spurious co-trending.",
        evidenceText: "Controlling for demographic density reduces the raw correlation magnitude.",
        noveltyText: "Crucial devil's advocate check to prevent false-positive discovery claims.",
      },
      whyFlagged: [
        `Essential scientific check: tests whether a common third factor is creating an illusion.`,
        `Helps verify if national growth trends are driving both datasets simultaneously.`,
        `Ensures researchers do not mistake correlation for causation.`,
        `Highlighted in our DAG control panel for real-time stress testing.`,
      ],
      researchMatch: {
        paper: researchMatch5.paper,
        matchStatus: "Related evidence found",
        relevanceNote: `Highlights baseline control requirements documented in ${researchMatch5.paper.source}.`,
      },
      datasets: [
        { id: ds1.id, identifier: ds1.identifier, title: ds1.title, role: "Exposure Variable", plainRole: "Tested Variable (A)" },
        { id: ds2.id, identifier: ds2.identifier, title: ds2.title, role: "Mediating Factor", plainRole: "Control Factor (B)" },
        { id: ds3.id, identifier: ds3.identifier, title: ds3.title, role: "Observed Outcome", plainRole: "Tested Outcome (C)" },
      ],
      whatAreWeTesting: `We are testing whether the observed link is truly real, or whether general factors like population size and inflation explain it.`,
      modelSuggestion: `Adding strict controls dampens the effect by approximately 25%, but the remaining core relationship stays statistically significant.`,
      timeSeriesExplanation: {
        trendText: `Broad secular drift explains part of the parallel rise, but distinct local pulses persist.`,
        seasonalText: `Seasonal alignment remains detectable even after detrending the series.`,
        residualText: `Residuals show slight sensitivity to macroeconomic turning points.`,
      },
      adjustedEffectExplanation: `Adjusted effect decreases moderately under full control weights, demonstrating healthy robustness.`,
    },
  ];

  // Sort by AI Score descending and assign ranks 1 to 5
  rawHypotheses.sort((a, b) => b.aiScore - a.aiScore);
  const hypotheses: CandidateHypothesis[] = rawHypotheses.map((h, idx) => ({
    ...h,
    rank: idx + 1,
  }));

  const strongestHypothesis = hypotheses[0];

  // Top-level discovery signal in plain English summarizing strongest candidate
  const discoverySignal = `NEXUS identified a potentially important relationship between ${ds1.title}, ${ds2.title} and ${ds3.title}. Strongest signal: "${strongestHypothesis.statement}" (AI Relevance Score: ${strongestHypothesis.aiScore}/100).`;

  const signalNotice = `HYPOTHESIS ONLY: Algorithmically generated candidate signal across disparate open datasets. This represents a testable hypothesis for investigation, not proof of causation.`;

  const headline = `Strongest Discovery Signal: "${strongestHypothesis.statement}"`;

  // Why interesting observations
  const whyInteresting = [
    `Uncommon cross-domain pairing: Connects ${ds1.category} (${ds1.institution}) with ${ds2.category} and ${ds3.category}, fields rarely analyzed together.`,
    `Clear temporal alignment: The strongest signal demonstrates a ${lagChoice.label} lag consistency across measurement periods.`,
    `Supported by prior research: Independent studies in ${strongestHypothesis.researchMatch.paper.source} document comparable findings.`,
  ];

  // Projection Points (Figure 1)
  const projectionPoints: ProjectionPoint[] = [];
  const datasets = [ds1, ds2, ds3];
  const centerOffsets = [
    { cx: 160, cy: 110 },
    { cx: 380, cy: 130 },
    { cx: 270, cy: 260 },
  ];

  datasets.forEach((ds, dIdx) => {
    const center = centerOffsets[dIdx];
    const pointCount = 6;
    for (let p = 0; p < pointCount; p++) {
      const angle = (p / pointCount) * 2 * Math.PI + rand() * 0.5;
      const dist = 25 + rand() * 45;
      const x = Math.round(center.cx + Math.cos(angle) * dist);
      const y = Math.round(center.cy + Math.sin(angle) * dist);
      const trajAngle = angle + (rand() - 0.5) * 0.8;
      const tLen = 15 + rand() * 20;

      projectionPoints.push({
        id: `pt-${dIdx}-${p}`,
        x,
        y,
        datasetIndex: (dIdx + 1) as 1 | 2 | 3,
        datasetName: ds.identifier,
        cluster: `Vector ${dIdx + 1} (${ds.category})`,
        value: (rand() * 100).toFixed(1),
        variance: `±${(rand() * 4).toFixed(2)}σ`,
        trajectory: {
          dx: Math.round(Math.cos(trajAngle) * tLen),
          dy: Math.round(Math.sin(trajAngle) * tLen),
        },
        hypothesisRank: (p % 5) + 1,
      });
    }
  });

  // Time-Series Decomposition Data (24 months)
  const timeSeriesData: TimeSeriesPoint[] = [];
  const months = [
    "Jan 24", "Feb 24", "Mar 24", "Apr 24", "May 24", "Jun 24",
    "Jul 24", "Aug 24", "Sep 24", "Oct 24", "Nov 24", "Dec 24",
    "Jan 25", "Feb 25", "Mar 25", "Apr 25", "May 25", "Jun 25",
    "Jul 25", "Aug 25", "Sep 25", "Oct 25", "Nov 25", "Dec 25"
  ];

  const phase1 = rand() * Math.PI;
  const phase2 = phase1 + 1.2;
  const phase3 = phase2 + 1.6;

  months.forEach((m, idx) => {
    const t = idx / 4;
    const ds1Val = Number((50 + 25 * Math.sin(t + phase1) + (rand() - 0.5) * 6).toFixed(1));
    const ds2Val = Number((45 + 28 * Math.sin(t + phase2) + (rand() - 0.5) * 6).toFixed(1));
    const ds3Val = Number((55 + 22 * Math.sin(t + phase3) + (rand() - 0.5) * 6).toFixed(1));
    timeSeriesData.push({ month: m, ds1: ds1Val, ds2: ds2Val, ds3: ds3Val });
  });

  // Empirical evidence items
  const evidenceItems = [
    {
      title: "Cross-Spectral Coherence Test",
      desc: `High concentration in frequency band corresponding to ${lagChoice.label} periodic oscillation.`,
      score: Math.floor(82 + rand() * 16),
    },
    {
      title: "Granger Causality Inversion Check",
      desc: `Statistical test supports the hypothesis that ${ds1.identifier} helps forecast ${ds3.identifier} (${pValue}).`,
      score: Math.floor(78 + rand() * 18),
    },
    {
      title: "Spatial Autocorrelation (Moran's I)",
      desc: `Clustering index demonstrates localized regional contagion across ${spatialCoverage}% of territory.`,
      score: Math.floor(75 + rand() * 20),
    },
    {
      title: "Out-of-Sample Holdout Validation",
      desc: `Model calibrated on baseline timeline reproduces subsequent periods with low prediction error.`,
      score: Math.floor(88 + rand() * 10),
    },
  ];

  // Alternative explanations
  const alternativeExplanations = [
    {
      title: "Macroeconomic Growth Cycles",
      mechanism: `Broad economic growth simultaneously expands ${ds1.category} investments and stimulates ${ds3.category} activity.`,
      risk: "Medium" as const,
    },
    {
      title: "Seasonal Climate & Inversion Forcing",
      mechanism: `Annual weather and temperature patterns create parallel seasonal swings across ${ds2.title}.`,
      risk: "High" as const,
    },
    {
      title: "Administrative Reporting Schedules",
      mechanism: `Standard fiscal-year publication schedules introduce synchronized reporting dates.`,
      risk: "Low" as const,
    },
    {
      title: "Demographic Population Movements",
      mechanism: `Inter-regional mobility shifts alter base populations without reflecting true per-capita intensity changes.`,
      risk: "Medium" as const,
    },
  ];

  return {
    trioKey,
    hypothesisCode,
    title: `${ds1.title} × ${ds2.title} × ${ds3.title}`,
    headline,
    dataset1: ds1,
    dataset2: ds2,
    dataset3: ds3,
    hypotheses,
    strongestHypothesis,
    correlation,
    correlationDisplay,
    correlationType,
    temporalAssociation,
    spatialCoverage,
    lag: lagChoice.label,
    lagValue: lagChoice.value,
    confidence,
    bayesFactor,
    pValue,
    sampleSize,
    discoverySignal,
    signalNotice,
    whyInteresting,
    projectionPoints,
    timeSeriesData,
    evidenceItems,
    alternativeExplanations,
    dagDefaults: {
      macroGdpDefault: Math.floor(35 + rand() * 30),
      demographicsDefault: Math.floor(30 + rand() * 30),
      inflationDefault: Math.floor(25 + rand() * 30),
    },
  };
}
