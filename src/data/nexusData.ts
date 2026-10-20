export interface Hypothesis {
  id: string;
  code: string;
  title: string;
  headline: string;
  status: "UNDER INVESTIGATION" | "VALIDATED" | "UNDER REVIEW" | "HYPOTHESIS" | "INCONCLUSIVE";
  bayesFactor: number;
  bayesRating: string;
  correlation: string;
  correlationType: "Pearson" | "Spearman" | "OLS";
  pValue: string;
  sampleSize: string;
  sources: string[];
  leadInvestigator: string;
  institution: string;
  verificationHash: string;
  updatedTime: string;
  formula: string;
  rSquared: number;
  ci95: string;
  residualStdErr: number;
  methodologyNote: string;
  causalChain: {
    exposure: {
      name: string;
      source: string;
      desc: string;
      cadence: string;
      coverage: string;
      qa: string;
    };
    lag: {
      duration: string;
      tau: number;
    };
    outcome: {
      name: string;
      icdCodes: string;
      desc: string;
      admissions: string;
      ageCut: string;
      resolution: string;
    };
    socioeconomic: {
      name: string;
      source: string;
      desc: string;
      threshold: string;
    };
  };
}

export interface Anomaly {
  id: string;
  code: string;
  title: string;
  status: "VALIDATED" | "UNDER REVIEW" | "HYPOTHESIS";
  summary: string;
  correlation: string;
  metricType: string;
  sources: string[];
  category: string;
  timestamp: string;
}

export interface RepositoryDataset {
  id: string;
  identifier: string;
  title: string;
  institution: string;
  category: "Atmospheric" | "Epidemiological" | "Geophysical" | "Economic" | "Hydrological" | "Demographic" | "Defence" | "Education";
  frequency: string;
  throughput: string;
  latencyMs: number;
  checksum: string;
  status: "STABLE" | "SYNCING" | "VERIFIED";
  recordsCount: string;
  coverage: string;
  format: "HDF5" | "NetCDF-4" | "Parquet" | "GeoTIFF" | "CSV";
  spatialResolution: string;
  description: string;
  researchUrl: string;
}

export interface EvidenceAudit {
  id: string;
  hypothesisCode: string;
  title: string;
  leadInvestigator: string;
  division: string;
  bayesFactor: number;
  methodologyScore: number;
  reproducibilityScore: number;
  pValue: string;
  status: "VERIFIED" | "CONDITIONAL" | "REPLICATION REQUIRED";
  verificationHash: string;
  timestamp: string;
  confoundersIsolated: string[];
  peerSignoffs: {
    name: string;
    role: string;
    institution: string;
    status: "SIGNED" | "PENDING";
    date: string;
  }[];
}

export const NEXUS_METRICS = {
  datasetsIndexed: 247,
  datasetsIndexedGrowth: "+14 this month",
  activeHypotheses: 18,
  activeHypothesesDesc: "Triangulating multi-vector statistical anomalies and cross-lag spatial metrics.",
  underInvestigation: 18,
  underInvestigationDesc: "Replication pipelines, confounder pruning & causal DAG mapping in progress.",
  verifiedDiscoveries: 37,
  verifiedDiscoveriesDesc: "Empirically substantiated or published via open peer-reviewed indices.",
  globalLatency: 14.0,
  seedHash: "0x89F4C2",
  correlationsIndexed: 1382,
  clusterDensity: 0.742,
  activeEdges: 18,
  systemStatus: "NOMINAL",
};

