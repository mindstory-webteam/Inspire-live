import FaqItem2 from "@/components/shared/faq/FaqItem2";
import BootstrapWrapper from "@/components/shared/wrappers/BootstrapWrapper";

const Faq32 = () => {
	const items = [
		{
			title: "Who can join INSPIRE for PhD guidance in Kerala?",
			desc: "	Anyone who wants to do a PhD or is already doing one can join us. Whether you are a working professional, a fresh postgraduate, or a scholar who is stuck midway, we are here to help.",
			initActive: true,
		},
		{
			title: "Is INSPIRE located in Kerala?",
			desc: "	Yes. Our office is in Palakkad, Kerala. We also support scholars online, so you can get our PhD guidance from anywhere in Kerala or outside.",
			initActive: false,
		},
		{
			title: "What kind of help do you give for a PhD?",
			desc: "	We help with everything - picking a research topic, writing the synopsis, completing the thesis, checking for plagiarism, publishing in journals, and preparing for the viva exam.",
			initActive: false,
		},
		{
			title: "How much time will it take to finish my PhD with your help?",
			desc: "	It depends on your university and how far along you are. But with our guidance, most scholars save a lot of time because they get clear direction and avoid common mistakes that cause delays.",
			initActive: false,
		},
		{
			title: "Can I track the progress of my project?",
			desc: "	We support scholars from all major Kerala universities - University of Kerala, Calicut University, MG University, CUSAT, Kannur University, and more.",
			initActive: false,
			},
		{
			title: "Is INSPIRE trustworthy? How do I know you are genuine?",
			desc: "	We have guided 1,000+ PhD scholars, completed 24+ batches, and hold a 4.9-star rating from over 208 students. We were also recognised by Times Now News as India's No. 1 PhD guidance platform.",
			initActive: false,
		},
		{
			title: "How do I contact INSPIRE Education Service?",
			desc: "	You can call or WhatsApp us at +91 9947 945 945, email us at research@inspireeducationservice.com, or visit our website at inspireeducationservice.com to fill the contact form.",
			initActive: false,
		},
		{
			title: "Which universities in Kerala do you support?",
			desc: "	We support scholars from all major Kerala universities - University of Kerala, Calicut University, MG University, CUSAT, Kannur University, and more.",
			initActive: false,
		},
		{
			title: "Do I need to visit your office in person?",
			desc: "	No, Most of our scholars get PhD assistance online through calls, video sessions, and shared documents. You do not need to travel to Palakkad to work with us.",
			initActive: false,
		},
		{
			title: "Is PhD guidance from INSPIRE expensive? ",
			desc: "	We offer flexible plans based on what support you need. You can start with a free consultation call where we understand your situation and tell you exactly how we can help with no pressure.",
			initActive: false,
		},
	];
	return (
		<section className="tj-faq-section section-gap section-separator">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading text-center">
							<span className="sub-title wow fadeInUp" data-wow-delay=".1s">
								<i className="tji-box"></i>Common Questions
							</span>
							<h2 className="sec-title title-anim">
								Need <span>Help?</span> Start Here...
							</h2>
						</div>
					</div>
					<div className="row justify-content-center">
						<div className="col-lg-8">
							<BootstrapWrapper>
								<div className="accordion tj-faq pt-0" id="faqTwo">
									{items?.length
										? items?.map((item, idx) => (
												<FaqItem2 key={idx} item={item} idx={idx} />
										  ))
										: ""}
								</div>
							</BootstrapWrapper>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Faq32;
