'use client'

import Link from 'next/link'
import MotionReveal from '@/components/MotionReveal'
import BlogCTA from './BlogCTA'
import type { BlogPost, BlogContentBlock } from '@/data/blog'

function ContentBlock({ block }: { block: BlogContentBlock }) {
  switch (block.type) {
    case 'heading':
      if (block.level === 3) {
        return <h3 className="text-h3-mobile md:text-h3-desktop font-bold mt-8 mb-3">{block.text}</h3>
      }
      return <h2 className="text-h2-mobile md:text-h2-desktop font-bold mt-12 mb-4">{block.text}</h2>

    case 'paragraph':
      return <p className="text-gray-text leading-relaxed mb-6">{block.text}</p>

    case 'list':
      return (
        <ul className="space-y-3 mb-6 ml-1">
          {block.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-text">
              <span className="text-purple-accent mt-1.5 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      )

    case 'callout':
      return (
        <div className="bg-purple-light/20 border-l-4 border-purple-accent p-6 rounded-r-xl mb-6">
          <p className="text-gray-text leading-relaxed font-medium italic">{block.text}</p>
        </div>
      )

    case 'comparison-table':
      return (
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 bg-gray-100 font-semibold text-sm rounded-tl-lg" />
                <th className="text-center p-3 bg-gray-100 font-semibold text-sm">DIY / Wix</th>
                <th className="text-center p-3 bg-navy text-white font-semibold text-sm rounded-tr-lg">Custom (Pegrio)</th>
              </tr>
            </thead>
            <tbody>
              {block.rows?.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 text-sm font-medium text-gray-text">{row.label}</td>
                  <td className="p-3 text-sm text-center text-gray-muted">{row.col1}</td>
                  <td className="p-3 text-sm text-center font-medium text-gray-text">{row.col2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    default:
      return null
  }
}

export default function BlogArticle({ post }: { post: BlogPost }) {
  return (
    <article className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-muted mb-8">
        <Link href="/blog" className="hover:text-purple-accent transition-colors">Blog</Link>
        <span className="mx-2">›</span>
        <span>{post.category}</span>
      </nav>

      {/* Header */}
      <MotionReveal>
        <header className="mb-10">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-purple-accent bg-purple-light/40 px-2.5 py-1 rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-muted">
            <span>By {post.author}</span>
            <span>·</span>
            <span>{new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
        </header>
      </MotionReveal>

      {/* Content */}
      <MotionReveal>
        <div className="mb-12">
          {post.content.map((block, i) => (
            <ContentBlock key={i} block={block} />
          ))}
        </div>
      </MotionReveal>

      {/* CTA */}
      <BlogCTA ctaText={post.ctaText} ctaHref={post.ctaHref} />
    </article>
  )
}
