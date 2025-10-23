---
title: "Building Helical Resonator Filters for Field Day Isolation"
description: "A summary of practical HF helical resonator filters that can help isolate multiple 20-meter stations during Field Day operations."
author: "MicroHAMS"
date: 2025-10-21
heroImage: "/images/articles/helical-resonator-filter.jpg"
tags: ["field-day", "filters", "interference", "hf", "20-meters", "diy"]
featured: true
---

## Introduction

Operating multiple stations on the same HF band during Field Day presents unique challenges. With CW and SSB stations separated by only 100-150 kHz on 20 meters, conventional filtering methods often fall short. This article summarizes an innovative solution developed by **Clint Turner, KA7OEI**, who documented his construction and testing of helical resonator filters built from readily available materials.

**Original Articles by KA7OEI:**
- [A Helical Resonator to Help Isolation (June 2014)](https://ka7oei.blogspot.com/2014/06/a-helical-resonator-to-help-isolation.html)
- [Revisiting the 20 Meter Helical Resonator Filters (May 2019)](https://ka7oei.blogspot.com/2019/05/revisiting-20-meter-helical-resonator.html)

---

## The Challenge

When operating Field Day with separate 20-meter CW and SSB stations, several issues arise:

- **Receiver Overload**: Strong nearby signals can overwhelm receiver front ends, especially in modern direct-sampling SDR radios
- **Transmitter Noise**: Broadband noise from transmitters can blanket adjacent frequencies
- **Intermodulation Products**: Close-proximity operation creates IMD that degrades both stations
- **Insufficient Separation**: Even with antennas 300+ feet apart and careful orientation, interference persists

Traditional solutions like coaxial stubs and commercial bandpass filters designed for band-to-band isolation don't have sufficient "Q" to provide meaningful attenuation within the same band.

---

## The Solution: Paint Can Resonators

KA7OEI developed two complementary filter types using 1-gallon metal paint cans (approximately $25 each):

### 1. Band-Pass Filter (for CW/Digital Station)
- Tunable across the CW portion of 20 meters (14.02-14.08 MHz)
- Approximately 1 dB insertion loss at center frequency
- 6+ dB attenuation at 14.25 MHz
- Excellent out-of-band rejection (>50 dB on 40m, >25 dB on 15m)
- Handles 100 watts continuously

### 2. Band-Stop (Notch) Filter (for SSB Station)
- Tuned to reject CW frequencies (14.05 MHz)
- Minimal impact on SSB frequencies (14.15-14.35 MHz)
- 10-20 dB notch depth (depending on stub configuration)
- Connected via "Tee" connector to shunt unwanted energy

---

## Key Construction Details

### Materials
- **Enclosure**: 1-gallon metal paint cans (slightly undersized but functional for 20m)
- **Coil Former**: Glass peanut butter jar (~4" diameter, 7.5" tall)
- **Conductor**: #6 solid copper wire (or equivalent copper tubing)
- **Tuning**: Threaded rod with circuit board disk for capacitive tuning
- **Coupling**: Adjustable copper plates for capacitive coupling
- **Connectors**: SO-239 coaxial connectors

### Critical Design Elements

1. **Conductor Size Matters**: Initial attempts with #12 AWG wire provided only 3 dB attenuation at 100 kHz offset. Using #6 wire dramatically improved performance. Copper tubing (3/16" to 1/4" OD) would work equally well and be lighter.

2. **Mechanical Stability**: Paint cans are flimsy and require reinforcement with paneling disks to prevent detuning from vibration or handling.

3. **Tuning Range**: The coil is trimmed to resonate slightly above the target frequency, then the capacitive disk is lowered from the lid to tune the operating range.

4. **Coupling Adjustment**: The distance between capacitive coupling plates and the coil determines insertion loss and bandwidth. Over-coupling reduces loss but also reduces filtering effectiveness.

---

## Performance Measurements

Using a Vector Network Analyzer (VNA), KA7OEI characterized the filters in detail:

### Band-Pass Filter Response
- **14.05 MHz**: 0.75 dB loss, VSWR < 1.2:1
- **14.07 MHz**: 1.3 dB loss, VSWR < 1.5:1
- **14.15 MHz**: 3 dB loss
- **14.25 MHz**: >6 dB loss
- **14.35 MHz**: 9 dB loss

### Band-Stop Filter with 0.15λ Stub
- **Notch depth**: 10 dB at 14.05 MHz
- **Passband**: Minimal impact above 14.2 MHz
- **Asymmetry**: Less attenuation above the notch than below (favorable for SSB)

### Cascaded Notch Filters
Using two notch elements in series increased notch depth to 20+ dB with only slight increase in passband insertion loss.

---

## Practical Field Deployment

### Station Setup
1. **CW Station**: Band-pass filter in series with transceiver
   - Operator tunes the filter by watching reflected power
   - Covers ±15 kHz easily, rarely needs retuning during operation
   - Reduces broadband transmitter noise that could affect SSB station

2. **SSB Station**: Notch filter connected via "Tee" connector
   - Set to notch center of CW passband (14.05 MHz)
   - Practically invisible to SSB operation (14.15+ MHz)
   - Prevents CW station overload and reduces transmitter-generated noise at CW frequencies

### Real-World Results
The Utah Amateur Radio Club (UARC) has used these filters successfully at Field Day operations. When inter-station interference occurs (which varies year-to-year for unclear reasons), these filters completely eliminate or significantly reduce the problem while easily handling 100-watt transmitter output.

---

## Improvements and Future Development

KA7OEI identified several potential enhancements:

1. **Larger Enclosures**: 5-gallon buckets for 40 meters, or larger containers for 20 meters to improve unloaded Q
2. **Larger Conductors**: 1/4" or 3/8" copper tubing would reduce RF resistance
3. **Better Coil Former**: Skeletal polycarbonate form instead of glass jar for easier adjustment and lighter weight
4. **Adjustable Coupling**: External adjustment screws for coupling plates to eliminate disassembly
5. **Cascade Configuration**: Two band-pass elements in series for sharper skirts
6. **Stub Optimization**: Experimenting with different stub lengths and parallel L/C networks for improved asymmetry

---

## Important Notes

### Radio Compatibility
- Some radios produce significant "below-band" noise when transmitting. The TS-450's built-in antenna tuner, when enabled, provides an additional 15-40 dB attenuation of this noise.
- Certain radios (notably the IC-706 series) were found to be particularly susceptible to interference and are banned from UARC Field Day operations.

### Tuning Tools Required
- **Antenna analyzer**: To locate notch frequency
- **VSWR/wattmeter**: To tune band-pass filter for minimum reflected power
- **Optional VNA or NanoVNA**: For precise characterization and optimization

### Safety Considerations
- Paint cans are fragile even after reinforcement
- High RF voltages exist inside the resonator
- Proper grounding and bonding is essential

---

## Conclusion

KA7OEI's helical resonator filters demonstrate that effective same-band isolation is achievable with modest investment and workshop skills. While commercial cavity filters would offer better performance, these paint-can resonators provide a practical, field-tested solution for Field Day operations where CW and SSB stations must coexist on 20 meters.

The detailed documentation, including VNA measurements and practical deployment strategies, makes this an excellent starting point for clubs facing similar challenges. The design principles scale to other bands (though enclosure size becomes impractical below 20 meters), and the filters have proven reliable over multiple Field Day events.

### Learn More

For complete construction details, tuning procedures, and extensive measurement data, visit the original articles:

- **Part 1 (2014)**: [A Helical Resonator to Help Isolation](https://ka7oei.blogspot.com/2014/06/a-helical-resonator-to-help-isolation.html)
- **Part 2 (2019)**: [Revisiting the 20 Meter Helical Resonator Filters](https://ka7oei.blogspot.com/2019/05/revisiting-20-meter-helical-resonator.html)

**All content credit**: Clint Turner, KA7OEI  
**Blog**: [ka7oei.blogspot.com](https://ka7oei.blogspot.com/)

---

*This article is a summary and appreciation of KA7OEI's excellent work. All technical content and images are credited to the original author. Visit the source articles for full construction details, measurements, and additional insights.*
