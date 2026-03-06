import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getShowcaseItemById, getPublicShowcaseItems } from '@/lib/showcase-db'
import StoreItemDetail from '@/components/showcase/StoreItemDetail'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const item = await getShowcaseItemById(id)
  if (!item) return { title: 'Not Found' }

  const price = item.price ? `$${(item.price / 100).toLocaleString()}` : ''

  return {
    title: `${item.name} ${price ? `— ${price}` : ''} | Pegrio Store`,
    description: item.description || `Pre-built ${item.niche} website ready to launch. Built by Pegrio.`,
    openGraph: {
      title: `${item.name} | Pegrio Store`,
      description: item.description || `Pre-built ${item.niche} website available now.`,
      url: `https://www.pegrio.com/store/${item.id}`,
      images: item.screenshots?.[0] ? [{ url: item.screenshots[0] }] : undefined,
    },
  }
}

export default async function StoreItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = await getShowcaseItemById(id)
  if (!item) notFound()

  // Get related items (same niche, excluding current)
  const allItems = await getPublicShowcaseItems(item.niche)
  const related = allItems.filter((i) => i.id !== item.id).slice(0, 3)

  return <StoreItemDetail item={item} relatedItems={related} />
}
