"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ReactNiceSelect from "@/components/shared/Inputs/ReactNiceSelect";
import Link from "next/link";
import { useState } from "react";
import { submitContact } from "@/utils/contactApi";

const SERVICE_OPTIONS = [
	{ value: "",  optionName: "Choose a Service" },
	{ value: "PhD India",      optionName: "PhD India" },
	{ value: "PhD Abroad",     optionName: "PhD Abroad" },
	{ value: "Study Abroad",   optionName: "Study Abroad" },
	{ value: "Research Support", optionName: "Research Support" },
	{ value: "Other",          optionName: "Other" },
];

const Contact2 = () => {
	const [form, setForm]       = useState({ fullName: "", email: "", phone: "", service: "", message: "" });
	const [status, setStatus]   = useState(null); // null | "sending" | "success" | "error"
	const [errMsg, setErrMsg]   = useState("");

	const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

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
		<section className="tj-contact-section section-gap section-gap-x">
			<style>{`
				/* ── white text in all contact form inputs / textarea ── */
				#contact-form-2 input,
				#contact-form-2 textarea {
					color: #ffffff !important;
				}
				#contact-form-2 input::placeholder,
				#contact-form-2 textarea::placeholder {
					color: rgba(255,255,255,0.6) !important;
				}
				#contact-form-2 input:-webkit-autofill {
					-webkit-text-fill-color: #ffffff !important;
				}
			`}</style>

			<div className="container">
				<div className="row">
					<div className="col-lg-6">
						<div className="global-map wow fadeInUp" data-wow-delay=".3s">
							<div className="global-map-img">
								<img src="/images/bg/map.svg" alt="Image" />
								<div className="location-indicator loc-1">
									<div className="location-tooltip">
										<span>Head office:</span>
										<p>993 Renner Burg, West Rond, MT 94251-030, USA.</p>
										<Link href="tel:10095447818">P: +1 (009) 544-7818</Link>
										<Link href="mailto:support@bexon.com">M: support@bexon.com</Link>
									</div>
								</div>
								<div className="location-indicator loc-2">
									<div className="location-tooltip">
										<span>Regional office:</span>
										<p>Hessisch Lichtenau 37235, Kassel, Germany.</p>
										<Link href="tel:10098801810">P: +1 (009) 880-1810</Link>
										<Link href="mailto:support@bexon.com">M: support@bexon.com</Link>
									</div>
								</div>
								<div className="location-indicator loc-3">
									<div className="location-tooltip">
										<span>Regional office:</span>
										<p>32 Altamira, State of Pará, Brazil.</p>
										<Link href="tel:10095447818">P: +1 (009) 544-7818</Link>
										<Link href="mailto:support@bexon.com">M: support@bexon.com</Link>
									</div>
								</div>
							</div>
						</div>
					</div>

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

									{/* Status messages */}
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

			<div className="bg-shape-1">
				<img src="/images/shape/pattern-2.svg" alt="" />
			</div>
			<div className="bg-shape-2">
				<img src="/images/shape/pattern-3.svg" alt="" />
			</div>
		</section>
	);
};


export default Contact2;