"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ReactNiceSelect from "@/components/shared/Inputs/ReactNiceSelect";
import Link from "next/link";
import { useState } from "react";
import { submitContact } from "@/utils/contactApi";

const SERVICE_OPTIONS = [
	{ value: "",             optionName: "Choose a Service" },
	{ value: "PhD India",        optionName: "PhD India" },
	{ value: "PhD Abroad",       optionName: "PhD Abroad" },
	{ value: "Study Abroad",     optionName: "Study Abroad" },
	{ value: "Research Support", optionName: "Research Support" },
	{ value: "Other",            optionName: "Other" },
];

const Contact2 = () => {
	const [form, setForm]     = useState({ fullName: "", email: "", phone: "", service: "", message: "" });
	const [status, setStatus] = useState(null);
	const [errMsg, setErrMsg] = useState("");

	const handleChange  = (e)   => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
	const handleService = (val) => setForm((p) => ({ ...p, service: val }));

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.fullName || !form.email || !form.message) {
			setErrMsg("Please fill in all required fields.");
			setStatus("error");
			return;
		}
		setStatus("sending");
		setErrMsg("");
		try {
			await submitContact({
				fullName: form.fullName,
				email:    form.email,
				phone:    form.phone,
				service:  form.service,
				message:  form.message,
			});
			setStatus("success");
			setForm({ fullName: "", email: "", phone: "", service: "", message: "" });
		} catch (err) {
			setErrMsg(err?.response?.data?.message || "Something went wrong. Please try again.");
			setStatus("error");
		}
	};

	return (
		<section className="tj-contact-section section-gap section-gap-x mb-9">
			<style>{`
				#contact-form-2 input,
				#contact-form-2 textarea {
					color: black !important;
				}
				#contact-form-2 input::placeholder,
				#contact-form-2 textarea::placeholder {
					color: rgba(255,255,255,0.6) !important;
				}
				#contact-form-2 input:-webkit-autofill {
					-webkit-text-fill-color: #ffffff !important;
				}
				.global-map {
					height: 100%;
				}
				.global-map-img {
					height: 100%;
					min-height: 520px;
				}
			`}</style>

			<div className="container">
				<div className="row align-items-stretch">

					<div className="col-lg-6 mb-4 mb-lg-0">
						<div
							style={{
								borderRadius: 16,
								overflow: "hidden",
								height: "100%",
								minHeight: 520,
								boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
							}}
						>
							{/* <img src="/images/bg/map.svg" alt="Image" /> */}

							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.542481756926!2d76.6592754750418!3d10.769700389378642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba86de3f032c3bf%3A0x9748913a691cbde4!2sINSPIRE%20EDUCATION%20SERVICE%20Study%20Abroad%20%26%20PhD%20consultants!5e0!3m2!1sen!2sin!4v1775809080224!5m2!1sen!2sin"
								width="100%"
								height="100%"
								style={{
									border: 0,
									display: "block",
									minHeight: 520,
								}}
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								title="Inspire Education Service Location"
							/>

							{/* Location indicators removed — not applicable for iframe map
							<div className="location-indicator loc-1"> ... </div>
							<div className="location-indicator loc-2"> ... </div>
							<div className="location-indicator loc-3"> ... </div>
							*/}
						</div>
					</div>

					{/* ── Form Column ────────────────────────────────────────── */}
					<div className="col-lg-6">
						<div className="contact-form style-2 wow fadeInUp" data-wow-delay=".4s">
							<div className="sec-heading">
								<span className="sub-title text-white">
									<i className="tji-box"></i>Get in Touch
								</span>
								<h2 className="sec-title title-anim">
									Drop Us a <span>Line.</span>
								</h2>
							</div>

							<form id="contact-form-2" onSubmit={handleSubmit} noValidate>
								<div className="row wow fadeInUp" data-wow-delay=".5s">
									<div className="col-sm-6">
										<div className="form-input">
											<input
												type="text"
												name="fullName"
												placeholder="Full Name *"
												value={form.fullName}
												onChange={handleChange}
												required
											/>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="form-input">
											<input
												type="email"
												name="email"
												placeholder="Email Address *"
												value={form.email}
												onChange={handleChange}
												required
											/>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="form-input">
											<input
												type="tel"
												name="phone"
												placeholder="Phone Number"
												value={form.phone}
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="form-input">
											<div className="tj-nice-select-box">
												<div className="tj-select">
													<ReactNiceSelect
														selectedIndex={0}
														options={SERVICE_OPTIONS}
														onChange={(val) => handleService(val)}
													/>
												</div>
											</div>
										</div>
									</div>
									<div className="col-sm-12">
										<div className="form-input message-input">
											<textarea
												name="message"
												placeholder="Type message *"
												value={form.message}
												onChange={handleChange}
												required
											/>
										</div>
									</div>

									{status === "success" && (
										<div className="col-12" style={{ marginBottom: 12 }}>
											<p style={{ color: "#4ade80", fontWeight: 600, fontSize: 14 }}>
												✓ Message sent successfully! We&apos;ll get back to you soon.
											</p>
										</div>
									)}
									{status === "error" && errMsg && (
										<div className="col-12" style={{ marginBottom: 12 }}>
											<p style={{ color: "#f87171", fontWeight: 600, fontSize: 14 }}>
												⚠ {errMsg}
											</p>
										</div>
									)}

									<div className="submit-btn">
										<ButtonPrimary
											text={status === "sending" ? "Sending…" : "Send Message"}
											type="submit"
											disabled={status === "sending"}
										/>
									</div>
								</div>
							</form>
						</div>
					</div>

				</div>
			</div>

			{/* <div className="bg-shape-1">
				<img src="/images/shape/pattern-2.svg" alt="" />
			</div>
			<div className="bg-shape-2">
				<img src="/images/shape/pattern-3.svg" alt="" />
			</div> */}
		</section>
	);
};

export default Contact2;