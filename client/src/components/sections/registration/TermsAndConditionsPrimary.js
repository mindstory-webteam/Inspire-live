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
								<h2>Terms &amp; Conditions</h2>
								<p className="muted">Last updated: April 2026</p>
								<p>
									Welcome to <strong>Inspire Education Service</strong>. By
									using our website or services, you agree to the following
									terms.
								</p>
							</div>

							{/* Table of Contents */}
							<nav className="toc" aria-label="Table of contents">
								<h2>Table of Contents</h2>
								<ol>
									<li>
										<button className="tj-scroll-btn" data-target="#our-services">
											Our Services
										</button>
									</li>
									<li>
										<button className="tj-scroll-btn" data-target="#payments-refunds">
											Payments &amp; Refunds
										</button>
									</li>
									<li>
										<button className="tj-scroll-btn" data-target="#user-responsibility">
											User Responsibility
										</button>
									</li>
									<li>
										<button className="tj-scroll-btn" data-target="#no-guarantee">
											No Guarantee of Admission
										</button>
									</li>
									<li>
										<button className="tj-scroll-btn" data-target="#website-usage">
											Website Usage
										</button>
									</li>
									<li>
										<button className="tj-scroll-btn" data-target="#accuracy">
											Accuracy of Information
										</button>
									</li>
									<li>
										<button className="tj-scroll-btn" data-target="#external-links">
											External Links
										</button>
									</li>
									<li>
										<button className="tj-scroll-btn" data-target="#liability">
											Limitation of Liability
										</button>
									</li>
									<li>
										<button className="tj-scroll-btn" data-target="#user-conduct">
											User Conduct
										</button>
									</li>
									<li>
										<button className="tj-scroll-btn" data-target="#changes">
											Changes to Terms
										</button>
									</li>
									<li>
										<button className="tj-scroll-btn" data-target="#contact">
											Contact
										</button>
									</li>
								</ol>
							</nav>

							{/* Section 1 */}
							<div id="our-services">
								<h3>1. Our Services</h3>
								<p>We provide:</p>
								<ul>
									<li>PhD admission guidance</li>
									<li>Study abroad counselling</li>
									<li>Academic and career support</li>
								</ul>
								<p>
									Our role is to guide and assist — final admission decisions
									are made by universities.
								</p>
							</div>

							{/* Section 2 */}
							<div id="payments-refunds">
								<h3>2. Payments &amp; Refunds</h3>
								<p>
									All fees paid for counselling and guidance are{" "}
									<strong>non-refundable</strong> once services begin. This is
									because our team starts working on your profile immediately
									after payment.
								</p>
							</div>

							{/* Section 3 */}
							<div id="user-responsibility">
								<h3>3. User Responsibility</h3>
								<p>You agree to:</p>
								<ul>
									<li>Provide accurate and honest information</li>
									<li>Submit genuine documents</li>
									<li>Follow university and immigration rules</li>
								</ul>
								<p>Any false information may affect your application.</p>
							</div>

							{/* Section 4 */}
							<div id="no-guarantee">
								<h3>4. No Guarantee of Admission</h3>
								<p>
									While we provide expert guidance, we do not guarantee
									admission, visa approval, or scholarships, as these depend on
									external institutions.
								</p>
							</div>

							{/* Section 5 */}
							<div id="website-usage">
								<h3>5. Website Usage</h3>
								<ul>
									<li>
										Content on this website is for informational purposes only.
									</li>
									<li>
										You may not copy, reuse, or distribute any content without
										permission.
									</li>
								</ul>
							</div>

							{/* Section 6 */}
							<div id="accuracy">
								<h3>6. Accuracy of Information</h3>
								<p>
									We try to keep all information accurate and updated, but:
								</p>
								<ul>
									<li>
										Some details (like university requirements) may change.
									</li>
									<li>
										Users are advised to verify directly with institutions when
										needed.
									</li>
								</ul>
							</div>

							{/* Section 7 */}
							<div id="external-links">
								<h3>7. External Links</h3>
								<p>
									Our website may include links to third-party websites. We are
									not responsible for their content or policies.
								</p>
							</div>

							{/* Section 8 */}
							<div id="liability">
								<h3>8. Limitation of Liability</h3>
								<p>We are not liable for:</p>
								<ul>
									<li>Admission rejections</li>
									<li>Visa denials</li>
									<li>
										Any losses resulting from decisions made based on our
										guidance
									</li>
								</ul>
							</div>

							{/* Section 9 */}
							<div id="user-conduct">
								<h3>9. User Conduct</h3>
								<p>You agree not to:</p>
								<ul>
									<li>Share false, harmful, or illegal content</li>
									<li>Misuse our website or services</li>
								</ul>
							</div>

							{/* Section 10 */}
							<div id="changes">
								<h3>10. Changes to Terms</h3>
								<p>
									We may update these Terms &amp; Conditions at any time.
									Continued use means you accept the updated terms.
								</p>
							</div>

							{/* Section 11 */}
							<div id="contact">
								<h3>11. Contact</h3>
								<p>For any concerns or clarifications:</p>
								<p>
									📧{" "}
									<Link href="mailto:inspireeduservice001@gmail.com">
										inspireeduservice001@gmail.com
									</Link>
								</p>
							</div>

							<p className="muted">
								<small>
									This Terms &amp; Conditions page is provided for general
									guidance only and does not constitute legal advice. Please
									consult your legal advisor to adapt it to your specific needs
									and local laws.
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