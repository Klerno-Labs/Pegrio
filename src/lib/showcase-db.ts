import { sql } from '@vercel/postgres'

export interface ShowcaseItem {
  id: string
  name: string
  niche: string
  description: string | null
  liveUrl: string | null
  githubRepo: string | null
  price: number | null
  status: string
  screenshots: string[] | null
  features: string[] | null
  techStack: string[] | null
  createdAt: string
}

export async function getPublicShowcaseItems(niche?: string): Promise<ShowcaseItem[]> {
  const { rows } = await sql`
    SELECT
      id, name, niche, description, live_url, github_repo,
      price, showcase_status, screenshots, features, tech_stack, created_at
    FROM showcase
    WHERE showcase_status = 'available'
    ORDER BY created_at DESC
  `

  const items: ShowcaseItem[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    niche: r.niche,
    description: r.description,
    liveUrl: r.live_url,
    githubRepo: r.github_repo,
    price: r.price,
    status: r.showcase_status,
    screenshots: r.screenshots,
    features: r.features,
    techStack: r.tech_stack,
    createdAt: r.created_at,
  }))

  if (niche && niche !== 'all') {
    return items.filter((i) => i.niche === niche)
  }

  return items
}

export async function getShowcaseItemById(id: string): Promise<ShowcaseItem | null> {
  const { rows } = await sql`
    SELECT
      id, name, niche, description, live_url, github_repo,
      price, showcase_status, screenshots, features, tech_stack, created_at
    FROM showcase
    WHERE id = ${id} AND showcase_status = 'available'
    LIMIT 1
  `

  if (rows.length === 0) return null

  const r = rows[0]
  return {
    id: r.id,
    name: r.name,
    niche: r.niche,
    description: r.description,
    liveUrl: r.live_url,
    githubRepo: r.github_repo,
    price: r.price,
    status: r.showcase_status,
    screenshots: r.screenshots,
    features: r.features,
    techStack: r.tech_stack,
    createdAt: r.created_at,
  }
}
