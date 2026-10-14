# System Architecture

**PNG diagram:** [Open system-architecture.png](./system-architecture.png)

## Component overview

```mermaid
flowchart LR
    user["Traveler"]
    admin["Administrator"]
    browser["React frontend<br/>Vite"]
    api["FastAPI backend<br/>REST API"]
    auth["Authentication<br/>and authorization"]
    booking["Booking, tour<br/>and payment services"]
    rec_api["Recommendation API"]
    history["Travel history service"]
    model["Recommendation service<br/>in-memory FP-Growth itemsets"]
    training["Model training service"]
    scheduler["Application lifespan tasks<br/>retrain at startup, then hourly<br/>expire pending bookings periodically"]
    db[("SQLite database<br/>users, tours, schedules,<br/>bookings, payments")]
    csv[("Historical processed CSV<br/>completed customer trips")]
    checkpoint[("FP-Growth checkpoint<br/>backend/models/*.pkl")]
    vnpay["VNPay"]
    tunnel["Public callback URL<br/>(e.g. ngrok in local development)"]

    user --> browser
    admin --> browser
    browser <-->|"HTTP / JSON"| api

    api --> auth
    auth --> db
    api --> booking
    booking --> db

    api --> rec_api
    rec_api --> history
    history -->|"completed bookings for current user"| db
    history --> model
    rec_api -->|"history + top_k request"| model
    model -->|"ranked destinations"| rec_api
    api -->|"GET /model-info"| model

    browser -->|"create payment / redirect"| vnpay
    vnpay -->|"IPN callback"| tunnel
    tunnel -->|"GET /api/v1/payments/vnpay/ipn"| api
    api -->|"verify transaction, update payment and booking"| db
    vnpay -->|"return browser to frontend"| browser
    browser -->|"poll payment status"| api

    scheduler --> training
    training -->|"read historical transactions"| csv
    training -->|"read completed bookings, grouped by user"| db
    training -->|"mine frequent itemsets"| model
    training -->|"validate then atomically replace"| checkpoint
    checkpoint -->|"load at startup / activate after training"| model
    scheduler -->|"expire pending bookings"| db
```

## Key flows

### Recommendation and training

1. The authenticated recommendations endpoint reads the current user's completed-trip destinations from SQLite.
2. The recommendation service matches that history against the currently loaded FP-Growth itemsets and returns ranked destinations.
3. At application startup, and then after each training run plus one hour, the background task reads the historical CSV and completed bookings from SQLite.
4. The training service rebuilds the itemsets, validates the checkpoint, atomically replaces the `.pkl` file, and activates the new model in memory. A failed run leaves the previous checkpoint active.

The historical CSV is read as a training input; live completed bookings are read from the database. The training task does not append those bookings to the CSV.

### Payment

1. The frontend asks the backend to create a VNPay payment and redirects the traveler to VNPay.
2. VNPay sends an IPN callback to the backend. The backend validates the signature and amount, then marks the payment `PAID` and booking `CONFIRMED` for a successful transaction.
3. VNPay returns the browser to the frontend payment-result page, which polls the backend for the payment status. The return page itself does not confirm a payment.

## Preview in VS Code

1. Open this file in VS Code.
2. Open the Extensions view with **Ctrl+Shift+X**.
3. Search for **Markdown Preview Mermaid Support** and install it if the built-in Markdown preview does not render the diagram.
4. Reopen this file and select **Markdown: Open Preview to the Side** from the Command Palette (**Ctrl+Shift+P**). The shortcut **Ctrl+K**, then **V** also opens the preview to the side.

The extension is only needed to render the Mermaid diagram in the Markdown preview; it does not change or run the application.
