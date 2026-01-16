---
title: "KP5/NP3VI — Desecheo Island DXpedition"
description: "A 30-day remote-operated DXpedition to Desecheo Island (KP5), the 14th most wanted DXCC entity. First activation since 2009, using solar-powered Remote Deployment Units."
eventDate: 2026-01-12
endDate: 2026-02-11
timezone: "America/Puerto_Rico"
eventType: "external"
eventLink: "https://desecheo2026.com/kp5/"
featured: true
registrationRequired: false
tags: ["DXpedition", "DX", "HF", "rare DXCC", "remote operation", "FT8", "CW", "SSB"]
---

**Desecheo Island (KP5)** hasn't been activated since K5D in 2009. At 17 years dormant and ranked **14th most wanted** worldwide, it's a significant "All Time New One" (ATNO) opportunity. What makes this operation technically interesting is the approach: rather than a traditional expedition with operators living on-island, this is a **fully remote, unattended deployment** running 24/7 for 30 days.

## Why Remote? The Environmental Constraint

Desecheo is a 360-acre volcanic island 13 miles off Puerto Rico's west coast. Due to unexploded ordnance from its 1940-1964 use as an Air Force bombing range, the entire island is a **National Wildlife Refuge closed to the public**. After $5+ million in conservation work, it was declared free of invasive species in 2017 and now hosts endangered seabird colonies and endemic reptiles found nowhere else.

The U.S. Fish & Wildlife Service granted a Special Use Permit (41523-2025-03) for this operation—but only under strict biosecurity protocols. Traditional multi-week human occupation wasn't feasible. The solution: deploy self-contained radio systems, leave, and operate remotely.

## The Remote Deployment Units (RDUs)

The Manyana DX Foundation designed and built the RDUs for exactly this use case. Each unit is a self-contained station:

**Power System:**

- Solar array (expanded from 8 to 12 panels before deployment)
- Battery storage (~50% SOC maintained overnight)
- MPPT charge controller with telemetry
- No fossil fuels—continuous operation without generators

**RF System:**

- Two independent stations (Radio A, Radio B)
- Operating 10m through 40m (160m was tested but antenna tuning failed)
- FT8, CW, SSB modes
- Vertical antennas (limited real estate and environmental restrictions)

**Connectivity:**

- Starlink terminal for internet backhaul
- MQTT telemetry publishing real-time battery SOC, solar voltage/wattage, VFO frequency, and radio status
- Remote control via Remote Ham Radio (RHR) web console

**Monitoring:**

- Weather station on-site
- Remote camera feed
- Real-time environmental telemetry (temperature, humidity)

The RDUs were assembled and stress-tested at KP4AA's contest station in Cabo Rojo (visible from Desecheo) before deployment. The team went ashore on January 12, installed both units, and departed the same day.

## Remote Operation Architecture

Operators don't connect directly to the island. They log into **Remote Ham Radio's web console**, which provides:

- Panadapter/waterfall display
- VFO and mode control
- PTT via browser
- Direct FT8 decoding in the browser (no WSJT-X required client-side)
- Logging with automatic Club Log and LoTW upload

The RHR infrastructure handles the latency-sensitive audio/control path while the team's custom backend manages scheduling, operator queuing, and log integrity. About 20+ operators rotate through shifts, including both Puerto Rico locals and international participants.

This hybrid model—physical deployment with global remote operation—is positioned as a template for future activations of environmentally sensitive or access-restricted entities.

## Operation Details

- **Callsign:** KP5/NP3VI
- **Dates:** January 12 – February 11, 2026 (30 days)
- **Bands:** 160m*, 80m, 40m, 30m, 20m, 17m, 15m, 12m, 10m, 6m (*if conditions permit)
- **Modes:** CW, SSB, FT8
- **QSL:** M0OXO (LoTW uploads near real-time)

## Live Status

<a href="https://www.hamqsl.com/solar.html" target="_blank" rel="noopener noreferrer">
<img src="https://www.hamqsl.com/solar101vhf.php" alt="Solar-Terrestrial Data" style="max-width: 100%;">
</a>

- [Club Log Livestream](https://clublog.org/livestream/KP5/NP3VI) — real-time QSO map, band activity, rate
- [Live RDU Telemetry](https://desecheo2026.com/kp5/) — battery SOC, solar power, radio status
- [DX Cluster Spots](https://dxlite.g7vjr.org/?dx=KP5/NP3VI) — recent spots
- [PSK Reporter](https://pskreporter.info/pskmap.html?preset&callsign=KP5%2FNP3VI&txrx=tx) — FT8/FT4 reception reports
- DR2W Propagation: [20m daytime](https://propagation.dr2w.de/dxprop.php?area=n-america&band=20M&mode=1&time=18) · [40m nighttime](https://propagation.dr2w.de/dxprop.php?area=n-america&band=40M&mode=1&time=05)
- [VOACAP](https://desecheo2026.com/kp5/hf-propagation/) — propagation charts on expedition site

## Working KP5

The vertical antennas and 100W power limitation mean this isn't a big-signal expedition. EU/AF/AS stations are finding it challenging—propagation to a Caribbean island favors NA, and the antenna pattern is essentially omnidirectional with no gain.

FT8 will be your best bet when signals are marginal—the team runs a **multi-decoder** (software that can decode multiple FT8 signals simultaneously across the passband), so you don't need to be the loudest signal to get through. Before calling blind, check propagation predictions using the DR2W or VOACAP links above, and glance at the Club Log livestream to see what band and mode they're actually on.

And remember: 30 days is a long window. If conditions aren't cooperating today, they might tomorrow. **Work the gray line**—the twilight zone where sunrise or sunset creates enhanced propagation along the day/night boundary. Use a gray line map to find when your location and KP5 share this terminator. Watch for band openings by monitoring the livestream, DX clusters, or PSK Reporter to see when signals are getting through from your region. Don't burn yourself out in the first week.

## Background Reading

- [History of this DXpedition](https://desecheo2026.com/kp5/history/) — includes the conservation story and permitting process
- [Desecheo National Wildlife Refuge](https://www.fws.gov/refuge/desecheo) — USFWS site
- [DX-World coverage](https://www.dx-world.net/kp5-np3vi-desecheo-dxpedition/) — ongoing updates and pilot reports
- [Remote Ham Radio](https://www.remotehamradio.com/) — the remote operation platform
- [Manyana DX Foundation](https://manyanadx.org/) — RDU development
