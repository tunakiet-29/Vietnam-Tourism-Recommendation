# FP-Growth Recommendation Backend V1

Standalone FastAPI backend for the locked FP-Growth Recommendation V1 model.

## Architecture

```text
React frontend
      |
      | POST /recommend
      v
FastAPI backend
      |
      v
FP-Growth checkpoint
      |
      v
Pattern matching -> suffix backoff -> candidate ranking -> Top-K
```

The API does **not** rerun FP-Growth mining for each request. The checkpoint is loaded once at startup.

## Structure

```text
fpgrowth_recommendation_backend_v1/
├── app/
│   ├── __init__.py
│   └── main.py
├── models/
│   └── Vietnam_TourBookings_FPGrowth_Recommendation_V1_Checkpoint.pkl
├── tests/
│   └── test_api_contract.md
├── requirements.txt
└── README.md
```

## Setup (Windows PowerShell)

1. Copy the checkpoint from Google Drive into `models/`.
2. Create a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. Install dependencies:

```powershell
pip install -r requirements.txt
```

4. Start the API:

```powershell
uvicorn app.main:app --reload
```

Server: `http://127.0.0.1:8000`

Swagger: `http://127.0.0.1:8000/docs`

## API

### GET /health

Expected:

```json
{
  "status": "ok",
  "algorithm": "FP-Growth"
}
```

### GET /model-info

Checks that the checkpoint loaded and exposes locked model metadata.

### POST /recommend

Request:

```json
{
  "history": [
    "Đà Nẵng",
    "TP.HCM",
    "Nha Trang"
  ],
  "top_k": 5
}
```

Case 1 expected:
- `pattern_length = 3`
- `fallback = false`
- Top-5 = `Phú Quốc`, `Đà Lạt`, `Huế`, `Hạ Long`, `Sa Pa`

Case 2 request:

```json
{
  "history": [
    "Huế",
    "Hà Nội",
    "Đà Lạt"
  ],
  "top_k": 5
}
```

Case 2 expected:
- `pattern_used = ["Hà Nội", "Đà Lạt"]`
- `pattern_length = 2`
- `fallback = true`
- Top-5 = `Đà Nẵng`, `Hạ Long`, `TP.HCM`, `Sa Pa`, `Nha Trang`

## Current project boundary

- Apriori remains the report/benchmark baseline and is not loaded by this API.
- PrefixSpan is temporarily excluded from the Web pipeline.
- The current ranking policy is summed support, then matched pattern count, then max support, then destination name for deterministic tie-breaking.
- Destinations already present in the user's full history are excluded.
