import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import Image from "next/image";
const About3 = ({ type }) => {
	return (
		<section className="tj-about-section-2 section-gap section-gap-x">
			<div className="container">
				<div className="row">
					<div className="col-xl-6 col-lg-6 order-lg-1 order-2">
						<div
							className="about-img-area style-2 wow fadeInLeft"
							data-wow-delay=".3s"
						>
							<div className="about-img overflow-hidden">
								<Image
									data-speed=".8"
									src="/new-imges/about-images/img-1.png"
									alt=""
									width={591}
									height={639}
								/>
							</div>
						</div>
					</div>
					<div className="col-xl-6 col-lg-6 order-lg-2 order-1">
						<div className="about-content-area">
							<div className={`sec-heading ${type === 2 ? "" : "style-3"}`}>
								<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
									<i className="tji-box"></i>Get to Know Us
								</span>
								<h2 className="sec-title title-anim">
									{type === 2 ? (
										<>
											Our Commitment to Students & <span>Research Success.</span>
										</>
									) : (
										"Our Commitment to Students & Research Success"
									)}
								</h2>

								{/* ── Two intro paragraphs above mission/vision ── */}
								<p className="desc wow fadeInUp" data-wow-delay=".4s" style={{ marginTop: "16px" }}>
									At Inspire Live, we are dedicated to transforming the academic journey of students and researchers worldwide. With years of expertise in education consultancy, we have helped hundreds of scholars navigate complex university admissions, secure research positions, and achieve their academic goals.
								</p>
								<p className="desc wow fadeInUp" data-wow-delay=".45s" style={{ marginTop: "12px", marginBottom: "0" }}>
									Our team of experienced academic advisors brings together deep knowledge across disciplines, offering guidance that is both practical and personalized — ensuring every student receives the support they need to succeed at every stage of their academic career.
								</p>

							</div>
						</div>
						<div className="about-bottom-area">
							<div
								className="mission-vision-box wow fadeInLeft"
								data-wow-delay=".5s"
							>
								<h4 className="title">Our Mission</h4>
								<p className="desc">
									Our mission is to empower students and researchers by providing transparent, reliable, and expert academic guidance for PhD programs and international education.
								</p>
								<ul className="list-items">
									<li>
										<i className="tji-list"></i>Academic Excellence & Research Support
									</li>
									<li>
										<i className="tji-list"></i>Personalized Student Guidance
									</li>
									<li>
										{/* <i className="tji-list"></i>Ethical & Transparent Consulting */}
									</li>
								</ul>
							</div>
							<div
								className="mission-vision-box wow fadeInRight"
								data-wow-delay=".5s"
							>
								<h4 className="title">Our Vision</h4>
								<p className="desc">
									Our vision is to become a globally recognized education consultancy, helping students achieve world-class academic opportunities and research success.
								</p>
								<ul className="list-items">
									<li>
										<i className="tji-list"></i>Global Education Leadership
									</li>
									<li>
										<i className="tji-list"></i>Research & Innovation Support
									</li>
									<li>
										{/* <i className="tji-list"></i>Sustainable Academic Success */}
									</li>
								</ul>
							</div>
						</div>
						{/* <div className="about-btn-area wow fadeInUp" data-wow-delay=".5s">
							<ButtonPrimary text={"Learn More About Us"} url={"/about"} />
						</div> */}
					</div>
				</div>
			</div>
		</section>
	);
};

export default About3;