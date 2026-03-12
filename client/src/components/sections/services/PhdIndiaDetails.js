"use client";
import BootstrapWrapper from "@/components/shared/wrappers/BootstrapWrapper";
import Image from "next/image";
import Link from "next/link";

const PhdIndiaDetails = () => {
	const faqData = [
		{
			question: "What is the PhD admission process in India?",
			answer: "The PhD admission process in India typically involves entrance examinations, research proposal submission, and interviews. Most universities require candidates to have a master's degree with a minimum percentage. We guide you through each step, from selecting the right university to preparing for entrance tests and interviews, ensuring you meet all requirements and deadlines."
		},
		{
			question: "How long does it take to complete a PhD in India?",
			answer: "A PhD in India typically takes 3-5 years to complete, depending on the field of study and research progress. The duration includes coursework (usually in the first year), comprehensive examinations, research work, and thesis submission. We help you understand the timeline and requirements specific to your chosen university and program."
		},
		{
			question: "What funding options are available for PhD students in India?",
			answer: "PhD students in India can access various funding options including UGC-NET JRF, CSIR fellowships, DST INSPIRE, university fellowships, and project-based funding. We provide comprehensive guidance on identifying and applying for these scholarships and fellowships, helping you secure financial support for your doctoral studies."
		},
		{
			question: "Do I need to clear entrance exams for PhD admission in India?",
			answer: "Most Indian universities require candidates to clear entrance examinations such as UGC-NET, GATE, or university-specific tests. However, some universities offer direct admission based on merit or interviews. We help you identify universities that match your qualifications and prepare you for required entrance tests and interviews."
		},
		{
			question: "Can I pursue PhD while working in India?",
			answer: "Yes, many Indian universities offer part-time PhD programs for working professionals. These programs have flexible schedules with evening or weekend classes. We help you find suitable part-time PhD programs that align with your work commitments and academic goals, ensuring you can balance both effectively."
		},
		{
			question: "What research areas can I pursue for PhD in India?",
			answer: "Indian universities offer PhD programs across diverse fields including Science, Engineering, Humanities, Social Sciences, Management, Medicine, and more. We help you identify research areas that align with your interests, find suitable supervisors, and develop a compelling research proposal that demonstrates the significance of your chosen topic."
		}
	];

	const keyFeatures = [
		"Comprehensive University Research",
		"Research Proposal Development",
		"Entrance Exam Preparation",
		"Interview Coaching",
		"Scholarship & Fellowship Guidance",
		"Application Documentation Support",
		"Supervisor Connection Assistance"
	];

	const benefits = [
		{
			number: "01",
			title: "Expert Guidance from<br/>Experienced Counselors",
			description: "Our team comprises PhD holders and admission experts who understand the intricacies of Indian PhD programs. They provide personalized guidance tailored to your research interests and career goals."
		},
		{
			number: "02",
			title: "Comprehensive Application<br/>Support",
			description: "From university selection to final submission, we assist with every aspect of your application including research proposal writing, documentation, and entrance exam preparation."
		},
		{
			number: "03",
			title: "Higher Success Rate<br/>& Faster Processing",
			description: "Our structured approach and insider knowledge significantly improve your chances of admission while reducing the time and stress involved in the application process."
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
									src="/new-imges/serives-image/image-5.jpg"
									alt="PhD India"
									width={1170}
									height={500}
									style={{ height: "auto", width: "100%" }}
								/>
							</div>

							{/* Title */}
							<h2 className="title title-anim">
								Expert guidance for pursuing PhD programs in India with comprehensive support
							</h2>

							<div className="blog-text">
								<p className="wow fadeInUp" data-wow-delay=".3s">
									Our PhD India services provide comprehensive support for aspiring doctoral candidates seeking admission to prestigious Indian universities. We guide you through every step of the application process, ensuring you meet all requirements and present a compelling application.
								</p>
								<p className="wow fadeInUp" data-wow-delay=".3s">
									With deep knowledge of Indian academic institutions and their specific requirements, we help you identify the best programs that align with your research interests and career goals. Our team provides personalized assistance throughout your PhD journey.
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
													src="/new-imges/serives-image/image-2.jpg "
													alt="PhD India - Detail 1"
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
													src="/new-imges/serives-image/image-1.jpg"
													alt="PhD India - Detail 2"
													fill
													sizes="(max-width: 576px) 100vw, 50vw"
													style={{ objectFit: "cover", objectPosition: "center" }}
												/>
											</div>
										</div>
									</div>
								</div>

								<h3 className="wow fadeInUp" data-wow-delay=".3s">
									Why Choose Our PhD India Services?
								</h3>
								<p className="wow fadeInUp" data-wow-delay=".3s">
									Navigate the PhD admission process in India with expert guidance and personalized support. We provide end-to-end support with a proven track record of success. Our personalized approach ensures that each student receives tailored guidance based on their unique background, goals, and circumstances. With 150+ Successful Applications, we have the expertise and connections to help you achieve your academic aspirations.
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
								<div className="tj-nav__post previous" style={{ visibility: "hidden" }}>
									<div className="tj-nav-post__nav prev_post">
										<Link href="#">
											<span><i className="tji-arrow-left"></i></span>
											Previous
										</Link>
									</div>
								</div>
								<Link href="/services" className="tj-nav-post__grid">
									<i className="tji-window"></i>
								</Link>
								<div className="tj-nav__post next">
									<div className="tj-nav-post__nav next_post">
										<Link href="/services/study-abroad">
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

export default PhdIndiaDetails;