export const REPOSITORIES: RepositoryDataset[] = [
  {
    id: "ds-sipri-milex",
    identifier: "SIPRI-MILEX-GLOBAL",
    title: "Military Expenditure Database (SIPRI)",
    institution: "Stockholm International Peace Research Institute",
    category: "Defence",
    frequency: "ANNUAL UPDATE",
    throughput: "14.2 MB/s",
    latencyMs: 18.4,
    checksum: "SHA256: 7f3b..9812",
    status: "STABLE",
    recordsCount: "68K Country-Years",
    coverage: "1949–2024",
    format: "CSV",
    spatialResolution: "National / Regional",
    description: "Consistent time series on defence expenditure of 170+ countries according to standard definitions.",
    researchUrl: "https://www.sipri.org/databases/milex",
  },
  {
    id: "ds-unesco-uis",
    identifier: "UNESCO-UIS-HIGHERED",
    title: "Tertiary Education & Research Capacity (UNESCO)",
    institution: "UNESCO Institute for Statistics",
    category: "Education",
    frequency: "SEMESTER BATCH",
    throughput: "24.6 MB/s",
    latencyMs: 16.2,
    checksum: "SHA256: 8a1e..4431",
    status: "STABLE",
    recordsCount: "1.4M Student Cohorts",
    coverage: "1970–2024",
    format: "Parquet",
    spatialResolution: "NUTS-2 / Sub-national",
    description: "Gross enrollment ratio in tertiary education, graduation demographics, and public university R&D budgets.",
    researchUrl: "https://uis.unesco.org",
  },
  {
    id: "ds-ilo-youth",
    identifier: "ILO-YOUTH-EMPLOYMENT",
    title: "Youth Labor Force & NEET Rates (ILOSTAT)",
    institution: "International Labour Organization",
    category: "Economic",
    frequency: "QUARTERLY SYNC",
    throughput: "31.8 MB/s",
    latencyMs: 12.5,
    checksum: "SHA256: 9b2c..01ef",
    status: "STABLE",
    recordsCount: "820K Series",
    coverage: "1990–2025",
    format: "CSV",
    spatialResolution: "Labor Market Centroids",
    description: "Labor market participation, apprenticeship absorption, and NEET (neither in employment, education, or training) rates.",
    researchUrl: "https://ilostat.ilo.org",
  },
  {
    id: "ds-ecmwf-cams",
    identifier: "ECMWF-CAMS-PM25",
    title: "Copernicus Atmosphere PM2.5 Surface Reanalysis",
    institution: "European Centre for Medium-Range Weather Forecasts",
    category: "Atmospheric",
    frequency: "1-HOUR CADENCE",
    throughput: "94.2 MB/s",
    latencyMs: 14.5,
    checksum: "SHA256: 91c4..b008",
    status: "STABLE",
    recordsCount: "1.2B Grid Points",
    coverage: "2003–Present",
    format: "HDF5",
    spatialResolution: "0.1° × 0.1° Grid",
    description: "Continuous global atmospheric composition analysis, optical depths, and ground-level fine particulate matter (PM2.5).",
    researchUrl: "https://atmosphere.copernicus.eu",
  },
  {
    id: "ds-who-gho",
    identifier: "WHO-GHO-CLINICAL",
    title: "Global Health Observatory Hospital Admissions",
    institution: "World Health Organization",
    category: "Epidemiological",
    frequency: "DAILY BATCH",
    throughput: "18.6 MB/s",
    latencyMs: 24.1,
    checksum: "SHA256: e82a..003c",
    status: "STABLE",
    recordsCount: "84M Reports",
    coverage: "1990–Present",
    format: "Parquet",
    spatialResolution: "Member State Clusters",
    description: "Emergency inpatient visits, acute respiratory distress syndrome indices, and age-stratified triage metrics.",
    researchUrl: "https://www.who.int/data/gho",
  },
  {
    id: "ds-usgs-water",
    identifier: "USGS-NWIS-NITRATE",
    title: "National Water Information System (NWIS Nitrate)",
    institution: "U.S. Geological Survey",
    category: "Hydrological",
    frequency: "1-HOUR INTERVAL",
    throughput: "42.8 MB/s",
    latencyMs: 12.0,
    checksum: "SHA256: f0e3..47bb",
    status: "STABLE",
    recordsCount: "310M Measurements",
    coverage: "1980–Present",
    format: "Parquet",
    spatialResolution: "13,500 Gaging Stations",
    description: "Real-time dissolved nitrate, streamflow velocity, turbidity, and chemical runoff metrics across regional watersheds.",
    researchUrl: "https://waterdata.usgs.gov/nwis",
  },
  {
    id: "ds-noaa-goes",
    identifier: "NOAA-GOES-EAST-R",
    title: "Geostationary Space Weather & Storm Indices (GOES-16)",
    institution: "U.S. National Oceanic & Atmospheric Admin",
    category: "Atmospheric",
    frequency: "15 MIN INTERVAL",
    throughput: "142.4 MB/s",
    latencyMs: 8.2,
    checksum: "SHA256: 3b9f..71d2",
    status: "STABLE",
    recordsCount: "482M Scans",
    coverage: "2017–Present",
    format: "NetCDF-4",
    spatialResolution: "0.5km - 2.0km",
    description: "Magnetometer flux, solar flare irradiance, ionospheric electron density, and atmospheric radiance.",
    researchUrl: "https://www.star.nesdis.noaa.gov/goes",
  },
  {
    id: "ds-cern-cms",
    identifier: "CERN-OPEN-DATA-CMS",
    title: "CMS Run-2 Collision Energy Traces",
    institution: "European Organization for Nuclear Research",
    category: "Geophysical",
    frequency: "MONTHLY STREAM",
    throughput: "512.0 MB/s",
    latencyMs: 64.2,
    checksum: "SHA256: dc41..3219",
    status: "STABLE",
    recordsCount: "4.2B Traces",
    coverage: "2015–2018",
    format: "HDF5",
    spatialResolution: "Subatomic Detectors",
    description: "Reconstructed particle collision trajectories, energy deposits, and calorimeter trigger cluster topologies.",
    researchUrl: "https://opendata.cern.ch",
  },
  {
    id: "ds-eurostat-nuts3",
    identifier: "EUROSTAT-NUTS3-INCOME",
    title: "Regional Household Income & Demographics",
    institution: "European Commission Eurostat",
    category: "Demographic",
    frequency: "WEEKLY SYNC",
    throughput: "8.1 MB/s",
    latencyMs: 31.0,
    checksum: "SHA256: a12d..88fa",
    status: "STABLE",
    recordsCount: "12M Records",
    coverage: "2000–2024",
    format: "CSV",
    spatialResolution: "NUTS Level 3",
    description: "Median household income, Gini coefficients, demographic age distributions, and regional population shifts.",
    researchUrl: "https://ec.europa.eu/eurostat/data/database",
  },
  {
    id: "ds-worldbank-macro",
    identifier: "WORLDBANK-MACRO-WDI",
    title: "World Development Indicators (WDI GDP & Inflation)",
    institution: "The World Bank Group",
    category: "Economic",
    frequency: "MONTHLY UPDATE",
    throughput: "22.4 MB/s",
    latencyMs: 19.8,
    checksum: "SHA256: 41ae..80cc",
    status: "STABLE",
    recordsCount: "5.5M Indicators",
    coverage: "1960–2024",
    format: "CSV",
    spatialResolution: "Sovereign States & Blocs",
    description: "Real GDP growth, consumer price deflators, capital formation, and structural trade balances.",
    researchUrl: "https://data.worldbank.org",
  },
  {
    id: "ds-cdc-wonder",
    identifier: "CDC-WONDER-MORTALITY",
    title: "CDC WONDER Public Health Mortality & Morbidity",
    institution: "U.S. Centers for Disease Control and Prevention",
    category: "Epidemiological",
    frequency: "MONTHLY CADENCE",
    throughput: "15.0 MB/s",
    latencyMs: 28.3,
    checksum: "SHA256: 22fb..19da",
    status: "STABLE",
    recordsCount: "24M Entries",
    coverage: "1999–2024",
    format: "Parquet",
    spatialResolution: "County FIPS Centroids",
    description: "Underlying and multiple causes of death, chronic autoimmune diagnostic codes, and public health microdata.",
    researchUrl: "https://wonder.cdc.gov",
  },
  {
    id: "ds-mta-transit",
    identifier: "MTA-GTFS-TRANSIT-DELAYS",
    title: "Metropolitan Subway Headway & Delay Telemetry",
    institution: "Metropolitan Transportation Authority",
    category: "Economic",
    frequency: "10-SECOND FEED",
    throughput: "36.2 MB/s",
    latencyMs: 9.1,
    checksum: "SHA256: 66e1..fa33",
    status: "STABLE",
    recordsCount: "840M Timestamps",
    coverage: "2020–2025",
    format: "Parquet",
    spatialResolution: "Station GPS Coordinates",
    description: "GTFS real-time headway variances, station dispatch micro-delays, and commuter turnstile volume feeds.",
    researchUrl: "https://data.mta.info",
  },
];

