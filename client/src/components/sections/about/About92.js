import FunfactSingle from "@/components/shared/funfact/FunfactSingle";

const About92 = () => {
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
											INSPIRE is a community-driven platform that connects students with the world of research and higher education. We enable learners to virtually engage with research colleges, explore academic environments, and gain early exposure to real research experiences beyond traditional classrooms.
										</p>
										<p className="desc wow fadeInUp" data-wow-delay=".5s">
											Through structured learning and guided activities, students can study in a way similar to schools and colleges while building deeper understanding and practical skills. Our approach helps learners gain extra academic experience, develop confidence, and prepare for future educational pathways.
										</p>
										<p className="desc wow fadeInUp" data-wow-delay=".6s">
											At INSPIRE, we create opportunities for students to learn, connect, and grow in a global academic environment. If you are looking for reliable PhD assistance in Kerala your search ends here. 
										</p>
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

export default About92;