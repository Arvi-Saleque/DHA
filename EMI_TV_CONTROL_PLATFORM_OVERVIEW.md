# EMI TV Control Platform — Recommended Stack, Workflow, Challenges, and Budget

## 1) Recommended Model
Use a **hybrid approach**:
- **Device Owner (DPC)** for strong policy enforcement (app blocking, lock task/kiosk, uninstall resistance).
- **Stealth UX choices** (neutral app name, no launcher entry where possible) to reduce tampering by non-technical users.

This is stronger than a pure background-only app and operationally realistic for warehouse provisioning.

## 2) Suggested Tech Stack

### TV Agent (Android TV / Google TV)
- Kotlin app
- `DevicePolicyManager` (Device Owner policies)
- `Firebase Cloud Messaging` (remote commands)
- Foreground/background service for heartbeat + command handling
- Boot receiver for auto-start after reboot
- Local encrypted config/state storage

### Backend + Admin Dashboard
- API server (Node.js/TypeScript or equivalent)
- PostgreSQL/MySQL for contracts, customer records, repayment status, device mapping
- Redis (optional) for command queue + retry
- Admin web dashboard (React/Next.js)
- Audit log pipeline (all lock/unlock/policy actions)

### Provisioning / Operations
- ADB-based provisioning script (`provision.sh`)
- Per-device onboarding checklist
- Device-to-customer mapping + barcode/serial tracking

## 3) Warehouse Workflow (Per Fresh TV)
1. Power on a new TV device and complete basic wizard.
2. **Skip Google sign-in** during provisioning phase.
3. Enable developer options + ADB.
4. Run provisioning script:
   - connect ADB
   - install APK
   - set Device Owner
   - trigger first launch and registration
   - apply policy baseline
   - verify heartbeat/dashboard presence
5. Disable debugging/developer settings.
6. Reboot and verify auto-start.
7. Label, map to customer record, repack.

Typical throughput target after 2–3 days of staff training: ~10 minutes per TV.

## 4) Enforcement Workflow
- **Pre-due / soft reminder:** banners/messages.
- **Overdue stage 1:** persistent warnings.
- **Overdue stage 2:** app restrictions (selected apps/features).
- **Overdue stage 3:** full lock mode with payment instructions.
- **After payment confirmation:** remote unlock + policy reset.

## 5) Main Challenges You Should Expect
- **Device fragmentation:** OEM behavior differs; test each TV model before bulk rollout.
- **Provisioning mistakes:** Google account sign-in too early during provisioning can break Device Owner flow (requires reset).
- **Connectivity gaps:** lock/unlock depends on network availability and reliable retries.
- **Tampering risk:** advanced users may attempt reset/recovery paths.
- **Operational discipline:** staff training and strict SOP compliance are critical.
- **Legal/privacy risk:** contract language, explicit consent, and transparent disclosure are mandatory.
- **Support load:** customer support process must handle false lock/unlock and payment reconciliation issues.

## 6) Budget (Full Project, Typical MVP-to-Production Range)
- App (Android TV agent): **$3k–$8k**
- Backend APIs + dashboard: **$5k–$15k**
- Provisioning tooling + ops setup: **$1k–$3k**
- QA across device models: **$2k–$6k**
- Legal/compliance setup: **$1k–$5k**
- Initial infra + monitoring (first months): **$500–$2k**

**Estimated total:** ~**$12.5k–$39k** depending on scope, model coverage, and support quality.

## 7) Suggested Delivery Phases
1. **Discovery & policy design (1–2 weeks)**
2. **MVP build (4–8 weeks)**
3. **Pilot on small batch (2–4 weeks)**
4. **Scale-out with SOP hardening (ongoing)**

## 8) Non-Negotiables for Safe Operation
- Signed customer consent and EMI enforcement clauses
- Immutable audit logs for all remote actions
- Role-based access control for dashboard operators
- Emergency unlock path with SLA
- Clear dispute-resolution process
