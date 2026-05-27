"use client";

import { useState } from "react";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import BackToTop from "@/components/shared/others/BackToTop";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";

// ─── Step field config ──────────────────────────────────────────────────────

const STEPS = [
  {
    id: 1,
    title: "Personal Details",
    fields: [
      { name: "fullName",      label: "Full Name",          type: "text",   placeholder: "Enter your full name",           required: true  },
      { name: "dob",           label: "Date of Birth",      type: "date",   placeholder: "DD/MM/YYYY",                     required: true  },
      { name: "gender",        label: "Gender",             type: "radio",  options: ["Male", "Female", "Other"],          required: true  },
      { name: "contactNumber", label: "Contact Number",     type: "tel",    placeholder: "Enter your 10-digit phone number", required: true },
      { name: "email",         label: "Email",              type: "email",  placeholder: "e.g., yourname@email.com",       required: true  },
      { name: "country",       label: "Country / Region",  type: "select", placeholder: "Select your country",            required: false },
      { name: "address",       label: "Address",            type: "text",   placeholder: "",                               required: false },
      { name: "city",          label: "City",               type: "text",   placeholder: "",                               required: false },
      { name: "zip",           label: "Zip / Postal Code",  type: "text",   placeholder: "",                               required: false },
    ],
  },
  {
    id: 2,
    title: "Academic Background",
    fields: [
      { name: "highestQualification", label: "Highest Qualification", type: "select",
        options: ["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Other"],
        required: true },
      { name: "institution",   label: "Institution Name",   type: "text",  placeholder: "Name of your institution",       required: true  },
      { name: "graduationYear",label: "Year of Graduation", type: "text",  placeholder: "e.g., 2022",                    required: true  },
      { name: "gpa",           label: "GPA / Percentage",   type: "text",  placeholder: "e.g., 8.5 / 85%",               required: false },
      { name: "majorSubject",  label: "Major / Subject",    type: "text",  placeholder: "e.g., Computer Science",         required: true  },
      { name: "englishScore",  label: "English Proficiency Score (if any)", type: "text",
        placeholder: "e.g., IELTS 7.0 / TOEFL 100",                                                                        required: false },
    ],
  },
  {
    id: 3,
    title: "Program Preferences",
    fields: [
      { name: "interestedCountry", label: "Preferred Study Destination", type: "select",
        options: ["USA", "UK", "Canada", "Australia", "Germany", "France", "Other"],
        required: true },
      { name: "programLevel",  label: "Program Level",     type: "select",
        options: ["Undergraduate", "Postgraduate", "PhD", "Diploma / Certificate"],
        required: true },
      { name: "fieldOfStudy",  label: "Field of Study",    type: "text",   placeholder: "e.g., Engineering, Business",   required: true  },
      { name: "intake",        label: "Preferred Intake",  type: "select",
        options: ["January 2026", "May 2026", "September 2026", "January 2027"],
        required: false },
      { name: "budget",        label: "Approximate Budget (USD/year)", type: "text",
        placeholder: "e.g., 20,000 – 30,000",                                                                               required: false },
      { name: "comments",      label: "Additional Comments / Queries", type: "textarea",
        placeholder: "Tell us anything else you'd like us to know…",                                                        required: false },
    ],
  },
];

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh","Belgium",
  "Brazil","Canada","China","Colombia","Croatia","Czech Republic","Denmark","Egypt","Ethiopia",
  "Finland","France","Germany","Ghana","Greece","Hungary","India","Indonesia","Iran","Iraq",
  "Ireland","Israel","Italy","Japan","Jordan","Kenya","Kuwait","Malaysia","Mexico","Morocco",
  "Nepal","Netherlands","New Zealand","Nigeria","Norway","Pakistan","Philippines","Poland",
  "Portugal","Qatar","Romania","Russia","Saudi Arabia","Singapore","South Africa","South Korea",
  "Spain","Sri Lanka","Sweden","Switzerland","Thailand","Turkey","UAE","Uganda","UK","USA",
  "Ukraine","Vietnam","Zimbabwe",
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function initData() {
  const d = {};
  STEPS.forEach(s => s.fields.forEach(f => { d[f.name] = ""; }));
  return d;
}

// ─── Field renderer ─────────────────────────────────────────────────────────

