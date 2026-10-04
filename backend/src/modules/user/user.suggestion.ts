// src/modules/user/user.suggestion.ts

/**
 * ============================================================================
 * USER SUGGESTION SCORING ENGINE
 * ----------------------------------------------------------------------------
 * Given a "viewer" (the logged-in user) and a "candidate" (another user),
 * compute a relevance score based on shared attributes.
 *
 * Higher score = more relevant suggestion.
 *
 * Weights are tuned so that:
 *   - Mutual connections dominate (LinkedIn-style)
 *   - Same university/company is next (strong signal)
 *   - Shared fields/subFields matter (interests)
 *   - Location/role are tie-breakers
 * ============================================================================
 */

export interface SuggestionCandidate {
  id: string
  name: string
  accountType: string | null

  // User table
  fields: string[]
  subFields: string[]

  // Profile
  profession: string | null
  city: string | null
  state: string | null
  country: string | null
  avatarUrl: string | null
  userName: string | null
  bio: string | null
  educationInstitutions: string[]
  experienceOrganizations: string[]
}

export interface SuggestionViewer {
  id: string
  accountType: string | null
  fields: string[]
  subFields: string[]
  profession: string | null
  city: string | null
  state: string | null
  country: string | null
  educationInstitutions: string[]
  experienceOrganizations: string[]
}

export interface SuggestionScore {
  total: number
  reasons: string[]
}

/* ============================================================================
   WEIGHTS — tune here to change ranking behaviour
   ============================================================================ */

const WEIGHTS = {
  MUTUAL_CONNECTION: 10,
  SAME_UNIVERSITY: 5,
  SAME_COMPANY: 5,
  SAME_FIELD: 3,
  SAME_SUBFIELD: 2,
  SAME_PROFESSION: 2,
  SAME_CITY: 2,
  SAME_STATE: 1,
  SAME_COUNTRY: 1,
  SAME_ACCOUNT_TYPE: 1,
} as const

/* ============================================================================
   HELPERS
   ============================================================================ */

/** Case-insensitive, trimmed comparison */
function normalize(value: string | null | undefined): string {
  return String(value ?? '').trim().toLowerCase()
}

/** Count how many items from `a` exist in `b` (case-insensitive). */
function countOverlap(a: string[], b: string[]): number {
  if (!a?.length || !b?.length) return 0

  const setB = new Set(b.map(normalize).filter(Boolean))
  let count = 0

  for (const item of a) {
    const key = normalize(item)
    if (key && setB.has(key)) count++
  }

  return count
}

/** Return the overlapping items (for human-readable reasons). */
function getOverlap(a: string[], b: string[]): string[] {
  if (!a?.length || !b?.length) return []

  const setB = new Set(b.map(normalize).filter(Boolean))
  const out: string[] = []

  for (const item of a) {
    const key = normalize(item)
    if (key && setB.has(key)) out.push(item)
  }

  return out
}

/* ============================================================================
   MAIN SCORER
   ============================================================================ */

export function scoreCandidate(
  viewer: SuggestionViewer,
  candidate: SuggestionCandidate,
  mutualCount: number,
): SuggestionScore {
  let total = 0
  const reasons: string[] = []

  /* ---------- Mutual connections ---------- */
  if (mutualCount > 0) {
    total += mutualCount * WEIGHTS.MUTUAL_CONNECTION
    reasons.push(
      mutualCount === 1
        ? '1 mutual connection'
        : `${mutualCount} mutual connections`,
    )
  }

  /* ---------- Same university ---------- */
  const sharedUnis = getOverlap(
    viewer.educationInstitutions,
    candidate.educationInstitutions,
  )
  if (sharedUnis.length > 0) {
    total += sharedUnis.length * WEIGHTS.SAME_UNIVERSITY
    reasons.push(
      sharedUnis.length === 1
        ? `Studied at ${sharedUnis[0]}`
        : `Studied at ${sharedUnis.length} same institutions`,
    )
  }

  /* ---------- Same company ---------- */
  const sharedCompanies = getOverlap(
    viewer.experienceOrganizations,
    candidate.experienceOrganizations,
  )
  if (sharedCompanies.length > 0) {
    total += sharedCompanies.length * WEIGHTS.SAME_COMPANY
    reasons.push(
      sharedCompanies.length === 1
        ? `Works at ${sharedCompanies[0]}`
        : `Worked at ${sharedCompanies.length} same companies`,
    )
  }

  /* ---------- Same fields ---------- */
  const sharedFields = getOverlap(viewer.fields, candidate.fields)
  if (sharedFields.length > 0) {
    total += sharedFields.length * WEIGHTS.SAME_FIELD
    reasons.push(
      sharedFields.length === 1
        ? `Interested in ${sharedFields[0]}`
        : `${sharedFields.length} shared interests`,
    )
  }

  /* ---------- Same subFields ---------- */
  const sharedSubFields = getOverlap(
    viewer.subFields,
    candidate.subFields,
  )
  if (sharedSubFields.length > 0) {
    total += sharedSubFields.length * WEIGHTS.SAME_SUBFIELD
    reasons.push(
      sharedSubFields.length === 1
        ? `Skilled in ${sharedSubFields[0]}`
        : `${sharedSubFields.length} shared skills`,
    )
  }

  /* ---------- Same profession ---------- */
  if (
    viewer.profession &&
    candidate.profession &&
    normalize(viewer.profession) === normalize(candidate.profession)
  ) {
    total += WEIGHTS.SAME_PROFESSION
    reasons.push(`Works as ${candidate.profession}`)
  }

  /* ---------- Same city ---------- */
  if (
    viewer.city &&
    candidate.city &&
    normalize(viewer.city) === normalize(candidate.city)
  ) {
    total += WEIGHTS.SAME_CITY
    reasons.push(`Lives in ${candidate.city}`)
  }

  /* ---------- Same state ---------- */
  if (
    viewer.state &&
    candidate.state &&
    normalize(viewer.state) === normalize(candidate.state)
  ) {
    total += WEIGHTS.SAME_STATE
  }

  /* ---------- Same country ---------- */
  if (
    viewer.country &&
    candidate.country &&
    normalize(viewer.country) === normalize(candidate.country)
  ) {
    total += WEIGHTS.SAME_COUNTRY
  }

  /* ---------- Same account type (STUDENT / MENTOR) ---------- */
  if (
    viewer.accountType &&
    candidate.accountType &&
    normalize(viewer.accountType) === normalize(candidate.accountType)
  ) {
    total += WEIGHTS.SAME_ACCOUNT_TYPE
  }

  return { total, reasons }
}