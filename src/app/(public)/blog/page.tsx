import type { Metadata } from 'next'
import { blogPosts } from '@/data/blog'
import BlogCard from '@/components/blog/BlogCard'

export const metadata: Metadata = {
  title: 'Blog — Website Tips for Local Businesses | Pegrio',
  description: 'Practical advice on website design, pricing, and digital marketing for plumbers, restaurants, med spas, and local businesses in Houston and beyond.',
  openGraph: {
    title: 'Blog — Website Tips for Local Businesses | Pegrio',
    description: 'Practical advice on website design, pricing, and digital marketing for plumbers, restaurants, med spas, and local businesses in Houston and beyond.',
    url: 'https://www.pegrio.com/blog',
  },
  alternates: {
    canonical: 'https://www.pegrio.com/blog',
  },
}

export default function BlogPage() {
  return (
    <>
      <section className="bg-white pt-32 pb-16">
        <div className="container text-center">
          <h1 className="mb-4">Website Insights for Local Businesses</h1>
          <p className="text-gray-muted text-lg max-w-2xl mx-auto">
            Practical advice on website design, pricing, SEO, and what actually works for small businesses — from a team that builds them every day.
          </p>
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map(post => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
