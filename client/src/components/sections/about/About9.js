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
									Academic Excellence Through Research & Global Education
								</h2>
							</div>
							<div className="row">
								<div className="col-12 col-md-6 d-none d-md-block d-lg-none">
									<div
										className="about-img-area h10-about-banner wow bounceInLeft"
										data-wow-delay=".3s"
									>
										<div className="about-img">
											<img src="/new-imges/about-images/img-1.png" alt="" />
										</div>
									</div>
								</div>
								<div className="col-12 col-md-6 col-lg-12">
									<div className="about-content-text">
										<p className="desc wow fadeInUp" data-wow-delay=".4s">
											INSPIRE is a community-driven platform that connects students to the world of research and higher education. We enable learners to virtually engage with research institutions, explore academic environments, and gain early exposure to real-world research experiences beyond traditional classrooms.
										</p>
										<p className="desc wow fadeInUp" data-wow-delay=".5s">
											Through structured learning and guided activities, students experience an academic approach similar to schools and universities while building deeper understanding and practical skills. Our model empowers learners to gain advanced academic exposure, strengthen confidence, and prepare for future educational pathways.										</p>
										<p className="desc wow fadeInUp" data-wow-delay=".6s">
											As Asia’s leading PhD ecosystem, INSPIRE fosters a dynamic community of scholars, bringing together students from over 20+ countries in a collaborative and research-focused environment. </p>
										<p>At INSPIRE, we create opportunities for students to learn, connect, and grow within a global academic ecosystem.										</p>
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