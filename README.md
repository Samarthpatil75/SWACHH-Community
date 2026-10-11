# SWACHH Community
## Digital Campus Monitoring & Sustainability Dashboard
### An Initiative by The Green Club, ICEM

> **"Smarter Monitoring. Cleaner Campus. Greener Future."**

**SWACHH Community** is a modern, responsive, centralized digital platform built for **The Green Club, ICEM**. It moves campus operations from informal verbal complaints to a structured, verifiable facility monitoring and maintenance management system.

---

## 🌿 1. Core Pilot Monitoring Modules

The platform is designed around six dedicated campus facility areas:

1. **Dustbins and Waste Management** — Segregated waste stations (wet / dry / compost), overflow alerts, and collection clearance.
2. **Toilets and Sanitation** — Restroom hygiene checklists, plumbing repair orders, and soap/sanitary supply replenishment.
3. **Drinking Water Facilities** — Stainless steel RO water coolers, chilling performance, filter change dates, and nozzle sanitation.
4. **Water Tank Maintenance** — Overhead and service storage tanks, quarterly desludging schedules, and maintenance audit logs.
5. **General Campus Facilities** — Corridors, lighting fixtures, stairwells, and laboratory wash areas.
6. **Green Areas & Campus Cleanliness** — Central lawns, amphitheatre grounds, herbal garden, and outdoor litter hotspots.

---

## 👥 2. Role-Based Access Control

The platform enforces four operational roles:

| Role | Permissions & Operational Scope |
| :--- | :--- |
| **Student / Campus Reporter** | Browse facilities, scan QR stickers, submit 1-minute issue reports with photos (no mandatory sign-in barrier), receive unique reference IDs (`SW-2026-XXXX`), and track status. |
| **Green Club Member / Monitor** | Physical observation checklist audits, verify initial incoming student reports to filter false alarms, and conduct post-work verification audits before ticket closure. |
| **Housekeeping / Maintenance Staff** | Review assigned work orders, update status to *In Progress*, record work notes, log completed maintenance actions, and submit completion timestamps. |
| **College Administration / Lead Admin** | Complete operational authority: register facilities, configure campus zones, manage user permissions, assign tickets, set recurring schedules, review analytics, and export CSV reports. |

*A **Demonstration Role Switcher** is built into the header to allow administrators and evaluators to test all four role perspectives in live presentations.*

---

## 🚀 3. Technical Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4, Modern Accessible Palette (Deep forest green, fresh teal, alert amber, rose)
- **Icons & Visuals:** Lucide React
- **Data Visualizations:** Recharts (Bar charts, status pipelines, priority breakdowns)
- **QR Code Engine:** `qrcode.react` (High-density SVG generator with printable card template)
- **State & Storage:** Persistent client-first store (`LocalStorage` with instant re-seeding)
- **Backend Schema:** Full PostgreSQL DDL script located in [`supabase/schema.sql`](supabase/schema.sql) with Row Level Security (RLS) policies, foreign keys, and indexes ready for Supabase cloud deployment.

---

## 💻 4. Running the Project Locally

```bash
# Clone the repository and enter directory
cd c:\Samarth.pro\SWACHH_Community

# Install dependencies (if not already installed)
npm install

# Start Vite local development server
npm run dev

# Run production build check
npm run build
```

---

## 🗄️ 5. Supabase Production Database Setup

The database schema in `supabase/schema.sql` establishes 12 relational tables:
1. `profiles` — Linked to Supabase Auth with custom role enums.
2. `campus_zones` — Campus blocks, floors, and verified coordinates.
3. `facility_categories` — The 6 pilot modules.
4. `facilities` — Unique digital record per monitored campus asset.
5. `issue_reports` — Reported tickets with unique reference IDs (`SW-2026-XXXX`).
6. `issue_attachments` — Uploaded photographic evidence.
7. `inspections` — Physical checklist audits recorded by Green Club members.
8. `maintenance_schedules` — Automated recurring & one-time tasks.
9. `maintenance_records` — Verifiable proof of completed maintenance.
10. `issue_status_history` — Status transitions audit trail.
11. `activity_logs` — System-wide real-time audit feed.
12. `notifications` — Role-targeted alerts for overdue tasks and verifications.

To deploy on Supabase:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste the contents of `supabase/schema.sql` and click **Run**.

---

## 📋 6. Campus Pilot Requirements (For ICEM Administration)

As outlined in the initiative proposal, the initial pilot is limited to 5 selected zones (Avirat Block A [4 floors], Avirat Block B [4 floors], Cafe Dil Se & Maggie Point, Garden & Lawns, Library & Admin Cell) and requests support in:
1. Access to selected facilities for basic observation and data collection.
2. Coordination with housekeeping and maintenance supervisory staff.
3. Permission to place QR code identification stickers at approved locations.
4. Access to baseline operational schedules (water tank cleaning intervals, filter replacement dates).
5. Alignment with administrative reporting procedures.
6. Formal permission to conduct a limited campus pilot.

---

## 📄 7. Disclaimers & Integrity

- **Sample Demonstration Data:** All records currently in the pilot are visibly marked as demonstration sample data until authentic records are formally supplied by ICEM.
- **Physical Inspection Integrity:** Digital monitoring complements and supports physical maintenance but does not replace official institutional inspections or statutory water quality laboratory certifications.

---

*Initiative by **The Green Club, ICEM** — 2026*