export const HYPOTHESES: Hypothesis[] = [
  {
    id: "hyp-089",
    code: "HYP-2025-0841",
    title: "Defence Expenditure vs Higher-Education & Youth Unemployment",
    headline: "Regions with higher defence expenditure growth show increased higher-education enrollment, followed by a decline in youth unemployment.",
    status: "UNDER INVESTIGATION",
    bayesFactor: 7.4,
    bayesRating: "MOD-HIGH",
    correlation: "0.64",
    correlationType: "Pearson",
    pValue: "p < 0.001",
    sampleSize: "n = 24 regional sets",
    sources: ["SIPRI Milex", "UNESCO UIS", "ILOSTAT"],
    leadInvestigator: "Dr. Elena Rostova",
    institution: "Department of Quantitative Political Economy",
    verificationHash: "SHA256: 7f3b-51ce-9812-4aa0-sipri-089",
    updatedTime: "18m ago",
    formula: "y = 1.24x + 18.5",
    rSquared: 0.64,
    ci95: "95% CI [0.52, 0.74]",
    residualStdErr: 0.12,
    methodologyNote: "Observed Correlation — Not Causation. Bradford Hill Heuristic Score: 38%. Requires instrumental variable identification to isolate defense procurement spillover from macroeconomic stimulus.",
    causalChain: {
      exposure: {
        name: "SIPRI Defence R&D Expenditure",
        source: "Stockholm International Peace Research Institute",
        desc: "Annual capital expenditure and STEM defense grant allocations.",
        cadence: "Annual / Regional",
        coverage: "1990–2024",
        qa: "Standardized Deflators",
      },
      lag: {
        duration: "+24m",
        tau: 0.482,
      },
      outcome: {
        name: "Youth Employment & Engineering Absorption",
        icdCodes: "ILO NEET Indicator Code 15-24",
        desc: "Graduation rate and transition to advanced technical employment.",
        admissions: "1.4M Graduating Cohorts",
        ageCut: "Ages 18–29",
        resolution: "NUTS-2 MSA Aggregation",
      },
      socioeconomic: {
        name: "UNESCO Tertiary Higher Education Enrollment",
        source: "UNESCO Institute for Statistics",
        desc: "Regional polytechnic and research university intake rates.",
        threshold: "Enrollment Ratio > 65%",
      },
    },
  },
  {
    id: "hyp-0619",
    code: "HYP-2025-0619",
    title: "Urban PM2.5 Particulate Surge vs Acute Respiratory Inpatient Visits",
    headline: "Urban PM2.5 particulate surge precedes acute respiratory inpatient admissions by 48 hours across 34 metro clusters.",
    status: "VALIDATED",
    bayesFactor: 18.2,
    bayesRating: "DECISIVE",
    correlation: "0.63",
    correlationType: "Pearson",
    pValue: "p < 0.0001",
    sampleSize: "n = 4,180",
    sources: ["Copernicus CAMS", "WHO Hospital Data", "Eurostat Demographics"],
    leadInvestigator: "Dr. Elena Rostova & Dr. Magnus Lindholm",
    institution: "Division of Atmospheric Epidemiology",
    verificationHash: "SHA256: 9d2a-88bc-410e-a3ef-cams-089",
    updatedTime: "1 day ago",
    formula: "y = 8.94x + 42.1",
    rSquared: 0.792,
    ci95: "95% CI [0.58, 0.67]",
    residualStdErr: 0.14,
    methodologyNote: "Replicated across 3 independent laboratory consortiums. Published in Nature Data (DOI: 10.1038/s41597-025-0199).",
    causalChain: {
      exposure: {
        name: "Copernicus CAMS Ambient PM2.5",
        source: "ECMWF Surface Grid",
        desc: "0.1° surface fine particulate matter mass concentrations.",
        cadence: "1-Hour Intervals",
        coverage: "2018–2024",
        qa: "L3 Calibrated",
      },
      lag: {
        duration: "+48h",
        tau: 0.412,
      },
      outcome: {
        name: "Acute Respiratory Hospital Admissions",
        icdCodes: "ICD-10 J40-J47 & J09-J18",
        desc: "Emergency admissions per 100,000 population.",
        admissions: "1.48M Records",
        ageCut: "Pediatric & Senior",
        resolution: "County Centroids",
      },
      socioeconomic: {
        name: "Household Income Tracts",
        source: "Eurostat NUTS-3",
        desc: "Median household poverty thresholds.",
        threshold: "Income < 200% Poverty Line",
      },
    },
  },
  {
    id: "hyp-0902",
    code: "HYP-2025-0902",
    title: "Agricultural Nitrate Runoff vs Regional Autoimmune Shift",
    headline: "Agricultural Nitrate Runoff correlates with regional autoimmune diagnosis shifts in rural groundwater basins.",
    status: "HYPOTHESIS",
    bayesFactor: 4.8,
    bayesRating: "MODERATE",
    correlation: "0.51",
    correlationType: "Spearman",
    pValue: "p = 0.003",
    sampleSize: "n = 6,240",
    sources: ["USGS Hydrology", "CDC WONDER"],
    leadInvestigator: "NEXUS DeepSynthesizer v4.8",
    institution: "Environmental Health Working Group",
    verificationHash: "SHA256: 12f4-7801-de09-5431-usgs-0902",
    updatedTime: "3 hours ago",
    formula: "y = 4.15x + 22.0",
    rSquared: 0.51,
    ci95: "95% CI [0.38, 0.62]",
    residualStdErr: 0.28,
    methodologyNote: "AI-generated candidate. Investigating soil type, pesticide covariance, and age demographic confounders.",
    causalChain: {
      exposure: {
        name: "USGS Streamflow Nitrate Concentration",
        source: "USGS NWIS",
        desc: "Dissolved nitrate/nitrite levels in drinking watershed intakes.",
        cadence: "1-Hour",
        coverage: "2016–2024",
        qa: "Certified Gaging",
      },
      lag: {
        duration: "+60d",
        tau: 0.312,
      },
      outcome: {
        name: "Autoimmune Diagnosis Prevalence",
        icdCodes: "ICD-10 E06 & K50-K51",
        desc: "Regional thyroiditis and inflammatory diagnoses per 10,000.",
        admissions: "420K Claims",
        ageCut: "Ages 18–64",
        resolution: "Watershed HUC-8",
      },
      socioeconomic: {
        name: "Water Treatment Plant Classification",
        source: "EPA SDWIS",
        desc: "Reverse osmosis vs conventional municipal filtration.",
        threshold: "Standard vs Advanced Filtration",
      },
    },
  },
];

