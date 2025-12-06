"use client";

import React, { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner";
import STATE_CITY_MAP from "@/app/data/states-cities.json";

type StateCityMap = Record<string, string[]>;
const usZipRegex = /^\d{5}(-\d{4})?$/;

const MovingCalculator: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [referer, setReferer] = useState("Direct");
  const [leadType, setLeadType] = useState("");

  const [fromZip, setFromZip] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [fromState, setFromState] = useState("");

  const [toZip, setToZip] = useState("");
  const [toCity, setToCity] = useState("");
  const [toState, setToState] = useState("");

  const [movingType, setMovingType] = useState("");
  const [movingDate, setMovingDate] = useState<Date | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [fromIp, setFromIp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const movingOptions = [
    "Studio residence",
    "1 bedroom residence",
    "2 bedroom residence",
    "3 bedroom residence",
    "4+ bedroom residence",
    "Office move",
  ];

  const usStates = useMemo(
    () => Object.keys(STATE_CITY_MAP as StateCityMap),
    []
  );

  const fromCities = useMemo(() => {
    if (!fromState) return [];
    return (STATE_CITY_MAP as StateCityMap)[fromState] || [];
  }, [fromState]);

  const toCities = useMemo(() => {
    if (!toState) return [];
    return (STATE_CITY_MAP as StateCityMap)[toState] || [];
  }, [toState]);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setFromIp(data.ip))
      .catch(() => {});
    if (document.referrer) setReferer(document.referrer || "Direct");
  }, []);

  useEffect(() => {
    if (fromState && toState) {
      setLeadType(fromState === toState ? "Local" : "International");
    } else {
      setLeadType("");
    }
  }, [fromState, toState]);

  const capitalizeWords = (str: string) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  // ---------------- validations per step ----------------
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!fromZip) newErrors.fromZip = "From ZIP is required.";
    else if (!usZipRegex.test(fromZip))
      newErrors.fromZip = "Enter a valid US ZIP (##### or #####-####).";

    if (!toZip) newErrors.toZip = "To ZIP is required.";
    else if (!usZipRegex.test(toZip))
      newErrors.toZip = "Enter a valid US ZIP (##### or #####-####).";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      toast.error("Please fix the errors and try again.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!fromState) newErrors.fromState = "From State is required.";
    if (!fromCity) newErrors.fromCity = "From City is required.";
    if (!toState) newErrors.toState = "Destination State is required.";
    if (!toCity) newErrors.toCity = "Destination City is required.";
    if (!movingDate) newErrors.movingDate = "Moving date is required.";
    if (!movingType) newErrors.movingType = "Move size is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      toast.error("Please fix the errors and try again.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = "Name is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format.";
    if (!phone) newErrors.phone = "Phone is required.";
    if (!acceptedTerms) newErrors.terms = "Please accept terms.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      toast.error("Please fix the errors and try again.");
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (step === 1 && validateStep1()) {
      setErrors({});
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setErrors({});
      setStep(3);
    }
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => (s === 3 ? 2 : 1));
  };

  // ---------------- submit (same logic) ----------------
  const handleSubmit = async () => {
    if (submitting) return;
    if (!validateStep3()) return;

    setSubmitting(true);

    const [firstName, ...lastNameParts] = name.trim().split(" ");
    const lastName = lastNameParts.join(" ");

    const jsonPayload = {
      key: "c5QlLF3Ql90DGQr222tIqHd441",
      lead_type: leadType,
      lead_source: referer ? "Website: " + referer : "Website: Direct",
      referer: referer || "Direct",
      from_ip: fromIp,
      first_name: firstName,
      last_name: lastName,
      email: email.trim().toLowerCase(),
      phone: phone.replace(/[^0-9]/g, ""),

      from_state: capitalizeWords(fromState),
      from_state_code: fromState.slice(0, 2).toUpperCase(),
      from_city: capitalizeWords(fromCity),
      from_zip: fromZip,

      to_state: capitalizeWords(toState),
      to_state_code: toState.slice(0, 2).toUpperCase(),
      to_city: capitalizeWords(toCity),
      to_zip: toZip,

      move_date: movingDate?.toISOString().split("T")[0] || "",
      move_size: movingType,
      car_make: "",
      car_model: "",
      car_make_year: "",
    };

    try {
      const response = await fetch("/api/save-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonPayload),
      });

      if (response.status === 409) {
        toast.error("Email or phone no is duplicate.");
        return;
      }
      if (!response.ok) {
        toast.error("Failed to save form data.");
        return;
      }

      const data = await response.json();
      if (data?.message === "Form submitted successfully") {
        await sendToExternalAPI(jsonPayload);
        toast.success("Form submitted successfully!");
        resetForm();
      } else toast.error("An error occurred while submitting.");
    } catch {
      toast.error("There was an issue submitting. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const sendToExternalAPI = async (jsonPayload: any) => {
    const sendingPoint = "/api/moving/receive-leads/receive.php/";
    const headers = new Headers({
      Authorization: "Token token=buzzmoving2017",
      "Content-Type": "application/json",
    });

    try {
      const response = await fetch(sendingPoint, {
        credentials: "include",
        method: "POST",
        headers,
        body: JSON.stringify(jsonPayload),
      });

      const contentType = response.headers.get("content-type");
      const result =
        contentType && contentType.includes("application/json")
          ? await response.json()
          : JSON.parse(await response.text());

      await fetch("/api/save-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
    } catch {}
  };

  const resetForm = () => {
    setStep(1);
    setName("");
    setEmail("");
    setPhone("");
    setFromZip("");
    setFromState("");
    setFromCity("");
    setToState("");
    setToCity("");
    setToZip("");
    setMovingType("");
    setMovingDate(null);
    setAcceptedTerms(false);
    setErrors({});
  };

  // ---------------- UI ----------------
  const stepsMeta = [
    { id: 1, title: "Zip Codes" },
    { id: 2, title: "Move Details" },
    { id: 3, title: "Get Quotes" },
  ] as const;

  const inputBase =
    "w-full h-11 px-3 rounded-md border text-[15px] outline-none transition focus:ring-2 focus:ring-[#0b5d7a]/40";

  return (
    <div className="w-full">
      {/* background like screenshot */}
      <div className="relative bg-[#6eaed1] rounded-2xl px-3 md:px-8 py-5 md:py-7">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_#ffffff_1px,_transparent_1px)] [background-size:22px_22px]" />

        {/* ===== Advanced Stepper ===== */}
        <div className="relative mb-5 md:mb-7">
          <div className="absolute left-6 right-6 top-5 h-[3px] bg-white/40 rounded-full" />
          <div
            className="absolute left-6 top-5 h-[3px] bg-white rounded-full transition-all"
            style={{ width: `${(step - 1) * 50}%` }}
          />
          <div className="flex items-center justify-between px-2 md:px-6">
            {stepsMeta.map((s) => {
              const done = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-11 h-11 rounded-full grid place-items-center border-4 font-extrabold text-sm
                      ${done ? "bg-[#0b5d7a] border-white text-white" : ""}
                      ${active ? "bg-white border-white text-[#0b2a4a]" : ""}
                      ${!done && !active ? "bg-[#0b5d7a] border-white/70 text-white/90" : ""}
                    `}
                  >
                    {done ? "✓" : `0${s.id}`}
                  </div>
                  <p className="text-white text-xs md:text-sm font-semibold">
                    {s.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== White Card ===== */}
        <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden border border-white/60">
          <div className="grid md:grid-cols-[1.25fr_0.75fr]">
            {/* LEFT FORM */}
            <div className="p-5 md:p-8">
              <h3 className="text-xl md:text-2xl font-semibold mb-6">
                Get free quotes in less than{" "}
                <span className="text-red-600 font-extrabold">
                  30 seconds!
                </span>
              </h3>

              {/* ========== STEP 1 ========== */}
              {step === 1 && (
                <div className="space-y-4 max-w-2xl">
                  <div className="grid md:grid-cols-[220px_1fr] items-center gap-3">
                    <label className="font-semibold text-[#0b2a4a]">
                      Your Current ZIP
                    </label>
                    <input
                      type="text"
                      placeholder="-----ZIP-----"
                      className={`${inputBase} ${
                        errors.fromZip ? "border-red-500" : "border-gray-300"
                      }`}
                      value={fromZip}
                      onChange={(e) => setFromZip(e.target.value.trim())}
                    />
                  </div>
                  {errors.fromZip && (
                    <p className="text-red-500 text-xs md:ml-[220px] -mt-2">
                      {errors.fromZip}
                    </p>
                  )}

                  <div className="grid md:grid-cols-[220px_1fr] items-center gap-3">
                    <label className="font-semibold text-[#0b2a4a]">
                      Destination ZIP
                    </label>
                    <input
                      type="text"
                      placeholder="-----ZIP-----"
                      className={`${inputBase} ${
                        errors.toZip ? "border-red-500" : "border-gray-300"
                      }`}
                      value={toZip}
                      onChange={(e) => setToZip(e.target.value.trim())}
                    />
                  </div>
                  {errors.toZip && (
                    <p className="text-red-500 text-xs md:ml-[220px] -mt-2">
                      {errors.toZip}
                    </p>
                  )}

                  <div className="pt-3 md:ml-[220px]">
                    <button
                      onClick={goNext}
                      className="w-full md:w-[340px] bg-gradient-to-b from-green-500 to-green-700 text-white py-3 font-extrabold rounded-md shadow-md hover:from-green-600 hover:to-green-800 active:scale-[0.99]"
                    >
                      NEXT STEP
                    </button>
                    <p className="text-center text-[11px] text-gray-500 mt-2">
                      No Obligation
                    </p>
                  </div>
                </div>
              )}

              {/* ========== STEP 2 ========== */}
              {step === 2 && (
                <div className="space-y-4 max-w-2xl">
                  {/* From state/city */}
                  <div className="grid md:grid-cols-[220px_1fr] items-center gap-3">
                    <label className="font-semibold text-[#0b2a4a]">
                      Your Current State
                    </label>
                    <select
                      className={`${inputBase} ${
                        errors.fromState ? "border-red-500" : "border-gray-300"
                      }`}
                      value={fromState}
                      onChange={(e) => {
                        setFromState(e.target.value);
                        setFromCity("");
                      }}
                    >
                      <option value="">--State--</option>
                      {usStates.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.fromState && (
                    <p className="text-red-500 text-xs md:ml-[220px] -mt-2">
                      {errors.fromState}
                    </p>
                  )}

                  <div className="grid md:grid-cols-[220px_1fr] items-center gap-3">
                    <label className="font-semibold text-[#0b2a4a]">
                      Your Current City
                    </label>
                    <select
                      className={`${inputBase} ${
                        errors.fromCity ? "border-red-500" : "border-gray-300"
                      }`}
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      disabled={!fromState}
                    >
                      <option value="">--City--</option>
                      {fromCities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.fromCity && (
                    <p className="text-red-500 text-xs md:ml-[220px] -mt-2">
                      {errors.fromCity}
                    </p>
                  )}

                  {/* Destination state/city */}
                  <div className="grid md:grid-cols-[220px_1fr] items-center gap-3">
                    <label className="font-semibold text-[#0b2a4a]">
                      Destination State
                    </label>
                    <select
                      className={`${inputBase} ${
                        errors.toState ? "border-red-500" : "border-gray-300"
                      }`}
                      value={toState}
                      onChange={(e) => {
                        setToState(e.target.value);
                        setToCity("");
                      }}
                    >
                      <option value="">--State--</option>
                      {usStates.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.toState && (
                    <p className="text-red-500 text-xs md:ml-[220px] -mt-2">
                      {errors.toState}
                    </p>
                  )}

                  <div className="grid md:grid-cols-[220px_1fr] items-center gap-3">
                    <label className="font-semibold text-[#0b2a4a]">
                      Destination City
                    </label>
                    <select
                      className={`${inputBase} ${
                        errors.toCity ? "border-red-500" : "border-gray-300"
                      }`}
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      disabled={!toState}
                    >
                      <option value="">--City--</option>
                      {toCities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.toCity && (
                    <p className="text-red-500 text-xs md:ml-[220px] -mt-2">
                      {errors.toCity}
                    </p>
                  )}

                  {/* moving date */}
                  <div className="grid md:grid-cols-[220px_1fr] items-center gap-3">
                    <label className="font-semibold text-[#0b2a4a]">
                      When is your move?
                    </label>
                    <DatePicker
                      selected={movingDate}
                      onChange={(d) => setMovingDate(d)}
                      placeholderText="mm/dd/yyyy*"
                      minDate={new Date()}
                      className={`${inputBase} ${
                        errors.movingDate ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.movingDate && (
                    <p className="text-red-500 text-xs md:ml-[220px] -mt-2">
                      {errors.movingDate}
                    </p>
                  )}

                  {/* move size */}
                  <div className="grid md:grid-cols-[220px_1fr] items-center gap-3">
                    <label className="font-semibold text-[#0b2a4a]">
                      Select Move Size?
                    </label>
                    <select
                      className={`${inputBase} ${
                        errors.movingType ? "border-red-500" : "border-gray-300"
                      }`}
                      value={movingType}
                      onChange={(e) => setMovingType(e.target.value)}
                    >
                      <option value="">--Select--</option>
                      {movingOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.movingType && (
                    <p className="text-red-500 text-xs md:ml-[220px] -mt-2">
                      {errors.movingType}
                    </p>
                  )}

                  {/* buttons */}
                  <div className="pt-4 md:ml-[220px] flex items-center gap-3">
                    <button
                      onClick={goBack}
                      className="px-5 h-11 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      Back
                    </button>

                    <button
                      onClick={goNext}
                      className="w-full md:w-[280px] bg-gradient-to-b from-green-500 to-green-700 text-white h-11 font-extrabold rounded-md shadow-md hover:from-green-600 hover:to-green-800"
                    >
                      NEXT STEP
                    </button>
                  </div>
                </div>
              )}

              {/* ========== STEP 3 ========== */}
              {step === 3 && (
                <div className="space-y-4 max-w-2xl">
                  <div className="grid md:grid-cols-[220px_1fr] items-center gap-3">
                    <label className="font-semibold text-[#0b2a4a]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className={`${inputBase} ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs md:ml-[220px] -mt-2">
                      {errors.name}
                    </p>
                  )}

                  <div className="grid md:grid-cols-[220px_1fr] items-center gap-3">
                    <label className="font-semibold text-[#0b2а4a]">Email</label>
                    <input
                      type="email"
                      className={`${inputBase} ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs md:ml-[220px] -mt-2">
                      {errors.email}
                    </p>
                  )}

                  <div className="grid md:grid-cols-[220px_1fr] items-center gap-3">
                    <label className="font-semibold text-[#0b2a4a]">Phone</label>
                    <input
                      type="text"
                      className={`${inputBase} ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs md:ml-[220px] -mt-2">
                      {errors.phone}
                    </p>
                  )}

                  <div className="md:ml-[220px] flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                    <label className="text-sm">
                      I accept the{" "}
                      <a href="/terms" className="underline text-blue-600">
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-red-500 text-xs md:ml-[220px]">
                      {errors.terms}
                    </p>
                  )}

                  <div className="pt-4 md:ml-[220px] flex items-center gap-3">
                    <button
                      onClick={goBack}
                      className="px-5 h-11 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      Back
                    </button>

                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full md:w-[280px] bg-gradient-to-b from-green-500 to-green-700 text-white h-11 font-extrabold rounded-md shadow-md hover:from-green-600 hover:to-green-800 disabled:opacity-60"
                    >
                      {submitting ? "Submitting..." : "GET QUOTES"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* end card */}
      </div>
    </div>
  );
};

export default MovingCalculator;
