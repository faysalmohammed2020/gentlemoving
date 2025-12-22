"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { VscAccount } from "react-icons/vsc";
import Image from "next/image";
import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface Blog {
  id: number;
  post_title: string;
  slug: string;
  _titleLower: string;
  _slugLower: string;
}

type BlogListResponse =
  | { data: unknown[]; meta?: unknown } // new API
  | unknown[]; // old API

// ✅ slugify helper
function slugify(input: string) {
  return (input || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

// ✅ safe extract
function getString(v: unknown) {
  return typeof v === "string" ? v : String(v ?? "");
}

const HeaderMenu: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isHovered, setIsHovered] = useState<boolean>(false);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState<string | null>(null);
  const [hasLoadedBlogs, setHasLoadedBlogs] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (e) {
      console.error("Sign out failed", e);
    } finally {
      router.push("/sign-in");
    }
  }, [router]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  /**
   * ✅ Fetch ALL titles reliably
   * API: /api/blogpost?titles=1 -> returns array
   */
  useEffect(() => {
    if (hoveredMenu !== "blogs" || hasLoadedBlogs) return;

    const controller = new AbortController();

    const fetchAllBlogTitles = async () => {
      setBlogsLoading(true);
      setBlogsError(null);

      try {
        const res = await fetch(`/api/blogpost?titles=1`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch titles");

        const list = (await res.json()) as any[];

        const mapped: Blog[] = (Array.isArray(list) ? list : []).map((item) => {
          const title = getString(item?.post_title);
          const apiSlugRaw = getString(item?.slug).trim();

          const s = apiSlugRaw || slugify(title);

          return {
            id: Number(item?.id),
            post_title: title,
            slug: s,
            _titleLower: title.toLowerCase(),
            _slugLower: s.toLowerCase(),
          };
        });

        setBlogs(mapped.filter((b) => b.id && b.post_title && b.slug));
        setHasLoadedBlogs(true);
      } catch (error: any) {
        if (error?.name !== "AbortError") {
          console.error("Error fetching blogs:", error);
          setBlogsError("Failed to load blogs.");
        }
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchAllBlogTitles();
    return () => controller.abort();
  }, [hoveredMenu, hasLoadedBlogs]);

  const filteredBlogs = useMemo(() => {
    const MAX_RESULTS = 30;
    const q = debouncedQuery.toLowerCase();

    if (!q) return blogs.slice(0, MAX_RESULTS);

    return blogs
      .filter(
        (b) => b._titleLower.includes(q) || b._slugLower.includes(q)
      )
      .slice(0, MAX_RESULTS);
  }, [blogs, debouncedQuery]);

  const renderHighlightedTitle = (text: string, query: string) => {
    if (!query) return text;
    const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${safe})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, idx) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={idx} className="text-blue-600">
          {part}
        </span>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  };

  const handleMouseEnter = (menuName: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredMenu(menuName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setHoveredMenu(null), 250);
  };

  return (
    <header className="bg-[#ffff] shadow-md border-b border-gray-300 sticky top-0 left-0 w-full z-50">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6 text-white">
        {/* Logo */}
        <div>
          <Link href="/">
            <Image
              src="/image/Logo.webp"
              alt="Company Logo"
              width={386}
              height={59}
              priority
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="text-black"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden text-black md:flex items-center space-x-10 font-semibold text-lg">
          <li>
            <Link href="/home">Home</Link>
          </li>

          <li>
            <Link href="/about-us">About Us</Link>
          </li>

          <li>
            <Link href="/contact">Contact</Link>
          </li>

          {/* Blog Dropdown */}
          <li
            className="group relative"
            onMouseEnter={() => handleMouseEnter("blogs")}
            onMouseLeave={handleMouseLeave}
          >
            <Link href="/blog" className="flex items-center">
              <span>Blog</span>
              <ChevronDown className="ml-2 w-4 h-4 text-black" />
            </Link>

            {hoveredMenu === "blogs" && (
              <div className="absolute -left-32 mt-5 w-[450px] bg-white text-black shadow-lg rounded-xl p-4">
                <div className="flex">
                  {/* Left promo */}
                  <div className={`w-1/3 ${isHovered ? "hidden" : "block"}`}>
                    <Image
                      src="/image/delevery4.jpg"
                      alt="Explore Blogs"
                      height={120}
                      width={120}
                      className="rounded-md mb-4"
                    />
                    <h4 className="text-lg font-bold">Explore Blogs</h4>
                    <p className="text-gray-600">
                      Discover insights, tips, and stories on a variety of topics.
                    </p>
                  </div>

                  {/* Right list */}
                  <div
                    className={`${
                      isHovered ? "w-full" : "w-2/3"
                    } gap-4 pl-6 overflow-y-auto h-96`}
                  >
                    <div
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <div>
                        <input
                          type="text"
                          placeholder="Search blogs..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-2 py-1 pl-4 rounded-xl bg-white text-black placeholder-gray-600 focus:outline-none focus:ring-orange-500 shadow-sm border border-orange-600 transition-all duration-300"
                        />
                        <hr />
                      </div>

                      <div className="scrollbar mt-4 space-y-3">
                        {blogsLoading ? (
                          <p className="text-gray-500 text-sm">Loading blogs...</p>
                        ) : blogsError ? (
                          <p className="text-red-600 text-sm">{blogsError}</p>
                        ) : filteredBlogs.length > 0 ? (
                          filteredBlogs.map((blog) => (
                            <div
                              key={blog.id}
                              className="group p-2 rounded-xl transition-colors duration-300 ease-in-out shadow-md"
                            >
                              {/* ✅ slug-based route */}
                              <Link
                                href={`/${encodeURIComponent(blog.slug)}`}
                                className="text-sm sm:text-base font-medium text-gray-800 hover:underline hover:text-orange-600"
                              >
                                {renderHighlightedTitle(
                                  blog.post_title,
                                  debouncedQuery
                                )}
                              </Link>
                            </div>
                          ))
                        ) : (
                          <p className="text-red-800 text-sm">No blogs found...</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </li>
        </ul>

        {/* Right section */}
        <div className="hidden md:flex items-center space-x-4">
          {session ? (
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link href="/sign-in">
              <Button className="px-2 py-1 rounded-full border font-semibold">
                Sign In
              </Button>
            </Link>
          )}
          <button className="p-2 rounded-full">
            <VscAccount className="size-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <ul className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col text-lg md:hidden text-black">
          <li className="px-4 py-2 border-b">
            <Link href="/home">Home</Link>
          </li>
          <li className="px-4 py-2 border-b">
            <Link href="/about-us">About Us</Link>
          </li>
          <li className="px-4 py-2 border-b">
            <Link href="/contact">Contact</Link>
          </li>
          <li className="px-4 py-2 border-b">
            <Link href="/blog">Blog</Link>
          </li>
        </ul>
      )}
    </header>
  );
};

export default HeaderMenu;
