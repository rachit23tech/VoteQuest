export interface User {
  id: number;
  username: string;
  email: string;
  state: string | null;
  total_score: number;
  created_at: string;
}

export interface VoterProfile {
  id: string;
  name: string;
  age: number;
  emoji: string;
  situation: string;
  detail: string;
  answer: 'online' | 'mail' | 'in-person';
  hint: string;
}

export interface RegistrationZone {
  id: 'online' | 'mail' | 'in-person';
  label: string;
  emoji: string;
  description: string;
  color: string;
}

export interface GameSession {
  id: number;
  user_id: number;
  state: string;
  current_level: number;
  progress_json: Record<string, unknown>;
  started_at: string;
  completed_at: string | null;
}

export interface Score {
  id: number;
  user_id: number;
  level: number;
  points: number;
  accuracy: number;
  time_taken: number;
  timestamp: string;
}

export interface Achievement {
  id: number;
  user_id: number;
  badge_name: string;
  description: string;
  unlocked_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  state: string;
  total_score: number;
}

export interface LevelResult {
  level: number;
  points: number;
  accuracy: number;
  time_taken: number;
  tier: string;
  correct: number;
  total: number;
  new_achievements: string[];
}

export interface ElectionData {
  id: number;
  state_code: string;
  state_name: string;
  registration_deadline: string;
  early_voting_start: string;
  early_voting_end: string;
  election_day: string;
  id_requirements: {
    strict_photo_id: boolean;
    accepted_ids: string[];
    notes: string;
  };
  accessibility_rules: {
    curbside_voting: boolean;
    language_assistance: string[];
    audio_ballots: boolean;
  };
}

export type ScoreTier = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

export const US_STATES: { code: string; name: string }[] = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
];
