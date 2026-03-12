import Image from "next/image";

const CeoSection = ({ type }) => {
	return (
		<section className="tj-about-section-2 section-gap section-gap-x">
			<div className="container">
				<div className="row align-items-center">

					{/* Left — Content */}
					<div className="col-xl-6 col-lg-6 order-lg-1 order-2">
						<div className="about-content-area">
							<div className={`sec-heading ${type === 2 ? "" : "style-3"}`}>
								<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
									<i className="tji-box"></i>Leadership
								</span>
								<h2 className="sec-title title-anim">
									From the Desk of India&apos;s No.1 PhD Mentor
								</h2>

								{/* Content paragraphs */}
								<p className="desc wow fadeInUp" data-wow-delay=".4s" style={{ marginTop: 16 }}>
									In 2011, Inspire was born from a vision — to guide students with purpose and care. Today, we are proud to be India&apos;s No.1 PhD guidance platform, supporting scholars across 17 countries.
								</p>
								<p className="desc wow fadeInUp" data-wow-delay=".45s" style={{ marginTop: 12, marginBottom: 0 }}>
									If you&apos;re on a research journey, you&apos;re not alone. With Inspire, you have a partner who believes in your potential.
								</p>

								{/* Name & Department */}
								<div className="wow fadeInUp" data-wow-delay=".5s" style={{ marginTop: 28 }}>
									<p className="desc" style={{ fontWeight: 600, fontSize: 17, color: "#111827", marginBottom: 4 }}>
										— Ahammed Farzin
									</p>
									<span style={{
										display: "inline-block",
										fontSize: 14,
										fontWeight: 600,
										color: "#fff",
										background: "linear-gradient(135deg,#1a598a,#015599)",
										padding: "4px 16px",
										borderRadius: 20,
										letterSpacing: 0.5,
									}}>
										Chief Executive Officer
									</span>
								</div>
							</div>
						</div>

						{/* Quote / Highlight */}
						<div className="about-bottom-area" style={{ marginTop: 24 }}>
							<div
								className="mission-vision-box wow fadeInLeft"
								data-wow-delay=".5s"
								style={{ flex: 1 }}
							>
								<h4 className="title">Philosophy</h4>
								<p className="desc">
									&quot;Every student carries the potential for greatness. Our role is simply to clear the path and walk alongside them.&quot;
								</p>
								<ul className="list-items">
									<li><i className="tji-list"></i>Founded in 2011</li>
									<li><i className="tji-list"></i>500+ PhD Placements Worldwide</li>
								</ul>
							</div>
							<div
								className="mission-vision-box wow fadeInRight"
								data-wow-delay=".5s"
								style={{ flex: 1 }}
							>
								<h4 className="title">Expertise</h4>
								<p className="desc">
									Specializing in PhD admissions, research proposal development, and international scholarship guidance across all major disciplines.
								</p>
								<ul className="list-items">
									<li><i className="tji-list"></i>Scholars across 17 Countries</li>
									<li><i className="tji-list"></i>India&apos;s No.1 PhD Platform</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Right — Image */}
					<div className="col-xl-6 col-lg-6 order-lg-2 order-1">
						<div
							className="about-img-area style-2 wow fadeInRight"
							data-wow-delay=".3s"
						>
							<div className="about-img overflow-hidden">
								<Image
									data-speed=".8"
									src="/new-imges/ceo/ceo.webp"
									alt="CEO - Ahammed Farzin"
									width={591}
									height={639}
									style={{ width: "100%", height: "auto" }}
								/>
							</div>
						</div>
					</div>

				</div>
			</div>
		</section>
	);
};

export default CeoSection;