export const ANOMALIES: Anomaly[] = [
  {
    id: "anom-1",
    code: "#142",
    title: "GEOMAGNETIC COUPLING",
    status: "VALIDATED",
    summary: "Solar Kp Geomagnetic Indices vs Substation Phase Variance (Trans-Nordic).",
    correlation: "r = +0.51",
    metricType: "PEARSON",
    sources: ["NOAA Space", "Svenska Kraftnät"],
    category: "Geophysical",
    timestamp: "12m ago",
  },
  {
    id: "anom-2",
    code: "#141",
    title: "COMMUTER DISPLACEMENT",
    status: "UNDER REVIEW",
    summary: "Subway Dispatch Micro-Delays vs Bodega Retail Point-of-Sale Velocity.",
    correlation: "r = -0.44",
    metricType: "SPEARMAN",
    sources: ["MTA GTFS", "NYC Small Biz Ledger"],
    category: "Urban Economics",
    timestamp: "38m ago",
  },
  {
    id: "anom-3",
    code: "#140",
    title: "WATERSHED BIO-MARKERS",
    status: "HYPOTHESIS",
    summary: "Agricultural Nitrate Runoff vs Regional Autoimmune Diagnosis Incidence.",
    correlation: "r = +0.39",
    metricType: "SPEARMAN",
    sources: ["USGS Water", "Medicare Claims"],
    category: "Epidemiology",
    timestamp: "1h ago",
  },
];