function Field({ field, value, onChange }) {
  const { name, label, type, placeholder, required, options } = field;

  const inputClass =
    "w-full border border-[#c8d4e6] rounded-md px-4 py-3 text-[#1a2e4a] text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent " +
    "placeholder:text-gray-400 bg-white transition";

  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-[#1a2e4a] mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {type === "radio" && (
        <div className="flex flex-wrap gap-6 mt-1">
          {options.map(opt => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-[#1a2e4a]">
              <input
                type="radio"
                name={name}
                value={opt}
                checked={value === opt}
                onChange={e => onChange(name, e.target.value)}
                className="accent-[#1a5276] w-4 h-4"
              />
              {opt}
            </label>
          ))}
        </div>
      )}

      {type === "select" && (
        <select
          value={value}
          onChange={e => onChange(name, e.target.value)}
          className={inputClass + " appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%231a5276%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center]"}
        >
          <option value="">— Select —</option>
          {(options || (name === "country" ? COUNTRIES : [])).map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      )}

      {type === "textarea" && (
        <textarea
          rows={4}
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(name, e.target.value)}
          className={inputClass + " resize-none"}
        />
      )}

      {!["radio","select","textarea"].includes(type) && (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(name, e.target.value)}
          className={inputClass}
        />
      )}
    </div>
  );
}

// ─── Step indicator ─────────────────────────────────────────────────────────

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const active  = n === current;
        const done    = n < current;
        return (
          <div key={n} className="flex items-center">
            <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all duration-300
              ${done   ? "bg-[#1a5276] text-white" : ""}
              ${active ? "bg-[#1a5276] text-white ring-4 ring-[#1a5276]/20 scale-110" : ""}
              ${!done && !active ? "bg-gray-200 text-gray-400" : ""}
            `}>
              {done ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : n}
            </div>
            {n < total && (
              <div className={`w-16 h-0.5 transition-all duration-500 ${done ? "bg-[#1a5276]" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function ApplicationFormPage() {
  const [step, setStep]       = useState(1);
  const [data, setData]       = useState(initData);
  const [submitted, setSub]   = useState(false);
  const [errors, setErrors]   = useState({});

  const currentStep = STEPS[step - 1];

  function handleChange(name, value) {
    setData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const errs = {};
    currentStep.fields.forEach(f => {
      if (f.required && !data[f.name]) errs[f.name] = "This field is required.";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (!validate()) return;
    if (step < STEPS.length) setStep(s => s + 1);
    else setSub(true);
  }

  function handleBack() {
    if (step > 1) setStep(s => s - 1);
  }

  if (submitted) {
    return (
      <>
        <BackToTop />
        <Header headerType={2} />
        <Header headerType={2} isStickyHeader={true} />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f7fb] px-4">
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-[#1a5276] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#1a2e4a] mb-3">Application Submitted!</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Thank you, <strong>{data.fullName || "Applicant"}</strong>. We have received your application and our team will reach out to you shortly.
            </p>
            <a
              href="/"
              className="inline-block bg-[#1a5276] text-white px-8 py-3 rounded-md text-sm font-semibold hover:bg-[#154360] transition"
            >
              Back to Home
            </a>
          </div>
        </div>
        <Footer />
        <ClientWrapper />
      </>
    );
  }

  return (
    <>
      <BackToTop />
      <Header headerType={2} />
      <Header headerType={2} isStickyHeader={true} />

      <div className="min-h-screen bg-[#f4f7fb] py-16 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Page heading */}
          <div className="text-center mb-8">
            <p className="text-[#1a5276] text-xs font-semibold uppercase tracking-widest mb-2">Inspire Education Service</p>
            <h1 className="text-3xl font-bold text-[#1a2e4a]">Application Form</h1>
            <p className="text-gray-500 text-sm mt-2">Complete all steps to submit your application.</p>
          </div>

          {/* Step indicator */}
          <StepIndicator current={step} total={STEPS.length} />

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg px-8 py-10">

            <h2 className="text-base font-bold text-[#1a5276] uppercase tracking-widest mb-8 flex items-center gap-2">
              <span className="w-7 h-7 bg-[#1a5276] text-white rounded-full flex items-center justify-center text-xs font-bold">{step}</span>
              {currentStep.title}
            </h2>

            {currentStep.fields.map(field => (
              <div key={field.name}>
                <Field
                  field={field}
                  value={data[field.name]}
                  onChange={handleChange}
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-xs -mt-4 mb-4">{errors[field.name]}</p>
                )}
              </div>
            ))}

            {/* Nav buttons */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="px-6 py-2.5 rounded-md border border-[#1a5276] text-[#1a5276] text-sm font-semibold hover:bg-[#eaf0f7] transition"
                >
                  ← Back
                </button>
              ) : <div />}

              <button
                onClick={handleNext}
                className="px-8 py-2.5 rounded-md bg-[#1a5276] text-white text-sm font-semibold hover:bg-[#154360] transition shadow-md"
              >
                {step === STEPS.length ? "Submit Application" : "Next →"}
              </button>
            </div>
          </div>

          {/* Progress text */}
          <p className="text-center text-xs text-gray-400 mt-5">
            Step {step} of {STEPS.length}
          </p>
        </div>
      </div>

      <Footer />
      <ClientWrapper />
    </>
  );
}