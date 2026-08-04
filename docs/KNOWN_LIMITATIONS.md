# Known limitations

- Map panels are illustrative placeholders (no map SDK).
- Excel import parses mock CSV / filename-driven fixtures, not a full spreadsheet engine.
- Ops documents are request-scoped; there is no global DMS browser.
- API repository path (`NEXT_PUBLIC_DATA_SOURCE=api`) throws until HTTP clients are implemented.
- Legacy `/customer` shells and unreachable Step 1 `/ops/*` children remain for early demos; prefer `/app/*` and `/operations/*`.
- Dense tables use pagination (not row virtualization) — sufficient for mock volumes.
- Voice input on the AI agent is mock UI only.
- Payment 3DS and carrier label/barcode PDFs are mock artifacts.
- Some ops secondary pages (partners, price lists, finance, reports) are functional but not full ERP depth.
