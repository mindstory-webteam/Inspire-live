import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import FaqItem from "@/components/shared/faq/FaqItem";
import BootstrapWrapper from "@/components/shared/wrappers/BootstrapWrapper";
import Image from "next/image";
import Link from "next/link";

const Faq5 = ({ type = 1 }) => {
	const items = [
		{
			title: "Who can apply for your PhD guidance services?",
			desc: "Our services are open to postgraduate students, research scholars, working professionals, and academicians who wish to pursue a PhD in India or international universities.",
			initActive: true,
		},
		{
			title: " Do you help with PhD admissions abroad?",
			desc: "Yes. We offer complete PhD abroad support, including university shortlisting, supervisor identification, research proposal guidance, and application assistance for countries like the UK, USA, Canada, and Ireland.",
			initActive: false,
		},
		{
			title: " Do you assist with research proposal and topic selection?",
			desc: "Absolutely. Our experts help candidates refine research topics, develop strong research proposals, and align them with university and supervisor expectations.",
			initActive: false,
		},
		{
			title: "How does the consultation process work?",
			desc: "	The process starts with an academic assessment where we understand your background and goals. Based on this, we recommend suitable universities or countries and guide you through each stage of the admission process.",
			initActive: false,
		},
		{
			title: "Is your guidance limited to admissions only?",
			desc: "	No. Our support continues beyond admission. We provide ongoing mentorship, research guidance, academic planning, and assistance to help scholars progress smoothly in their PhD journey.",
			initActive: false,
		},
		{
			title: " Which countries do you support for study abroad programs?",
			desc: "We primarily assist students with study opportunities in the UK, USA, Canada, and Ireland, offering personalized guidance based on academic and career goals.",
			initActive: false,
		},
	];
	return (
		<section
			className={`tj-faq-section section-gap  ${
				type === 3 || type === 4 ? "" : "tj-arrange-container-2"
			}`}
		>
			<div className="container">
				<div className="row justify-content-between">
					{type === 3 ? (
						<div className="col-lg-4">
							<div className="content-wrap">
								<div className="sec-heading">
									<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
										<i className="tji-box"></i>Common Questions
									</span>
									<h2 className="sec-title title-anim">
										Need <span>Help?</span> Start Here...
									</h2>
								</div>
								<p className="desc wow fadeInUp" data-wow-delay=".6s">
									We stay ahead of curve, leveraging <br /> cutting-edge are
									technologies and <br /> strategies to competitive
								</p>
								<div className="wow fadeInUp" data-wow-delay=".8s">
									<ButtonPrimary text={"Request a Call"} url={"/contact"} />
								</div>
							</div>
						</div>
					) : (
						<div className="col-lg-6">
							<div
								className={`faq-img-area ${
									type === 3 ? "" : "tj-arrange-item-2"
								}`}
							>
								<div className="faq-img overflow-hidden">
									<Image
										src="/images/faq/faq.webp"
										alt=""
										width={585}
										height={629}
									/>
									<h2 className={`title ${type === 4 ? "title-anim" : ""}`}>
										Need Help? Start Here...
									</h2>
								</div>
								<div className="box-area ">
									<div className="call-box">
										<h4 className="title">Get Started Free Call? </h4>
										<span className="call-icon">
											<i className="tji-phone"></i>
										</span>
										<Link className="number" href="tel:18884521505">
											<span>1-888-452-1505</span>
										</Link>
									</div>
								</div>
							</div>
						</div>
					)}

					<div className={`col-lg-${type === 3 ? "8" : "6"}`}>
						<BootstrapWrapper>
							<div
								className={`accordion tj-faq ${
									type === 2 || type === 4 ? "style-2" : ""
								} ${type === 3 || type === 4 ? "" : "tj-arrange-item-2"}`}
								id="faqOne"
							>
								{items?.length
									? items?.map((item, idx) => (
											<FaqItem key={idx} item={item} idx={idx} />
									  ))
									: ""}
							</div>
						</BootstrapWrapper>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Faq5;
