import Link from "next/link";

const TermsAndConditionsPrimary = () => {
	return (
		<section className="terms-and-conditions section-gap">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-10">
						<div className="terms-and-conditions-wrapper">
 
							{/* Header */}
							<div>
								<h2>Privacy Policy</h2>
								<p className="muted">Last updated: April 2026</p>
								<p>
									At <strong>Inspire Education Service</strong>, your trust
									matters to us. This Privacy Policy explains how we collect,
									use, and protect your information when you interact with our
									website or services.
								</p>
							</div>
 
							{/* Table of Contents */}
							<nav className="toc" aria-label="Table of contents">
								<h2>Table of Contents</h2>
								<ol>
									<li>
										<button className="tj-scroll-btn" data-target="#information-collect">
											Information We Collect
										</button>
									</li>
									<li>
										<button className="tj-scroll-btn" data-target="#how-we-use">
											How We Use Your Information
										</button>
									</li>
									<li>
										<button className="tj-scroll-btn" data-target="#communication">
											Communication
										</button>
									</li>
									<li>
										<button className="tj-scroll-btn" data-target="#data-protection">
											Data Protection
										</button>
									</li>
									<li>
										<button className="tj-scroll-btn" data-target="#sharing-information">
											Sharing of Information
										</button>
									</li>
									<li>
										<button className="tj-scroll-btn" data-target="#cookies">
											Cookies &amp; Website Usage
										</button>
									</li>
									<li>
										<button className="tj-scroll-btn" data-target="#your-rights">
											Your Rights
										</button>
									</li>
									<li>
										<button className="tj-scroll-btn" data-target="#policy-updates">
											Updates to This Policy
										</button>
									</li>
									<li>
										<button className="tj-scroll-btn" data-target="#contact-us">
											Contact Us
										</button>
									</li>
								</ol>
							</nav>
 
							{/* Section 1 */}
							<div id="information-collect">
								<h3>1. Information We Collect</h3>
								<p>
									When you connect with us (through forms, calls, or WhatsApp),
									we may collect:
								</p>
								<ul>
									<li>Your name, email address, and phone number</li>
									<li>
										Academic details (qualification, interests, preferred
										country/course)
									</li>
									<li>
										Any additional information you choose to share with us
									</li>
								</ul>
								<p>We only collect what&apos;s necessary to guide you better.</p>
							</div>
 
							{/* Section 2 */}
							<div id="how-we-use">
								<h3>2. How We Use Your Information</h3>
								<p>We use your information to:</p>
								<ul>
									<li>Provide counselling and admission guidance</li>
									<li>
										Suggest suitable universities, programs, or research
										opportunities
									</li>
									<li>Respond to your enquiries and support requests</li>
									<li>
										Share updates, important notifications, or opportunities
									</li>
								</ul>
								<p>We do not sell your personal data to third parties.</p>
							</div>
 
							{/* Section 3 */}
							<div id="communication">
								<h3>3. Communication</h3>
								<p>
									By submitting your details, you agree that we may contact you
									via:
								</p>
								<ul>
									<li>Phone calls</li>
									<li>Email</li>
									<li>WhatsApp or SMS</li>
								</ul>
								<p>This is only to assist you with your academic journey.</p>
							</div>
 
							{/* Section 4 */}
							<div id="data-protection">
								<h3>4. Data Protection</h3>
								<p>
									We take reasonable steps to keep your information safe and
									secure. However, no online platform is 100% secure, so we
									encourage you to share information responsibly.
								</p>
							</div>
 
							{/* Section 5 */}
							<div id="sharing-information">
								<h3>5. Sharing of Information</h3>
								<p>
									We may share limited details only when required, such as:
								</p>
								<ul>
									<li>
										With universities or institutions (for admission processes)
									</li>
									<li>
										With trusted partners assisting in your application
									</li>
								</ul>
								<p>
									We ensure this is done responsibly and only when necessary.
								</p>
							</div>
 
							{/* Section 6 */}
							<div id="cookies">
								<h3>6. Cookies &amp; Website Usage</h3>
								<p>
									Our website may use basic cookies to improve your browsing
									experience and understand usage patterns.
								</p>
							</div>
 
							{/* Section 7 */}
							<div id="your-rights">
								<h3>7. Your Rights</h3>
								<p>You can:</p>
								<ul>
									<li>Request access to your data</li>
									<li>Ask us to update or delete your information</li>
									<li>Opt out of communications anytime</li>
								</ul>
							</div>
 
							{/* Section 8 */}
							<div id="policy-updates">
								<h3>8. Updates to This Policy</h3>
								<p>
									We may update this Privacy Policy occasionally. Any changes
									will be reflected on this page.
								</p>
							</div>
 
							{/* Section 9 */}
							<div id="contact-us">
								<h3>9. Contact Us</h3>
								<p>If you have any questions, feel free to reach out:</p>
								<p>
									📧{" "}
									<Link href="mailto:inspireeduservice001@gmail.com">
										inspireeduservice001@gmail.com
									</Link>
								</p>
							</div>
 
							<p className="muted">
								<small>
									This Privacy Policy page is provided for general guidance only
									and does not constitute legal advice. Please consult your
									legal advisor to adapt it to your specific needs and local
									laws.
								</small>
							</p>
 
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default TermsAndConditionsPrimary;