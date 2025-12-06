"use client";

import { useEffect } from "react";
import RelatedPost from "@/components/RelatedPost";
import MovingCalculator from "./MovingCostCalculator";

const HomePage = () => {
  useEffect(() => {
    const key = "visited_home_session";
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: "home" }),
      keepalive: true,
    }).catch(() => {});
  }, []);

  return (
    <main className="w-full">
      {/* ===== HERO (blue background + centered text + white card) ===== */}
      <section className="relative w-full bg-[#6eaed1]">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_#ffffff_1px,_transparent_1px)] [background-size:22px_22px]" />

        <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-20 md:pt-16 md:pb-24 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide drop-shadow-sm">
            Get Free, NO Obligation Moving Quote
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-xl font-semibold opacity-95">
            Licensed Insured A+ Top Rated Out of State - Long Distance Movers Get Quotes
          </p>

          {/* white quote/card area */}
          <div className="mt-8 md:mt-10 text-gray-900 overflow-hidden">
            <div className="p-6 md:p-10">

              {/* ✅ FULL WIDTH Calculator */}
              <div className="w-full max-w-4xl mx-auto">
                <MovingCalculator />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3 FEATURE SECTION ===== */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#0b2a4a]">
            Plan Your Move &amp; Save Up To 50% Off Move Cost
          </h2>
          <div className="w-20 h-1 bg-[#0b2a4a] mx-auto mt-4 mb-10 opacity-60" />

          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center gap-3">
              <div className="text-5xl">🏅</div>
              <h3 className="text-lg font-bold">Insured Licensed Movers</h3>
              <p className="text-sm text-gray-600 max-w-xs">
                Filtered through Comprehensive Certification Process
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="text-5xl">🧮</div>
              <h3 className="text-lg font-bold">Moving Costs Estimates</h3>
              <p className="text-sm text-blue-600 font-semibold max-w-xs">
                Are FREE and NO OBLIGATION!
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="text-5xl">🤝</div>
              <h3 className="text-lg font-bold">Movers Compete</h3>
              <p className="text-sm text-gray-600 max-w-xs">
                Let our Movers Compete for your business and Save $$
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ======== Recent Articles ======= */}
       <div>
            <h2 className="text-3xl font-bold text-center mt-7 pl-5">
              Recent <span className="text-orange-600">Articles</span>
            </h2>
            <div className="mb-6 mt-2">
              <div className="w-16 h-1 bg-orange-600 mx-auto"></div>
            </div>
          </div>

          <RelatedPost currentPostID="119" />
      {/* ===== HOW IT WORKS (blue band) ===== */}
      <section className="bg-[#3f6f90] text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-10">
            How it Works?
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center gap-3">
              <div className="text-5xl">📝</div>
              <p className="text-base font-semibold max-w-sm">
                Fill out our quick and easy form &amp; get started now
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="text-5xl">🔎</div>
              <p className="text-base font-semibold max-w-sm">
                Database will find Best Match Save up to 50% Off from Movers in your area.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="text-5xl">❗</div>
              <p className="text-base font-semibold max-w-sm">
                FREE NO OBLIGATION Compare up to 4 Moving Companies Quotes!
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
