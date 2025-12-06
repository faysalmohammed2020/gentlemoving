"use client";

import React from "react";

const AboutUsPage = () => {
  return (
    <main className="w-full bg-white text-gray-800">
      {/* HERO */}
      <section className="relative bg-[#6eaed1] text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_#ffffff_1px,_transparent_1px)] [background-size:22px_22px]" />
        <div className="relative max-w-6xl mx-auto px-4 py-14 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide drop-shadow-sm">
            About Us
          </h1>
          <p className="mt-4 text-base md:text-xl font-semibold opacity-95 max-w-3xl mx-auto">
            Receiving free quotes from moving companies has never been easier.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left main content */}
          <div className="md:col-span-2 space-y-8">
            {/* Intro */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
              <p className="text-[15px] md:text-base leading-7">
                <span className="font-semibold text-[#0b2a4a]">
                  GentleMoving
                </span>{" "}
                is a powerful internet resource that connects consumers directly
                to companies that provide reliable premium moving and relocation
                services to consumers all over the country. Whether you are
                looking for local movers or long distance moving services, we
                can lead you in the right direction.
              </p>
            </div>

            {/* Find right moving company */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-[#0b2a4a] mb-3">
                Find The Right Moving Company For You!
              </h2>
              <p className="text-[15px] md:text-base leading-7">
                We understand that you don’t have the time to gather information
                on several different moving companies. In just a few clicks,
                GentleMoving will put you in contact with the movers in your
                area that have the expertise to complete your move on time and
                within your budget.
              </p>

              <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
                <div className="rounded-lg bg-[#f7fbff] border p-3 text-center font-semibold">
                  Long Distance Movers
                </div>
                <div className="rounded-lg bg-[#f7fbff] border p-3 text-center font-semibold">
                  Auto Transport Companies
                </div>
                <div className="rounded-lg bg-[#f7fbff] border p-3 text-center font-semibold">
                  Storage Facilities
                </div>
              </div>
            </div>

            {/* Qualified movers */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-[#0b2a4a] mb-3">
                Qualified Movers In Your Area
              </h2>
              <p className="text-[15px] md:text-base leading-7">
                Finding a moving company is half the battle. Finding a creditable
                moving company you can trust can be just as complicated. We ease
                the frustration by connecting you with companies that have been
                pre-screened for full compliance with State and Federal
                regulations to perform moves.
              </p>

              <p className="mt-4 text-[15px] md:text-base leading-7">
                Being creditable sometimes just isn’t enough and we understand.
                GentleMoving lets you review the quality of each mover to help
                you make the decision on which mover is best for you. Every
                function of GentleMoving is designed to help make your move as
                easy as possible. See why Gentle Moving Company is better than
                all the other moving resources out there.
              </p>
            </div>

            {/* Tools resources tips */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-[#0b2a4a] mb-3">
                Tools, Resources, and Tips
              </h2>
              <p className="text-[15px] md:text-base leading-7">
                The goal of Gentle Moving Company is to put you on the path
                toward an exceptional moving experience, even if you’ve already
                chosen a particular mover.
              </p>
            </div>
          </div>

          {/* Right side highlight card */}
          <aside className="space-y-6">
            <div className="rounded-2xl bg-[#0b5d7a] text-white p-6 md:p-7 shadow-lg">
              <h3 className="text-lg md:text-xl font-extrabold mb-2">
                Why GentleMoving?
              </h3>
              <ul className="text-sm md:text-[15px] space-y-2 leading-6">
                <li>• Fast, free, no-obligation quotes</li>
                <li>• Pre-screened movers for compliance</li>
                <li>• Local & long-distance support</li>
                <li>• Compare multiple companies easily</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-100 p-6 md:p-7 shadow-sm">
              <h3 className="text-lg font-bold text-[#0b2a4a] mb-2">
                Our Mission
              </h3>
              <p className="text-sm md:text-[15px] leading-6 text-gray-700">
                To make moving simpler, safer, and more affordable by connecting
                you with trusted professionals—quickly and transparently.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default AboutUsPage;
