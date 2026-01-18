---
title: "Raspberry Pi APRS Gateway"
description: "Build an affordable APRS gateway using a Raspberry Pi and RTL-SDR"
section: "projects"
order: 10
toc: true
---

The Automatic Packet Reporting System (APRS) is a digital communications protocol for real-time tactical information exchange. This guide walks you through building your own APRS iGate using affordable components.

## Project Overview

An APRS iGate receives packets from local RF and forwards them to the APRS-IS network, allowing worldwide tracking and messaging.

### Components Required

- Raspberry Pi 3B+ or newer
- RTL-SDR dongle
- VHF antenna (tuned for 144.390 MHz in North America)
- Power supply
- SD card (16GB minimum)

### Estimated Cost

Total project cost: ~$75-100

## Software Stack

The gateway uses several open-source components:

- **Direwolf**: Software TNC/modem
- **aprx**: APRS iGate daemon
- **Raspberry Pi OS Lite**: Base operating system

## Installation Steps

### 1. Prepare Raspberry Pi

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y git build-essential cmake
```

### 2. Install RTL-SDR Drivers

```bash
sudo apt install -y rtl-sdr librtlsdr-dev
```

### 3. Build Direwolf

```bash
git clone https://github.com/wb2osz/direwolf
cd direwolf
mkdir build && cd build
cmake ..
make -j4
sudo make install
```

### 4. Configure APRS

Edit the configuration file to include your callsign and location:

```ini
MYCALL YOUR-CALL
IGSERVER noam.aprs2.net
IGLOGIN YOUR-CALL PASSWORD
```

## Performance Optimization

- Position antenna for maximum coverage
- Use low-loss coax cable
- Consider a bandpass filter to reduce interference
- Monitor system temperature

## Future Enhancements

Planned improvements:

- Web-based statistics dashboard
- Automatic antenna switching
- APRS digipeater functionality
- Weather station integration

## Resources

- [APRS.fi](https://aprs.fi) - Track your packets
- [Direwolf Documentation](https://github.com/wb2osz/direwolf)
- [APRS-IS Status](http://status.aprs2.net)
- [GitHub Repository](https://github.com/microhams/aprs-gateway)
