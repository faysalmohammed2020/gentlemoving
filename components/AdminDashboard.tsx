"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useTransition,
} from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
  Legend,
  Area,
} from "recharts";
import {
  FaFileAlt,
  FaEye,
  FaEdit,
  FaTrash,
  FaGlobeAmericas,
  FaRegChartBar,
  FaBlog,
} from "react-icons/fa";

type ApiBlog = {
  id: number;
  post_title: string;
  post_content?: unknown;
  category?: string;
  tags?: string | string[] | null;
  post_status: string;
  createdAt?: string;
  post_date?: string;
};

interface Blog {
  id: number;
  post_title: string;
  post_status: string;
  createdAt?: string | null;
  _d?: Date | null;
}

type Lead = {
  id: number;
  key?: string;
  leadType?: string;
  leadSource?: string;
  referer?: string;
  fromIp: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneExt?: string | null;
  fromState: string;
  fromStateCode: string;
  fromCity: string;
  fromZip: string;
  toState: string;
  toStateCode: string;
  toCity: string;
  toZip: string;
  moveDate?: string | null;
  moveSize: string;
  selfPackaging?: boolean | null;
  hasCar?: boolean | null;
  carMake?: string | null;
  carModel?: string | null;
  carMakeYear?: string | null;
  createdAt: string;
};

type TrendInfo = { value: string; isPositive: boolean };



function uniq<T>(
  arr: T[],
  keyFn: (x: T) => string | number | null | undefined
) {
  const set = new Set<string | number>();
  for (const item of arr) {
    const k = keyFn(item);
    if (k !== null && k !== undefined && k !== "") set.add(k);
  }
  return set.size;
}
function between(d: Date, start: Date, end: Date) {
  return d >= start && d < end;
}
function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addMonths(d: Date, m: number) {
  return new Date(d.getFullYear(), d.getMonth() + m, 1);
}
function addDays(d: Date, n: number) {
  return new Date(d.getTime() + n * 24 * 60 * 60 * 1000);
}
function pctChange(curr: number, prev: number): TrendInfo {
  if (prev <= 0) {
    if (curr <= 0) return { value: "0%", isPositive: false };
    return { value: "+100%", isPositive: true };
  }
  const delta = ((curr - prev) / prev) * 100;
  const val = `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`;
  return { value: val, isPositive: delta >= 0 };
}

const SUBS_PAGE_SIZE = 50;
const numberFormatter = new Intl.NumberFormat();

const runIdle = (cb: () => void) => {
  if (typeof window === "undefined") return cb();
  if (window.requestIdleCallback) { 
    window.requestIdleCallback(cb, { timeout: 500 });
  } else {
    setTimeout(cb, 0);
  }
};

const SkeletonBox: React.FC<{ className?: string }> = React.memo(
  function SkeletonBox({ className = "" }) {
    return (
      <div
        className={`animate-pulse bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg ${className}`}
      />
    );
  }
);
SkeletonBox.displayName = "SkeletonBox";

