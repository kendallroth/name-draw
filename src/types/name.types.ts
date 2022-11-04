/** Base name functionality (can be extended) */
export interface Name {
  id: string;
  name: string;
}

export interface NameExclusions {
  exclusions: string[];
}

export type NameWithExclusions = Name & NameExclusions;

/** Secret matche between a giver and a recipient */
export interface GiverRecipient {
  giver: NameWithExclusions;
  recipient: NameWithExclusions;
}
