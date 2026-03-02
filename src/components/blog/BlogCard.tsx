'use client'

import Link from 'next/link'
import MotionReveal from '@/components/MotionReveal'
import type { BlogPost } from '@/data/blog'

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <MotionReveal>
      <article className="card flex flex-col h-full">
        <div className="p-6 flex flex-col flex-1">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-purple-accent bg-purple-light/40 px-2.5 py-1 rounded-full mb-4 self-start">
            {post.category}
          </span>

          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-lg font-bold text-gray-text hover:text-purple-accent transition-colors mb-3 leading-snug">
              {post.title}
            </h3>
          </Link>

          <p className="text-gray-muted text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
            {post.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-xs text-gray-muted">
              {new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {post.readingTime}
            </span>
            <Link
              href={`/blog/${post.slug}`}
              className="text-sm font-semibold text-purple-accent hover:text-purple-accent/80 transition-colors"
            >
              Read Article →
            </Link>
          </div>
        </div>
      </article>
    </MotionReveal>
  )
}
