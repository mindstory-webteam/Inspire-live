import FunfactSingle from "@/components/shared/funfact/FunfactSingle";

const About9 = () => {
	return (
		<section className="h10-about section-gap">
			<div className="container">
				<div className="row flex-column-reverse flex-md-row ">
					<div className="col-12 col-lg-5 d-block d-md-none d-lg-block">
						<div
							className="about-img-area h10-about-banner wow bounceInLeft"
							data-wow-delay=".3s"
						>
							<div className="about-img overflow-hidden">
								<img
									data-speed=".8"
									src="new-imges/home-about/home-about-img-2.png"
									alt=""
								/>
							</div>
						</div>
					</div>
					<div className="col-12 col-lg-7">
						<div className="h10-about-content-wrapper">
							<div className="sec-heading style-3 ">
								<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
									<i className="tji-box"></i> ABOUT OUR COMPANY
								</span>
								<h2
									className="sec-title title-highlight wow fadeInUp"
									data-wow-delay=".3s"
								>
							Empowering Academic Excellence Through Research & Global Education Guidance
								</h2>
							</div>
							<div className="row">
								<div className="col-12 col-md-6 d-none d-md-block d-lg-none">
									<div
										className="about-img-area h10-about-banner wow bounceInLeft"
										data-wow-delay=".3s"
									>
										<div className="about-img">
											<img src="/images/about/h10-about-banner.webp" alt="" />
										</div>
									</div>
								</div>
								<div className="col-12 col-md-6 col-lg-12">
									<div className="about-content-text">
										<p className="desc wow fadeInUp" data-wow-delay=".4s">
											Inspire Education Service is a trusted education consultancy dedicated to supporting students, scholars, and professionals in achieving their academic and research goals. With a strong focus on PhD guidance, research mentorship, and study-abroad consulting, we help aspirants navigate complex academic pathways with clarity and confidence.
										</p>
										<p className="desc wow fadeInUp" data-wow-delay=".5s">
											We specialize in PhD admissions support, supervisor identification, research assistance, and end-to-end mentoring, ensuring students receive expert guidance from enrollment to successful completion. Our structured approach combines academic expertise, personalized counselling, and ethical practices to deliver measurable outcomes.
										</p>
										{/* <p className="desc wow fadeInUp" data-wow-delay=".6s">
											With experience supporting students across multiple countries, we have built a reputation for reliability, transparency, and results. Our team works closely with each candidate to understand their academic background, research interests, and career aspirations—offering tailored solutions that align with global education standards.
										</p> */}
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

export default About9;