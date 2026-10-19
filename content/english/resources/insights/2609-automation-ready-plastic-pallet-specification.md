---
title: "Plastic Pallets for AGVs and AMRs: Define the Load Interface"
description: "Separate forked AGVs, pallet-lift AMRs, load-deck robots, and fixed automation before specifying pallet geometry, detection, transfer stations, and a loaded route trial."
layout: "resources/"
cover_image: "images/resources/2609-automation-ready-plastic-pallet-specification.webp"
cover_alt: "Plastic pallet moving through an automated warehouse interface"
categories: "articles"
tags: ["plastic pallet AGV", "AMR pallet interface", "autonomous forklift", "warehouse automation"]
reading: "8 min"
file_size: ""
date: 2026-04-14
lastmod: 2026-10-19
popular: false
---

“AGV/AMR compatible” is not a complete plastic-pallet specification. A forked autonomous truck approaches the pallet through fork openings. A pallet-lift robot may collect it through a dedicated lift-and-station arrangement. A load-deck robot supports a load through a defined surface or top module. Conveyors and AS/RS add different bottom-contact and transfer conditions again.

The buying decision is therefore not whether a pallet works with “automation” in general. It is whether one controlled pallet specification and unit load can be detected, collected, transported, transferred, and set down through the **actual automated route**.

## First identify the handling architecture

Ask the robot supplier or integrator to name the exact vehicle, attachment, software configuration, pick/drop station, and load interface. Do not convert one vendor example into a universal requirement.

| Architecture | Interface questions to resolve before the pallet RFQ |
|---|---|
| Forked AGV, autonomous pallet truck, or autonomous forklift | Required entry sides; fork length, thickness, width, spacing, lift height, and approach tolerance; underside ribs or runners; pallet-detection method; reference-pallet model; pick and set-down location |
| Pallet-lift AMR | Approved pallet size and support arrangement; lift or top-module contact; compatible pallet station or rack; centering and docking method; load restraint; clearance during pickup and travel |
| Load-deck or under-load mobile robot | Load surface or top-module envelope; supported footprint; centre-of-gravity limits; locating features; overhang; detection zones; how the pallet or carrier is secured and transferred |
| Conveyor, lift table, palletizer, shuttle, or AS/RS | Roller, chain, rail, or lift contact; transfer gaps; direction; leading edge; deflection at each support condition; sensor and stop positions |

The current published [ISO 3691-4:2023](https://www.iso.org/standard/83545.html) addresses safety requirements for driverless industrial trucks and their systems and lists AGVs, AMRs, automated carts, and under-cart vehicles among its examples. It also notes the importance of the operating zone. The ISO page says a revision is under development. This standard is not a pallet certificate and does not approve a pallet for a particular robot or warehouse.

Current equipment information illustrates why the architecture must be named. The [MiR600 specification](https://mobile-industrial-robots.com/products/robots/mir600/specifications) publishes a model-specific load surface, payload, positioning conditions, environment, and 3D cameras for pallet and obstacle detection. BALYO describes a different approach for its [REACHY autonomous reach truck](https://www.balyo.com/agv-reach-trucks/reachy): cameras beneath the forks compare what they see with a stored reference-pallet model and the system can adjust fork position. These are equipment examples, not endorsements or proof that an unspecified pallet will work.

## Build the interface file before comparing quotes

The buyer and integrator should freeze the route inputs first:

- robot, vehicle, attachment, firmware or relevant configuration, and responsible integrator;
- pallet drawing, required entry direction, critical openings, runners, feet, ribs, deck height, and supported areas;
- empty pallet mass plus the minimum, normal, and maximum unit-load envelope;
- load distribution, overhang, centre of gravity, containment, and anything that can move or hang into a detection zone;
- pickup, set-down, rack, conveyor, machine, and buffer-station drawings;
- required detection features, label or code positions, and surfaces that must remain visible;
- floor, slope, gap, temperature, water, oil, dust, washdown, and other route conditions within the equipment supplier’s permitted scope;
- stop rules, exception handling, manual recovery, quarantine, and change-control ownership.

Nominal footprint and catalog load rating are not enough. A 1200 × 1000 mm pallet can still fail the interface if the forks meet a rib, the load hides a required detection feature, the base is unsupported at a transfer, or the set-down tolerance is narrower than the combined pallet and system variation.

For manual and powered fork-entry dimensions, use the [fork-entry clearance record](/resources/insights/260713-plastic-pallet-fork-entry-clearance-test/) as a starting point. Where the route includes fixed conveyors, add the separate [conveyor bottom-contact checks](/resources/insights/2640-plastic-pallet-conveyor-bottom-contact-checks/). Passing one interface does not approve the other.

## Run a bounded loaded-route acceptance trial

The responsible equipment integrator, site safety team, and pallet buyer should agree the test method. Do not bypass protective fields, sensors, interlocks, rated limits, or the equipment manufacturer’s instructions.

1. **Freeze the candidate.** Record the pallet model or drawing revision, material option, reinforcements, load, robot and attachment configuration, stations, and route.
2. **Check the empty interface.** Confirm detection, approach, entry or support, lift, travel, transfer, and set-down without scraping, forced contact, unstable support, or an unplanned workaround.
3. **Repeat with representative loads.** Cover the approved load envelope and distribution. Include partial or off-centre loads only when they are expected and the integrator has defined a safe test condition.
4. **Observe every handoff.** Record pickup and placement error, fork or support contact, pallet deflection, load movement, detection misses, rejected cycles, stops, and manual recovery.
5. **Apply stop rules.** Hold the trial after unexplained contact, instability, damage, repeated detection failure, unsafe load movement, or operation outside the approved equipment envelope.
6. **Check production repeatability.** Translate the accepted critical dimensions and visual conditions into an [incoming inspection plan](/resources/insights/2617-plastic-pallet-incoming-inspection-plan/). A single good sample does not define later lots.

There is no universal sample count or six-week schedule. Set sample quantity and duration from production variation, route frequency, load cases, environmental exposure, and the evidence needed for a decision. The broader [plastic pallet pilot framework](/resources/insights/2604-plastic-pallet-pilot-program/) explains how to connect a route trial to lot repeatability without promising an arbitrary period.

## Record a narrow approval

A useful result says, for example, “approved for pallet drawing revision A, unit-load envelope B, robot and attachment configuration C, stations D–F, and listed entry directions.” It should also state excluded loads, stations, environments, and recovery methods.

Recheck the interface when the pallet drawing, resin option, reinforcement, mold, unit load, robot, attachment, software configuration, detection method, station, conveyor, rack, or route changes. A change does not automatically mean failure, but it ends the assumption that the old trial still covers the new condition.

## What to send with a pallet inquiry

Send the pallet footprint, required entry directions, load range and distribution, robot and attachment model, pickup and drop drawings, relevant photos or videos that you are allowed to share, environmental limits, quantity, and destination port. Baoheng Plastic can use the confirmed application, load, handling, and racking conditions to help compare available [plastic pallet structures](/products/pallets/) and prepare model information for the buyer’s integrator-led review. Final AGV/AMR and site approval remains specific to the exact equipment, pallet, load, and route.

Use the [inquiry form](/contact/) when you are ready to share that interface file.

