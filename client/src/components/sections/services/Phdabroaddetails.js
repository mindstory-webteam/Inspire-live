"use client";
import BootstrapWrapper from "@/components/shared/wrappers/BootstrapWrapper";
import Image from "next/image";
import Link from "next/link";

const PhdAbroadDetails = () => {
	const faqData = [
		{
			question: "How is PhD abroad different from PhD in India?",
			answer: "PhD programs abroad typically offer structured coursework, diverse research facilities, international collaborations, and better funding opportunities. They often have shorter durations (3-4 years) with comprehensive stipends covering tuition and living expenses. We help you understand these differences and choose programs that offer the best research environment for your field."
		},
		{
			question: "Do I need a master's degree for PhD abroad?",
			answer: "Requirements vary by country and university. US and Canada often accept students directly after bachelor's degree, while UK, Europe, and Australia typically require a master's degree. Some programs offer integrated master's-PhD tracks. We help you identify programs that match your educational background and career aspirations."
		},
		{
			question: "How do I find a PhD supervisor abroad?",
			answer: "Finding the right supervisor is crucial for PhD success. We help you research faculty members whose work aligns with your interests, prepare compelling emails to reach out to potential supervisors, and develop strong research proposals that demonstrate your capability and fit with their research group."
		},
		{
			question: "What funding options are available for PhD abroad?",
			answer: "International PhD students can access university scholarships, government funding (like Fulbright, Commonwealth), research assistantships, teaching assistantships, and external fellowships. Many programs offer full funding covering tuition and stipend. We guide you through identifying and applying for these opportunities to minimize your financial burden."
		},
		{
			question: "What are the English language requirements for PhD abroad?",
			answer: "Most universities require IELTS (minimum 6.5-7.0) or TOEFL (minimum 90-100) scores. Some may accept alternative proof of English proficiency if you studied in English previously. Certain programs may have higher requirements. We help you understand specific requirements for your target universities and prepare accordingly."
		},
		{
			question: "How long does the PhD application process take?",
			answer: "The process typically takes 6-12 months from initial research to admission decision. This includes identifying programs and supervisors (2-3 months), preparing applications and research proposals (2-3 months), submitting applications, waiting for responses (2-4 months), and visa processing (1-2 months). We help you manage this timeline efficiently with our structured approach."
		}
	];

	const keyFeatures = [
		"Research Topic Refinement",
		"Supervisor Identification",
		"Research Proposal Writing",
		"Funding Application Support",
		"Publication Guidance",
		"Interview Preparation",
		"Visa & Documentation Support"
	];

	const benefits = [
		{
			number: "01",
			title: "Strategic Supervisor<br/>Matching",
			description: "We help you identify and connect with potential supervisors whose research aligns with your interests, significantly improving your chances of securing admission and funding."
		},
		{
			number: "02",
			title: "Research Proposal<br/>Excellence",
			description: "Our experts guide you in developing compelling research proposals that demonstrate originality, feasibility, and significant contribution to your field of study."
		},
		{
			number: "03",
			title: "Funding & Scholarship<br/>Maximization",
			description: "We assist in identifying and applying for fully-funded positions, scholarships, and assistantships that cover tuition fees and provide living stipends throughout your PhD journey."
		}
	];

	return (
		<section className="tj-service-area section-gap">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="post-details-wrapper">
							{/* Hero Image */}
							<div className="blog-images wow fadeInUp" data-wow-delay=".1s">
								<Image
									src="/new-imges/serives-image/image-2.jpg"
									alt="PhD Abroad"
									width={1170}
									height={500}
									style={{ height: "1000px", width: "100%" }}
								/>
							</div>

							{/* Title */}
							<h2 className="title title-anim">
								Pursue your doctoral dreams at world-renowned international universities
							</h2>

							<div className="blog-text">
								<p className="wow fadeInUp" data-wow-delay=".3s">
									Our PhD Abroad services are designed specifically for researchers seeking doctoral opportunities at international universities. We provide specialized support for crafting compelling research proposals, identifying potential supervisors, and securing funding through scholarships and assistantships.
								</p>
								<p className="wow fadeInUp" data-wow-delay=".3s">
									With connections to leading universities worldwide, we help you find programs that match your research interests and career aspirations. Our team guides you through the unique requirements of international PhD applications, including language tests, interviews, and documentation.
								</p>

								{/* Key Features List */}
								<ul className="wow fadeInUp" data-wow-delay=".3s">
									{keyFeatures.map((feature, index) => (
										<li key={index}>
											<span><i className="tji-check"></i></span>
											{feature}
										</li>
									))}
								</ul>

								{/* Images Section — fixed equal height */}
								<div className="images-wrap">
									<div className="row">
										<div className="col-sm-6">
											<div
												className="image-box wow fadeInUp"
												data-wow-delay=".3s"
												style={{ position: "relative", width: "100%", height: 320, borderRadius: 10, overflow: "hidden" }}
											>
												<Image
													src="/new-imges/serives-image/image-3.jpg "
													alt="PhD Abroad - Detail 1"
													fill
													sizes="(max-width: 576px) 100vw, 50vw"
													style={{ objectFit: "cover", objectPosition: "center" }}
												/>
											</div>
										</div>
										<div className="col-sm-6">
											<div
												className="image-box wow fadeInUp"
												data-wow-delay=".5s"
												style={{ position: "relative", width: "100%", height: 320, borderRadius: 10, overflow: "hidden" }}
											>
												<Image
													src="/new-imges/serives-image/image-2.jpg "
													alt="PhD Abroad - Detail 2"
													fill
													sizes="(max-width: 576px) 100vw, 50vw"
													style={{ objectFit: "cover", objectPosition: "center" }}
												/>
											</div>
										</div>
									</div>
								</div>

								<h3 className="wow fadeInUp" data-wow-delay=".3s">
									Why Choose Our PhD Abroad Services?
								</h3>
								<p className="wow fadeInUp" data-wow-delay=".3s">
									Access world-class PhD programs abroad with expert assistance in applications, funding, and research opportunities. We provide end-to-end support with a proven track record of success. Our personalized approach ensures that each student receives tailored guidance based on their unique background, goals, and circumstances. With 100+ PhD Placements Worldwide, we have the expertise and connections to help you achieve your academic aspirations.
								</p>

								{/* Benefits */}
								<div className="details-content-box">
									{benefits.map((benefit, index) => (
										<div
											key={index}
											className="service-details-item wow fadeInUp"
											data-wow-delay={`.${(index + 1) * 2}s`}
										>
											<span className="number">{benefit.number}.</span>
											<h6 className="title" dangerouslySetInnerHTML={{ __html: benefit.title }} />
											<div className="desc">
												<p>{benefit.description}</p>
											</div>
										</div>
									))}
								</div>

								{/* FAQ */}
								<h3 className="wow fadeInUp" data-wow-delay=".3s">
									Frequently Asked Questions
								</h3>
								<BootstrapWrapper>
									<div className="accordion tj-faq style-2" id="faqOne">
										{faqData.map((faq, index) => (
											<div
												key={index}
												className={`accordion-item ${index === 0 ? 'active' : ''} wow fadeInUp`}
												data-wow-delay=".3s"
											>
												<button
													className={`faq-title ${index !== 0 ? 'collapsed' : ''}`}
													type="button"
													data-bs-toggle="collapse"
													data-bs-target={`#faq-${index + 1}`}
													aria-expanded={index === 0 ? 'true' : 'false'}
												>
													{faq.question}
												</button>
												<div
													id={`faq-${index + 1}`}
													className={`collapse ${index === 0 ? 'show' : ''}`}
													data-bs-parent="#faqOne"
												>
													<div className="accordion-body faq-text">
														<p>{faq.answer}</p>
													</div>
												</div>
											</div>
										))}
									</div>
								</BootstrapWrapper>
							</div>

							{/* Navigation */}
							<div className="tj-post__navigation mb-0 wow fadeInUp" data-wow-delay="0.3s">
								<div className="tj-nav__post previous">
									<div className="tj-nav-post__nav prev_post">
										<Link href="/services/study-abroad">
											<span><i className="tji-arrow-left"></i></span>
											Previous
										</Link>
									</div>
								</div>
								<Link href="/services" className="tj-nav-post__grid">
									<i className="tji-window"></i>
								</Link>
								<div className="tj-nav__post next" style={{ visibility: "hidden" }}>
									<div className="tj-nav-post__nav next_post">
										<Link href="#">
											Next
											<span><i className="tji-arrow-right"></i></span>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default PhdAbroadDetails;