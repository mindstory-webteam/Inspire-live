"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ProcessCard from "@/components/shared/cards/ProcessCard";

const Process22 = () => {
	const process = [
		{
			id: 1,
			title: "Consultation & Academic Assessment",
			desc: "We understand your interests, strengths, and goals to shape the right academic direction. Get clarity on research areas and future pathways tailored to you. Start your journey with purpose and confidence.",
		},
		{
			id: 2,
			title: "Application & Research Execution",
			desc: "Step into real academic experiences through research-based learning and activities. Connect with research environments and explore beyond classroom knowledge. Build skills that reflect real college-level learning.",
		},
		{
			id: 3,
			title: " Admission Support & Continuous Guidance",
			desc: "Receive ongoing mentorship and support throughout your journey. Develop deeper understanding, critical thinking, and academic confidence. Prepare yourself for future research and global opportunities.",
		},
	];
	return (
		<section className="tj-working-process section-gap section-gap-x">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading-wrap">
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
								Our Process
							</span>
							<div className="heading-wrap-content">
								<div className="sec-heading style-2">
									<h2 className="sec-title text-anim">
										Seamless Process,  <span style={{ color: "white" }}>Successful Academic Outcomes.</span>
									</h2>
								</div>
								<p className="desc wow fadeInUp" data-wow-delay=".5s">
									A guided journey that transforms curiosity into real academic experience, helping students learn, connect, and grow with confidence.
								</p>
								<div className="btn-wrap wow fadeInUp" data-wow-delay=".6s">
									<ButtonPrimary text={"Request a Call"} url={"/contact"} />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<div className="working-process-area">
							{process?.length
								? process?.map((processSingle, idx) => (
										<ProcessCard
											key={idx}
											processSingle={processSingle}
											idx={idx}
										/>
								  ))
								: ""}
						</div>
					</div>
				</div>
			</div>
			{/* <div className="bg-shape-1">
				<img src="/images/shape/pattern-2.svg" alt="" />
			</div>
			<div className="bg-shape-2">
				<img src="/images/shape/pattern-3.svg" alt="" />
			</div> */}
		</section>
	);
};

export default Process22;
