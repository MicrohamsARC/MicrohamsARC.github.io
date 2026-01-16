/**
 * Site Configuration
 * 
 * Centralized settings for the MicroHAMS site.
 * Import this wherever site-wide configuration is needed.
 */

export const siteConfig = {
  /** Site name for branding */
  name: 'MicroHAMS',
  
  /** Default IANA timezone for events and dates */
  timezone: 'America/Los_Angeles',
  
  /** Locale for formatting (BCP 47 language tag) */
  locale: 'en-US',
} as const;

/**
 * Date/time format configurations
 * 
 * Centralized format options for consistent display across the site.
 * Uses Intl.DateTimeFormat options for locale-aware formatting.
 */
export const dateTimeFormats = {
  /** Full date: "Tuesday, January 20, 2026" */
  dateLong: {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  } as Intl.DateTimeFormatOptions,
  
  /** Short date: "Jan 20, 2026" */
  dateShort: {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  } as Intl.DateTimeFormatOptions,
  
  /** Compact date (for cards): "Jan 20" */
  dateCompact: {
    month: 'short',
    day: 'numeric',
  } as Intl.DateTimeFormatOptions,
  
  /** Time: "6:00 PM" */
  time: {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  } as Intl.DateTimeFormatOptions,
  
  /** Time with timezone: "6:00 PM PST" */
  timeWithZone: {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  } as Intl.DateTimeFormatOptions,
  
  /** Full date and time: "Tuesday, January 20, 2026 at 6:00 PM" */
  dateTimeLong: {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  } as Intl.DateTimeFormatOptions,
} as const;

/**
 * Venue configurations
 * 
 * Define physical locations with all details needed for events.
 * Events can reference these by key (e.g., venue: 'building-31').
 */
export const venues = {
  'building-31': {
    name: 'Building 31, Microsoft Campus',
    address: '3730 163rd Ave NE, Redmond, WA 98052',
    latitude: 47.643592,
    longitude: -122.122402,
    timezone: 'America/Los_Angeles',
    /** Radio frequency for event coordination at this venue */
    coordFrequency: '146.580',
    /** Instructions shown to attendees */
    arrival: {
      intro: `**Get to know your fellow amateurs!** Before and after the meeting, 
it's common for people to bring items to talk about, ask questions, or just chat. 
Feel free to bring your dinner to enjoy during the program.`,
      escort: `We monitor the **2m alternate call channel**. 
If you need an escort, call when you arrive and wait near the entrance—someone will 
come get you. **Bring your HT** and help with this process!`,
      noRadio: `No radio? Join the Teams meeting and let us know in the chat that you need help.`,
    },
    directions: {
      sr520: `**From SR-520:** Exit NE 40th St, head east toward Lake Sammamish, 
turn right on 163rd Ave NE.`,
      belred: `**From Bel-Red Road:** Head west on NE 40th, turn left on 163rd Ave NE.`,
      parking: `**Parking:** Third left into surface lot between Buildings 31 & 32. 
Don't turn at the Building 31 sign as you are headed south; this will lead you to underground parking. 
If you need covered parking because it is raining and you have mobility issues or are bringing something
that can't get wet, let us know that in the online meeting chat so we can find you for escort. 
Your radio won't be heard from inside the garage.`,
    },
  },
  'puyallup-fairgrounds-pavilion': {
    name: 'Pavilion Exhibition Hall, Washington State Fair',
    address: '110 9th Avenue SW, Puyallup, WA 98372',
    latitude: 47.1841,
    longitude: -122.2937,
    timezone: 'America/Los_Angeles',
    coordFrequency: '146.82',
    arrival: {
      intro: `The Mike & Key Electronics Show & Swap Meet is held in the Pavilion Exhibition Hall at the Washington State Fairgrounds.`,
      escort: `Talk-in is available on **146.82/22 (PL 103.5)**.`,
      noRadio: ``,
    },
    directions: {
      attendees: `**Attendees:** Enter through the Gold Gate at S Meridian St and 9th SW (NW corner of Fairgrounds). Swap Meet is in the Pavilion. VE Testing is in the Expo Hall.`,
      sellers: `**Sellers:** Enter through the Orange Gate off Fairview Dr (east side of Fairgrounds). Exit through the Gold Gate off 9th SW (north side). Parking available in Gold Lot.`,
      parking: `**Parking:** Free parking available.`,
    },
  },
  // Add other venues as needed
} as const;

/**
 * Online meeting configurations
 * 
 * Define reusable virtual meeting setups.
 * Events can reference these by key (e.g., onlineMeeting: 'microhams-teams').
 */
export const onlineMeetings = {
  'microhams-teams': {
    platform: 'teams' as const,
    name: 'MicroHAMS Teams Meeting',
    link: 'https://teams.microsoft.com/meet/241220373306?p=O7s2qVODJ36Sc9qI9B',
    meetingId: '241 220 373 306',
    passcode: 'HU7v8Nr9',
    phoneNumber: '+1 425-707-5929,,65802745# (United States, Redmond)',
    tollFreeNumber: '(844) 304-5076,,65802745# (United States)',
    conferenceId: '658 027 45#',
    helpUrl: 'https://aka.ms/JoinTeamsMeeting?omkt=en-US',
    disclaimer: {
      recording: `This meeting will be recorded. By attending or participating, you agree to this policy, 
including waivers and consent to the use of your contributions and image, voice, 
and other mechanisms of participation.`,
      optOut: `You may opt-out from identification by muting audio, disabling video, and not 
contributing to chat. Remaining in the meeting constitutes consent regardless of 
stated intent.`,
    },
  },
  // Add other meeting configs as needed
} as const;

// Type exports for use in components and content schemas
export type VenueKey = keyof typeof venues;
export type OnlineMeetingKey = keyof typeof onlineMeetings;

/** Get venue config by key */
export function getVenue(key: string) {
  return venues[key as VenueKey];
}

/** Get online meeting config by key */
export function getOnlineMeeting(key: string) {
  return onlineMeetings[key as OnlineMeetingKey];
}

/** Get timezone for a venue, falling back to site default */
export function getVenueTimezone(venue?: string): string {
  if (venue && venue in venues) {
    return venues[venue as VenueKey].timezone;
  }
  return siteConfig.timezone;
}
