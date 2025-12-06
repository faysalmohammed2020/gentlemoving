import React from "react";
import MovingCostCalculator from "@/components/MovingCostCalculator";

const ContactUs: React.FC = () => {
  return (
    <div className="w-full flex justify-center px-4 md:px-8 py-10">
      <div
        className="
          w-full max-w-6xl
          grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-12
          items-start
        "
      >
        <div className="w-full">
          <div
            className="
              bg-white rounded-2xl shadow-md border border-gray-100
              p-6 md:p-8
            "
          >
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-extrabold text-teal-700">
                Contact Us
              </h1>
              <p className="mt-2 text-sm md:text-base text-gray-500">
                We’re here to help. Reach out anytime.
              </p>
            </div>

            <div className="space-y-5 text-gray-700">
              {/* Address */}
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Address
                </p>
                <p className="font-medium">3432 Amsterdam Ave</p>
                <p className="font-medium">Hollywood, FL 33026</p>
              </div>

              {/* Phone */}
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Call Us
                </p>
                <a
                  href="tel:+18882021370"
                  className="
                    inline-flex items-center gap-2
                    text-blue-600 font-semibold hover:underline
                  "
                >
                  +1 888 202 1370
                </a>
              </div>            
            </div>

            {/* CTA */}
            <div className="mt-6">
              <a
                href="tel:+18882021370"
                className="
                  w-full inline-flex justify-center items-center
                  bg-teal-700 hover:bg-teal-800 transition
                  text-white font-semibold py-3 rounded-lg
                "
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
