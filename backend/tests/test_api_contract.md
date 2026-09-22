# API Test Checklist

## Health
- [ ] `GET /health` returns status `ok`.
- [ ] Algorithm is `FP-Growth`.

## Model
- [ ] `GET /model-info` loads the expected checkpoint.

## Case 1
Request:
```json
{"history":["Đà Nẵng","TP.HCM","Nha Trang"],"top_k":5}
```
Expected: length 3, fallback false, Top-5 `Phú Quốc`, `Đà Lạt`, `Huế`, `Hạ Long`, `Sa Pa`.

## Case 2
Request:
```json
{"history":["Huế","Hà Nội","Đà Lạt"],"top_k":5}
```
Expected: pattern `Hà Nội -> Đà Lạt`, length 2, fallback true, Top-5 `Đà Nẵng`, `Hạ Long`, `TP.HCM`, `Sa Pa`, `Nha Trang`.
