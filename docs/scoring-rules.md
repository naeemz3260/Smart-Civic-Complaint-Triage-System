# Priority Scoring Rules & Mathematical Formulation

## Formula

The composite priority score $P \in [0.0, 1.0]$ is computed as a weighted linear combination of four normalized sub-factors:

$$P = w_{\text{sev}} \cdot S + w_{\text{imp}} \cdot I + w_{\text{urg}} \cdot U + w_{\text{vuln}} \cdot V$$

where:
$$\sum w_i = 1.0$$

Default baseline weights in `config/city.yaml`:
- $w_{\text{sev}} = 0.35$ (Severity)
- $w_{\text{imp}} = 0.25$ (Impact)
- $w_{\text{urg}} = 0.25$ (Urgency)
- $w_{\text{vuln}} = 0.15$ (Vulnerability)

---

## Factor Definitions

### 1. Severity ($S \in [0.0, 1.0]$)
- Baseline category severity (e.g., Electricity = 0.90, Sewage = 0.85, Streetlight = 0.45).
- If safety override keywords match (e.g. "live wire", "open manhole"), severity is clamped to $1.0$.

### 2. Impact ($I \in [0.0, 1.0]$)
- Computed from cluster size and ward population density:
  $$I = \min\left(1.0, 0.4 \times \text{WardDensityRatio} + 0.15 \times \text{ClusterReportCount}\right)$$

### 3. Urgency ($U \in [0.0, 1.0]$)
- Reflects time-decay and escalation risks (e.g., active water flooding or live sparking).
- Exponential aging boost as SLA deadline nears.

### 4. Vulnerability ($V \in [0.0, 1.0]$)
- Calculated via Haversine distance lookup against `data/geo/landmarks.geojson`:
  - $\le 250$m from Hospital: $+0.30$
  - $\le 200$m from School: $+0.25$
  - $\le 100$m from Major Highway/Road: $+0.20$
  - Clamped to maximum $1.0$.
