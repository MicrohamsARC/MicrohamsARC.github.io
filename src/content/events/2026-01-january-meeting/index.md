---
title: "January Meeting: Modernizing the RF data path"
description: "This month's meeting topic asks the question, \"It's 2026 - why are we still using acoustic couplers?\" Digital software used in amateur radio often asks us to configure a microphone and a speaker to transport data to/from the radio. In the age of radios with high speed USB ports and Ethernet jacks, why are we still operating like it is 1979?"
author: "Brian Stucker, KB2S"
eventDate: 2026-01-20
startTime: "6:00 PM"
endTime: "8:30 PM"
venue: "building-31"
onlineMeeting: "microhams-teams"
eventType: "meeting"
registrationRequired: false
contactPerson: "Brian Stucker, KB2S"
featured: true
cover: "./cover.jpg"
coverAlt: "An acoustic coupler modem from the 1970s - the precursor to modern audio interfaces"
tags: ["VITA-49", "SDR", "digital modes", "WSJT-X", "I/Q transport", "timestamping", "sample synchronization"]
---

## Presentation

This month's member meeting asks the question:
> It's 2026 - why are we treating modern digital radios like old analog phone lines?

Why are we treating radios with bluetooth, wifi, high-speed USB ports and ethernet jacks like it's still 1979? Are we just settling for a software paradigm that relies on audio device drivers, virtual microphones & speakers to move data between our rig and our applications? If your browser couldn't reach a website, would you check your volume settings or what microphone it was using? This is the way amateur radio works today for most people and applications. Is that really the best we can do?

![Messy path](./squiggle.svg)

Brian, KB2S will deconstruct the sample path for two approaches: legacy USB audio and VITA-49 packet transport. We'll examine possible ways we might modernize this pipeline to eliminate unnecessary stages, improve timing precision, and build a transport layer that is built around sockets instead of jacks. Whether you're debugging your first FT8 setup or designing SDR protocols, bring your questions about how we got here and ideas on where we should consider for future ideas in this space.

## Meeting Schedule

**6:00 PM - Meeting Begins:**

- Show and Tell (bring your cool things!)
- Ham Help (bring your questions and challenges!)
- News and upcoming ham events and activities

**6:30 PM - Presentation:**

- Modernizing Amateur Radio Sample Transport by Brian Stucker, KB2S

