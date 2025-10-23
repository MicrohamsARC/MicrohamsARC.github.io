---
title: "Antenna Theory Basics"
description: "Understanding fundamental antenna concepts for effective amateur radio operation"
section: "fundamentals"
order: 1
toc: true
---

Understanding antenna theory is crucial for successful amateur radio operations. This document covers the essential concepts every operator should know.

## Fundamental Concepts

### Wavelength and Frequency

The relationship between wavelength (λ) and frequency (f) is fundamental:

$$
\lambda = \frac{c}{f}
$$

Where c is the speed of light (≈ 300,000,000 m/s).

### Resonance

An antenna is resonant when its electrical length matches the operating frequency. For a half-wave dipole:

- Length ≈ 468 / frequency (MHz) in feet
- Length ≈ 142.65 / frequency (MHz) in meters

## Common Antenna Types

### Dipole

The half-wave dipole is the fundamental antenna type:

- Simple construction
- Omnidirectional in horizontal plane
- Feed impedance: ~72Ω

### Vertical

Vertical antennas offer low-angle radiation:

- Requires ground plane
- Better for DX contacts
- Smaller footprint

### Yagi

Directional beam antenna:

- High gain
- Narrow beamwidth
- Requires rotation

## Practical Considerations

### Height Above Ground

Antenna height significantly affects performance:

- HF antennas: 1/2 wavelength or higher
- VHF/UHF: Height is critical for line-of-sight

### Feed Line Selection

Choose appropriate coaxial cable:

| Type | Impedance | Loss @ 100MHz | Use Case |
|------|-----------|---------------|----------|
| RG-58 | 50Ω | 4.4 dB/100ft | Low power, short runs |
| RG-8X | 50Ω | 2.8 dB/100ft | General purpose |
| LMR-400 | 50Ω | 1.5 dB/100ft | High power, long runs |

## Testing and Tuning

### SWR Measurement

Standing Wave Ratio indicates antenna match:

- SWR 1:1 - Perfect match
- SWR < 1.5:1 - Acceptable
- SWR > 2:1 - Needs adjustment

Use an antenna analyzer for best results.

## References

- ARRL Antenna Book
- ON4UN's Low Band DXing
- Antenna Modeling Software (EZNEC, 4NEC2)