const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = React.memo(
  function TableSkeleton({ rows = 5, cols = 4 }) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: cols }).map((__, j) => (
                <SkeletonBox key={j} className="h-4 rounded-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
TableSkeleton.displayName = "TableSkeleton";

const AdminDashboard: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [totalBlogs, setTotalBlogs] = useState<number>(0);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState<boolean>(true);
  const [errorBlogs, setErrorBlogs] = useState<string | null>(null);

  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [editBlogData, setEditBlogData] = useState<Blog | null>(null);

  const [stats, setStats] = useState({
    dailyLeads: [] as any[],
    dailyResponses: [] as any[],
  });
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalResponses, setTotalResponses] = useState(0);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);

  const [submissions, setSubmissions] = useState<Lead[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [subsLoading, setSubsLoading] = useState<boolean>(true);
  const [subsError, setSubsError] = useState<string | null>(null);
  const [subsPage, setSubsPage] = useState(1);

  const [isPending, startTransition] = useTransition();

  const [showFullSubs, setShowFullSubs] = useState(false);
  const fullSubsRef = useRef<HTMLDivElement | null>(null);
  const [totalVisitorsValue, setTotalVisitorsValue] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const loadVisitors = async () => {
      try {
        const res = await fetch("/api/visits?slug=home", {
          cache: "no-store",
          signal: controller.signal,
        });
        const json = await res.json();
        setTotalVisitorsValue(json.count || 0);
      } catch (e) {}
    };
    loadVisitors();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (showFullSubs) return;
    const node = fullSubsRef.current;
    if (!node) return;

    if (!(typeof window !== "undefined" && "IntersectionObserver" in window)) {
      setShowFullSubs(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShowFullSubs(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [showFullSubs]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchBlogs = async () => {
      setIsLoadingBlogs(true);
      setErrorBlogs(null);
      try {
        const res = await fetch("/api/blogpost?page=1&limit=1000", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const payload = await res.json();
        const items: ApiBlog[] = Array.isArray(payload)
          ? payload
          : payload.data || payload.items || [];
        const total = Array.isArray(payload)
          ? items.length
          : payload.meta?.total || payload.total || items.length;
        const transformed: Blog[] = items.map((item) => {
          const createdAt = item.createdAt ?? item.post_date ?? null;
          const d = createdAt ? new Date(createdAt) : null;
          return {
            id: Number(item.id),
            post_title: String(item.post_title || ""),
            post_status: String(item.post_status ?? "draft"),
            createdAt,
            _d: d && !isNaN(d.getTime()) ? d : null,
          };
        });
        runIdle(() => {
          startTransition(() => {
            setBlogs(transformed);
            setTotalBlogs(total);
          });
        });
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error(err);
        setErrorBlogs("Failed to fetch blogs. Please try again later.");
      } finally {
        setIsLoadingBlogs(false);
      }
    };
    fetchBlogs();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const res = await fetch("/api/admin/leads/stats", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed stats");
        const data = await res.json();
        setStats({
          dailyLeads: data.dailyLeads ?? [],
          dailyResponses: data.dailyResponses ?? [],
        });
        setTotalLeads(data.totalLeads ?? 0);
        setTotalResponses(data.totalResponses ?? 0);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setSubsLoading(true);
      setSubsError(null);
      try {
        const [subRes, respRes] = await Promise.all([
          fetch("/api/admin/leads/submissions", {
            cache: "no-store",
            signal: controller.signal,
          }),
          fetch("/api/admin/leads/responses", {
            cache: "no-store",
            signal: controller.signal,
          }),
        ]);
        if (!subRes.ok || !respRes.ok)
          throw new Error("Failed submissions/responses");
        const [subData, respData] = await Promise.all([
          subRes.json(),
          respRes.json(),
        ]);
        runIdle(() => {
          startTransition(() => {
            setSubmissions(subData ?? []);
            setResponses((respData ?? []).slice(0, 5));
            setSubsPage(1);
          });
        });
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        console.error("Failed to load submissions/responses", e);
        setSubsError("Failed to load submissions.");
      } finally {
        setSubsLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  const submissionsWithDate = useMemo(
    () =>
      submissions.map((l) => ({
        ...l,
        _d: new Date(l.createdAt),
        _createdFmt: new Date(l.createdAt).toLocaleDateString(),
      })),
    [submissions]
  );

  const blogDates = useMemo(
    () => blogs.map((b) => b._d).filter((d): d is Date => !!d),
    [blogs]
  );

  const recentBlogs = useMemo(() => blogs.slice(0, 5), [blogs]);
  const recentSubmissions = useMemo(
    () => submissionsWithDate.slice(0, 5),
    [submissionsWithDate]
  );

  const weeklyPerformanceData = useMemo(
    () =>
      stats.dailyLeads.map((lead: any, index: number) => ({
        date: lead.date,
        leads: lead.count,
        responses: (stats.dailyResponses[index] as any)?.count || 0,
      })),
    [stats.dailyLeads, stats.dailyResponses]
  );

  const {
    totalVisitorsTrend,
    totalBlogsTrend,
    totalSubmissionsTrend,
  } = useMemo(() => {
    const now = new Date();
    const last30Start = addDays(now, -30);
    const prev30Start = addDays(now, -60);
    const prev30End = last30Start;
    const thisMonthStart = startOfMonth(now);
    const nextMonthStart = addMonths(thisMonthStart, 1);
    const lastMonthStart = addMonths(thisMonthStart, -1);
    const totalVisitorsValue = uniq(submissions, (l) => l.fromIp);
    const last30Leads = submissionsWithDate.filter((l) =>
      between(l._d, last30Start, now)
    );
    const prev30Leads = submissionsWithDate.filter((l) =>
      between(l._d, prev30Start, prev30End)
    );
    const last30Unique = uniq(last30Leads, (l) => l.fromIp);
    const prev30Unique = uniq(prev30Leads, (l) => l.fromIp);
    const totalVisitorsTrend = pctChange(last30Unique, prev30Unique);
    const thisMonthLeads = submissionsWithDate.filter((l) =>
      between(l._d, thisMonthStart, nextMonthStart)
    );
    const lastMonthLeads = submissionsWithDate.filter((l) =>
      between(l._d, lastMonthStart, thisMonthStart)
    );
    const thisMonthVisitorsValue = uniq(thisMonthLeads, (l) => l.fromIp);
    const lastMonthUnique = uniq(lastMonthLeads, (l) => l.fromIp);
    const thisMonthVisitorsTrend = pctChange(
      thisMonthVisitorsValue,
      lastMonthUnique
    );
    const last30Blogs = blogDates.filter((d) =>
      between(d, last30Start, now)
    ).length;
    const prev30Blogs = blogDates.filter((d) =>
      between(d, prev30Start, prev30End)
    ).length;
    const totalBlogsTrend = pctChange(last30Blogs, prev30Blogs);
    const submissionsLast30 = last30Leads.length;
    const submissionsPrev30 = prev30Leads.length;
    const totalSubmissionsTrend = pctChange(
      submissionsLast30,
      submissionsPrev30
    );
    return {
      totalVisitorsValue,
      totalVisitorsTrend,
      thisMonthVisitorsValue,
      thisMonthVisitorsTrend,
      totalBlogsTrend,
      totalSubmissionsTrend,
    };
  }, [submissions, submissionsWithDate, blogDates]);

  const visitorDistribution = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const l of submissions) {
      const stateLabel =
        (l.fromStateCode && l.fromStateCode.trim()) ||
        (l.fromState && l.fromState.trim()) ||
        "Unknown";
      if (!map.has(stateLabel)) map.set(stateLabel, new Set());
      if (l.fromIp) map.get(stateLabel)!.add(l.fromIp);
    }
    const rows = Array.from(map.entries()).map(([name, ips]) => ({
      name,
      count: ips.size,
    }));
    rows.sort((a, b) => b.count - a.count);
    return rows.slice(0, 10);
  }, [submissions]);

  const totalSubsPages = useMemo(
    () => Math.max(1, Math.ceil(submissions.length / SUBS_PAGE_SIZE)),
    [submissions.length]
  );

  const pagedSubmissions = useMemo(
    () =>
      submissionsWithDate.slice(
        (subsPage - 1) * SUBS_PAGE_SIZE,
        subsPage * SUBS_PAGE_SIZE
      ),
    [submissionsWithDate, subsPage]
  );

  const handleSubsPageChange = useCallback(
    (dir: "prev" | "next") => {
      setSubsPage((prev) => {
        if (dir === "prev") return Math.max(1, prev - 1);
        return Math.min(totalSubsPages, prev + 1);
      });
    },
    [totalSubsPages]
  );

  const handleDeleteClick = useCallback(async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this blog post?"))
      return;
    try {
      const resp = await fetch("/api/blogpost", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!resp.ok) throw new Error("Delete failed");
      startTransition(() => {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
        setTotalBlogs((t) => Math.max(0, t - 1));
      });
    } catch {
      alert("Failed to delete blog post. Please try again.");
    }
  }, []);

  const handleEditClick = useCallback((blog: Blog) => {
    setEditBlogData(blog);
    setIsEditModalVisible(true);
  }, []);

  const handleEditClose = useCallback(() => {
    setIsEditModalVisible(false);
    setEditBlogData(null);
  }, []);

  const handleEditSave = useCallback(async (updatedBlog: Blog) => {
    try {
      const resp = await fetch("/api/blogpost", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: updatedBlog.id,
          post_title: updatedBlog.post_title,
          post_status: updatedBlog.post_status,
        }),
      });
      if (!resp.ok) throw new Error("Update failed");
      startTransition(() => {
        setBlogs((prev) =>
          prev.map((b) =>
            b.id === updatedBlog.id ? { ...b, ...updatedBlog } : b
          )
        );
        setIsEditModalVisible(false);
        setEditBlogData(null);
      });
    } catch {
      alert("Failed to update blog post. Please try again.");
    }
  }, []);

  const fmt = useCallback(
    (v: any) => (v === null || v === undefined || v === "" ? "—" : String(v)),
    []
  );
  const fmtDate = useCallback(
    (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString() : "—"),
    []
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-2">
          Welcome to your analytics command center
        </p>
      </div>

      {/* Analytics Cards - Redesigned with glassmorphism */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Total Visitors"
          value={numberFormatter.format(totalVisitorsValue)}
          trend={totalVisitorsTrend}
          icon={<FaEye className="text-xl" />}
          color="from-blue-500 to-cyan-500"
          loading={false}
        />
        <StatCard
          title="Total Blogs"
          value={isLoadingBlogs ? "…" : totalBlogs}
          trend={totalBlogsTrend}
          icon={<FaBlog className="text-xl" />}
          color="from-emerald-500 to-green-500"
          loading={isLoadingBlogs || isPending}
        />
        <StatCard
          title="Total Submissions"
          value={totalLeads}
          trend={totalSubmissionsTrend}
          icon={<FaFileAlt className="text-xl" />}
          color="from-amber-500 to-orange-500"
          loading={statsLoading}
        />
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Weekly Performance */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg shadow-gray-200/50 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                  <FaRegChartBar />
                </div>
                Weekly Performance
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Leads vs Responses trend
              </p>
            </div>
            <select className="text-sm bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>

          {statsLoading ? (
            <SkeletonBox className="h-[300px] w-full rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={weeklyPerformanceData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280" }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px" }}
                />
                <Bar
                  dataKey="leads"
                  fill="url(#leadGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <Area
                  type="monotone"
                  dataKey="responses"
                  fill="url(#responseGradient)"
                  stroke="#10b981"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient
                    id="responseGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop
                      offset="100%"
                      stopColor="#10b981"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Visitor Distribution */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg shadow-gray-200/50 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                <FaGlobeAmericas />
              </div>
              Visitor Distribution
            </h3>
            <p className="text-sm text-gray-500 mt-1">Top visitor locations</p>
          </div>
          <div className="h-[300px]">
            {subsLoading ? (
              <SkeletonBox className="h-full w-full rounded-xl" />
            ) : subsError ? (
              <div className="h-full flex items-center justify-center text-red-500 bg-red-50/50 rounded-xl">
                {subsError}
              </div>
            ) : visitorDistribution.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl">
                <div className="text-center">
                  <div className="text-4xl mb-2">🌎</div>
                  <p>No data available</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitorDistribution} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fill: "#6b7280" }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    tick={{ fill: "#6b7280" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[0, 8, 8, 0]}
                    fill="url(#barGradient)"
                  />
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#8b5cf6"
                        stopOpacity={0.9}
                      />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      {/* TWO SMALL TABLES - Redesigned */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Recent Lead Submissions */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Recent Lead Submissions
                </h2>
                <p className="text-sm text-gray-500">Latest form submissions</p>
              </div>
              <span className="text-xs font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-1.5 px-3 rounded-full shadow-sm">
                {recentSubmissions.length}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            {subsLoading ? (
              <TableSkeleton rows={5} cols={3} />
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50/80 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4 text-left font-semibold">Name</th>
                    <th className="px-5 py-4 text-left font-semibold">Email</th>
                    <th className="px-5 py-4 text-left font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentSubmissions.length > 0 ? (
                    recentSubmissions.map((lead, index) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center text-blue-600 font-semibold">
                              {lead.firstName.charAt(0)}
                            </div>
                            <span className="font-medium">
                              {lead.firstName} {lead.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="text-gray-600">
                            {lead.email || "—"}
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            {lead._createdFmt}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-5 py-12 text-center">
                        <div className="text-gray-400">
                          <div className="text-4xl mb-3">📝</div>
                          <p>No recent submissions</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Lead Responses */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50/50 to-green-50/50">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Recent Lead Responses
                </h2>
                <p className="text-sm text-gray-500">
                  Latest customer responses
                </p>
              </div>
              <span className="text-xs font-semibold bg-gradient-to-r from-emerald-500 to-green-500 text-white py-1.5 px-3 rounded-full shadow-sm">
                {responses.length}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            {subsLoading ? (
              <TableSkeleton rows={5} cols={3} />
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50/80 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4 text-left font-semibold">
                      Lead ID
                    </th>
                    <th className="px-5 py-4 text-left font-semibold">
                      Status
                    </th>
                    <th className="px-5 py-4 text-left font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {responses.length > 0 ? (
                    responses.map((leadId: any, index: number) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-5 py-4 whitespace-nowrap font-medium text-gray-700">
                          #{leadId}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-full text-xs font-semibold">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            Responded
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-gray-500">
                          —
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-5 py-12 text-center">
                        <div className="text-gray-400">
                          <div className="text-4xl mb-3">💬</div>
                          <p>No recent responses</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {/* Full submissions table */}
      <section className="mb-10" ref={fullSubsRef}>
        <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Calculate Form Submissions User
                </h2>
                <p className="text-sm text-gray-500">
                  Detailed submission records
                </p>
              </div>
              <span className="text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-1.5 px-3 rounded-full shadow-sm">
                {submissions.length}
              </span>
            </div>
          </div>

          {!showFullSubs ? (
            <TableSkeleton rows={8} cols={6} />
          ) : subsLoading ? (
            <TableSkeleton rows={8} cols={8} />
          ) : subsError ? (
            <div className="p-8 text-center bg-red-50/50">
              <div className="text-red-500 font-medium">{subsError}</div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400">
                <div className="text-4xl mb-3">📊</div>
                <p>No submissions found</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/80 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">ID</th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        From State
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        From Code
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        From City
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        From ZIP
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        To State
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        To Code
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        To City
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        To ZIP
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Move Date
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Move Size
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">IP</th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pagedSubmissions.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-700">
                          #{lead.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {fmt(lead.firstName)} {fmt(lead.lastName)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {fmt(lead.email)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {fmt(lead.phone)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {fmt(lead.fromState)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {fmt(lead.fromStateCode)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {fmt(lead.fromCity)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {fmt(lead.fromZip)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {fmt(lead.toState)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {fmt(lead.toStateCode)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {fmt(lead.toCity)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {fmt(lead.toZip)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {fmtDate(lead.moveDate)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {fmt(lead.moveSize)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs">
                          {fmt(lead.fromIp)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                            {lead._createdFmt}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50/50 text-sm text-gray-600">
                <div>
                  Showing{" "}
                  <span className="font-semibold text-gray-800">
                    {(subsPage - 1) * SUBS_PAGE_SIZE + 1}-
                    {Math.min(subsPage * SUBS_PAGE_SIZE, submissions.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800">
                    {submissions.length}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSubsPageChange("prev")}
                    disabled={subsPage === 1}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      subsPage === 1
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 text-gray-700 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-gray-700">
                    Page <span className="font-bold">{subsPage}</span> of{" "}
                    <span className="font-bold">{totalSubsPages}</span>
                  </span>
                  <button
                    onClick={() => handleSubsPageChange("next")}
                    disabled={subsPage === totalSubsPages}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      subsPage === totalSubsPages
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 text-gray-700 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Recent Blogs */}
     {/* Recent Blogs - WITHOUT Comments column */}
<section className="mb-10">
  <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
    <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-violet-50/50 to-purple-50/50">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            Recent Blog Posts
          </h2>
          <p className="text-sm text-gray-500">Manage your blog content</p>
        </div>
        <button className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all hover:shadow-indigo-200">
          Add New Post
        </button>
      </div>
    </div>
    <div className="overflow-x-auto">
      {isLoadingBlogs ? (
        <TableSkeleton rows={5} cols={3} />
      ) : errorBlogs ? (
        <div className="p-8 text-center bg-red-50/50">
          <div className="text-red-500 font-medium">{errorBlogs}</div>
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-50/80 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-4 text-left font-semibold">Title</th>
              <th className="px-5 py-4 text-left font-semibold">Status</th>
              <th className="px-5 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {recentBlogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                      <FaBlog className="text-violet-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">
                        {blog.post_title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {blog.createdAt ? fmtDate(blog.createdAt) : "—"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      blog.post_status === "publish"
                        ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800"
                        : blog.post_status === "draft"
                        ? "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800"
                        : "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800"
                    }`}
                  >
                    <div 
                      className={`w-1.5 h-1.5 rounded-full ${
                        blog.post_status === "publish"
                          ? "bg-emerald-500"
                          : blog.post_status === "draft"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                      }`}
                    ></div>
                    {blog.post_status === "publish" 
                      ? "Published" 
                      : blog.post_status === "draft" 
                      ? "Draft" 
                      : "Pending"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(blog)}
                      className="p-2.5 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-600 hover:shadow-md rounded-xl transition-all hover:scale-105"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(blog.id)}
                      className="p-2.5 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:shadow-md rounded-xl transition-all hover:scale-105"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
</section>
    

      {/* Edit Modal */}
      {isEditModalVisible && editBlogData && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={handleEditClose}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
              <h2 className="text-xl font-bold text-gray-800">
                Edit Blog Post
              </h2>
              <button
                onClick={handleEditClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white/50 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Post Title
                </label>
                <input
                  type="text"
                  value={editBlogData.post_title}
                  onChange={(e) =>
                    setEditBlogData({
                      ...editBlogData,
                      post_title: e.target.value,
                    })
                  }
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Post Status
                  </label>
                  <select
                    value={editBlogData.post_status}
                    onChange={(e) =>
                      setEditBlogData({
                        ...editBlogData,
                        post_status: e.target.value,
                      })
                    }
                    className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50/50"
                  >
                    <option value="publish">Published</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending Review</option>
                  </select>
                </div>

                <div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={handleEditClose}
                className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-xl hover:bg-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEditSave(editBlogData)}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all hover:shadow-indigo-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: TrendInfo | null;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = React.memo(function StatCard({
  title,
  value,
  icon,
  color,
  loading,
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg shadow-gray-200/50 p-5 hover:shadow-xl hover:shadow-gray-300/30 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <div className="mt-1">
            {loading ? (
              <SkeletonBox className="h-8 w-24 rounded-lg" />
            ) : (
              <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            )}
          </div>
        </div>
        <div
          className={`p-3.5 rounded-xl bg-gradient-to-br ${color} text-white shadow-md`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
});
StatCard.displayName = "StatCard";
export default AdminDashboard;
