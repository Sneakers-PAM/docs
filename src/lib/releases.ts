// Browser-side types and grouping for src/data/releases.json. The Node
// script (scripts/releases/fetch.mjs, scripts/releases/model.mjs) does the
// GitHub fetch and validation that produces that file; this file only reads
// the checked result, so the pages can be fully typed.

export type InlineRun = {t: 'text' | 'code' | 'bold' | 'link'; v: string; href?: string};

export type NoteBlock =
  | {type: 'heading'; inline: InlineRun[]}
  | {type: 'paragraph'; inline: InlineRun[]}
  | {type: 'list'; items: InlineRun[][]};

export type ReleaseUnit = {unit: string; version: string};

export type Channel = 'stable' | 'rc' | 'pre-release';

export type Release = {
  repo: string;
  tag: string;
  name: string;
  channel: Channel;
  publishedAt: string;
  url: string;
  units: ReleaseUnit[];
  notes: NoteBlock[];
};

export type ReleaseWithVersion = Release & {version: string};

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'unknown';

export type Advisory = {
  repo: string;
  ghsaId: string;
  cveId: string | null;
  severity: Severity;
  summary: string;
  publishedAt: string;
  url: string;
  affected: {package: string; affected: string; fixed: string}[];
};

export type ReleasesData = {releases: Release[]; advisories: Advisory[]};

// Keep the unit list in sync with scripts/releases/model.mjs's UNITS.
export const UNITS: {id: string; label: string}[] = [
  {id: 'baseOS', label: 'Base OS'},
  {id: 'baseWeb', label: 'Base Web'},
  {id: 'product', label: 'Product'},
];

export type UnitSection = {id: string; label: string; entries: ReleaseWithVersion[]};

export function byUnit(releases: Release[]): UnitSection[] {
  return UNITS.map((u) => ({
    ...u,
    entries: releases
      .filter((r) => r.units.some((x) => x.unit === u.id))
      .map((r) => ({...r, version: r.units.find((x) => x.unit === u.id)!.version})),
  }));
}

export function latestByChannel(releases: Release[], repo: string): {stable?: ReleaseWithVersionLike; rc?: ReleaseWithVersionLike; latest?: ReleaseWithVersionLike} {
  const forRepo = releases.filter((r) => r.repo === repo);
  const stable = forRepo.find((r) => r.channel === 'stable');
  const rc = forRepo.find((r) => r.channel === 'rc');
  return {stable, rc, latest: stable ?? rc ?? forRepo[0]};
}

// A release as returned by latestByChannel: it may or may not have been
// through byUnit, so `version` isn't guaranteed — callers fall back to `tag`.
export type ReleaseWithVersionLike = Release & {version?: string};
