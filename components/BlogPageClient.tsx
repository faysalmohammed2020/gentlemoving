"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useTransition,
  useCallback,
  useRef,
} from "react";
import Link from "next/link";
import Image from "next/image";

interface Blog {
  id: number;
  post_title: string;
  post_category: string;
  post_tags: string;
  createdAt: string;
  imageUrl: string;
  excerpt: string;
}

interface BlogResponse {
  data: Blog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** ✅ normalize any kind of relative image path safely for next/image */
const normalizeImageUrl = (src?: string) => {
  const fallback = "/placeholder-blog.svg";
  if (!src) return fallback;

  let s = String(src).trim();
  if (s.startsWith("http://") || s.startsWith("https://")) return s;

  s = s.replace(/^(\.\.\/)+/g, "/");
  s = s.replace(/^(\.\/)+/g, "/");
  if (!s.startsWith("/")) s = "/" + s;
  s = s.replace(/^\/public\//, "/");
  if (s === "/" || s.length < 2) return fallback;

  return s;
};

const BlogCardSkeleton: React.FC = React.memo(() => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse h-full flex flex-col">
    <div className="relative w-full h-52 bg-gray-200" />
    <div className="p-6 flex flex-col flex-grow gap-3">
      <div className="flex items-center gap-2">
        <div className="h-5 w-20 bg-gray-200 rounded-full" />
        <div className="h-5 w-14 bg-gray-200 rounded-full" />
      </div>

      <div className="h-7 w-4/5 bg-gray-200 rounded-lg mt-1" />

      <div className="space-y-2 mt-2">
        <div className="h-3 w-full bg-gray-200 rounded-md" />
        <div className="h-3 w-11/12 bg-gray-200 rounded-md" />
        <div className="h-3 w-9/12 bg-gray-200 rounded-md" />
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="h-3 w-24 bg-gray-200 rounded-full" />
        <div className="h-3 w-16 bg-gray-200 rounded-full" />
      </div>
    </div>
  </div>
));
BlogCardSkeleton.displayName = "BlogCardSkeleton";

const BlogCard: React.FC<{ post: Blog }> = React.memo(({ post }) => {
  const postDate = useMemo(
    () =>
      new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    [post.createdAt]
  );

  const safeImg = normalizeImageUrl(post.imageUrl);
  const tags = (post.post_tags || "")
    .split(",")
    .map(t => t.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <Link href={`/blog/${post.id}`} className="group block h-full">
      <article className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative w-full h-52 overflow-hidden">
          <Image
            src={safeImg}
            alt={post.post_title}
            fill
            loading="lazy"
            style={{ objectFit: "cover" }}
            className="group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Soft overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-80" />

          {/* Category badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest bg-white/95 text-indigo-700 px-3 py-1 rounded-full shadow-sm">
              {post.post_category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug group-hover:text-indigo-700 transition-colors line-clamp-2">
            {post.post_title}
          </h2>

          <p className="mt-3 text-gray-600 line-clamp-3 leading-relaxed flex-grow">
            {post.excerpt}...
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((t, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full hover:bg-indigo-50 hover:text-indigo-700 transition"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              {postDate}
            </span>

            <span className="inline-flex items-center gap-1 font-medium text-gray-700 group-hover:text-indigo-700 transition">
              Read more
              <span className="translate-x-0 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
});
BlogCard.displayName = "BlogCard";

export default function BlogPageClient({
  initialBlogs,
  initialMeta,
  postsPerPage,
}: {
  initialBlogs: Blog[];
  initialMeta: BlogResponse["meta"];
  postsPerPage: number;
}) {
  const initialPage = initialMeta.page || 1;

  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialMeta.totalPages || 1);

  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ✅ only skip fetch on FIRST render
  const didMountRef = useRef(false);

  // ✅ cache pages for instant back/forward
  const pageCacheRef = useRef<Map<number, Blog[]>>(new Map());
  pageCacheRef.current.set(initialPage, initialBlogs);

  const fetchPage = useCallback(
    async (page: number, controller: AbortController) => {
      setError(null);
      setPageLoading(true);

      try {
        const res = await fetch(
          `/api/blogpost?page=${page}&limit=${postsPerPage}`,
          { signal: controller.signal, cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch blogs");

        const json: BlogResponse = await res.json();

        pageCacheRef.current.set(page, json.data || []);

        startTransition(() => {
          setBlogs(json.data || []);
          setTotalPages(json.meta?.totalPages || 1);
        });

        // ✅ prefetch next page silently
        if (page < (json.meta?.totalPages || 1)) {
          fetch(`/api/blogpost?page=${page + 1}&limit=${postsPerPage}`, {
            cache: "no-store",
          })
            .then(r => r.json())
            .then((nextJson: BlogResponse) => {
              pageCacheRef.current.set(page + 1, nextJson.data || []);
            })
            .catch(() => {});
        }
      } catch (e: any) {
        if (e.name !== "AbortError") {
          console.error(e);
          setError("Failed to load articles. Please check your connection.");
        }
      } finally {
        setPageLoading(false);
      }
    },
    [postsPerPage, startTransition]
  );

  useEffect(() => {
    // ✅ first render skip
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    // ✅ serve from cache if exists
    const cached = pageCacheRef.current.get(currentPage);
    if (cached) {
      startTransition(() => setBlogs(cached));
      return;
    }

    const controller = new AbortController();
    fetchPage(currentPage, controller);
    return () => controller.abort();
  }, [currentPage, fetchPage, startTransition]);

  const paginate = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const maxVisiblePages = 3;
    if (totalPages <= 6)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= maxVisiblePages)
      return [1, 2, 3, "...", totalPages];
    if (currentPage > totalPages - maxVisiblePages)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  if (error) {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-red-200">
          <p className="text-xl font-semibold text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const showSkeletons = pageLoading || isPending;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-14 md:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero */}
        <header className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-widest uppercase">
            Insights & Updates
          </div>

          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Our Blogs
          </h1>

          <p className="mt-4 text-base md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Stay updated with our latest industry deep-dives, expert opinions,
            and essential guides.
          </p>

          <div className="mt-6 h-px w-24 bg-indigo-200 mx-auto rounded-full" />
        </header>

        {/* Top loading bar */}
        {showSkeletons && (
          <div className="w-full h-1 bg-gray-200 rounded mb-6 overflow-hidden">
            <div className="h-full w-1/3 bg-indigo-500 animate-pulse" />
          </div>
        )}

        {/* Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {showSkeletons && blogs.length === 0
            ? Array.from({ length: postsPerPage }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))
            : blogs.map((post) => <BlogCard key={post.id} post={post} />)}
        </section>

        {/* Empty state */}
        {!showSkeletons && blogs.length === 0 && (
          <div className="mt-16 text-center bg-white border border-gray-100 rounded-2xl p-10 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900">
              No articles found
            </h3>
            <p className="mt-2 text-gray-600">
              Please check back later — we’re adding fresh content regularly.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-14 md:mt-16">
            <nav
              className="flex items-center gap-1 p-2 bg-white rounded-full shadow-md border border-gray-200"
              aria-label="Pagination"
            >
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                ← Prev
              </button>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={index}
                    className="px-3 py-2 text-gray-500 select-none"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => paginate(Number(page))}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`min-w-[40px] px-4 py-2 text-sm font-semibold rounded-full transition ${
                      currentPage === page
                        ? "bg-indigo-600 text-white shadow hover:bg-indigo-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Next →
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
