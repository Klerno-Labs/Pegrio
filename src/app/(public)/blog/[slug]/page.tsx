import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { getBlogPost, getAllBlogSlugs } from '@/data/blog'
import BlogArticle from '@/components/blog/BlogArticle'

export async function generateStaticParams() {
  return getAllBlogSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getBlogPost(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} | Pegrio Blog`,
    description: post.description,
    openGraph: {
      title: `${post.title} | Pegrio Blog`,
      description: post.description,
      url: `https://www.pegrio.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedDate,
      authors: [post.author],
    },
    alternates: {
      canonical: `https://www.pegrio.com/blog/${post.slug}`,
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)
  if (!post) notFound()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Pegrio LLC',
      url: 'https://www.pegrio.com',
    },
    datePublished: post.publishedDate,
    url: `https://www.pegrio.com/blog/${post.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.pegrio.com/blog/${post.slug}`,
    },
    isPartOf: {
      '@type': 'Blog',
      '@id': 'https://www.pegrio.com/blog',
      name: 'Pegrio Blog',
    },
  }

  return (
    <>
      <Script
        id={`blog-schema-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="bg-white pt-32 pb-16">
        <div className="container">
          <BlogArticle post={post} />
        </div>
      </section>
    </>
  )
}