export const EVIDENCE_AUDITS: EvidenceAudit[] = [
  {
    id: "evid-089",
    hypothesisCode: "HYP-2025-0841",
    title: "Defence Expenditure Growth vs Higher Education & Youth Unemployment",
    leadInvestigator: "Dr. Elena Rostova",
    division: "Department of Quantitative Political Economy",
    bayesFactor: 7.4,
    methodologyScore: 92,
    reproducibilityScore: 96,
    pValue: "p < 0.001",
    status: "VERIFIED",
    verificationHash: "SHA256: 7f3b-51ce-9812-4aa0-sipri-089",
    timestamp: "2026-09-11 18:42 UTC",
    confoundersIsolated: [
      "National Defense R&D Lead Time & Procurement Waves",
      "Macroeconomic GDP & Sovereign Debt Growth Cycles",
      "Regional STEM Higher-Education Subsidies & Tuition Waivers",
      "Labor Market Structural Reform & Apprenticeship Absorption",
    ],
    peerSignoffs: [
      {
        name: "Prof. Henryk Kowalski",
        role: "Chair of Econometrics",
        institution: "Stockholm University",
        status: "SIGNED",
        date: "2026-09-10",
      },
      {
        name: "Dr. Simone Aris",
        role: "Senior Labor Economist",
        institution: "London School of Economics",
        status: "SIGNED",
        date: "2026-09-11",
      },
      {
        name: "Dr. Akira Tanaka",
        role: "Public Policy Data Fellow",
        institution: "University of Tokyo",
        status: "SIGNED",
        date: "2026-09-11",
      },
    ],
  },
];
