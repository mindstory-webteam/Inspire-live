import Link from "next/link";

const ContactTop = () => {
	return (
		<div className="tj-contact-area section-gap">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading text-center">
							<span className="sub-title wow fadeInUp" data-wow-delay=".1s">
								<i className="tji-box"></i>Contact info
							</span>
							<h2 className="sec-title title-anim">
								<span>Reach</span> Out to Us
							</h2>
						</div>
					</div>
				</div>
				<div className="row row-gap-4">

					{/* Location */}
					<div className="col-xl-3 col-lg-6 col-sm-6 d-flex">
						<div className="contact-item style-2 wow fadeInUp w-100" data-wow-delay=".3s" style={cardStyle}>
							<div className="contact-icon" style={iconWrapStyle}>
								<i className="tji-location-3"></i>
							</div>
							<h3 className="contact-title" style={titleStyle}>Our Location</h3>
							<p style={textStyle}>
								INSPIRE EDUCATION SERVICE, floor aazra arcade, near central excise office, mettupalayam, Palakkad - 678001
							</p>
						</div>
					</div>

					{/* Email */}
					<div className="col-xl-3 col-lg-6 col-sm-6 d-flex">
						<div className="contact-item style-2 wow fadeInUp w-100" data-wow-delay=".5s" style={cardStyle}>
							<div className="contact-icon" style={iconWrapStyle}>
								<i className="tji-envelop"></i>
							</div>
							<h3 className="contact-title" style={titleStyle}>Email us</h3>
							<ul className="contact-list" style={listStyle}>
								<li style={listItemStyle}>
									<Link href="mailto:inspireeduservice001@gmail.com" style={linkStyle}>
										inspireeduservice001@gmail.com
									</Link>
								</li>
							</ul>
						</div>
					</div>

					{/* Phone */}
					<div className="col-xl-3 col-lg-6 col-sm-6 d-flex">
						<div className="contact-item style-2 wow fadeInUp w-100" data-wow-delay=".7s" style={cardStyle}>
							<div className="contact-icon" style={iconWrapStyle}>
								<i className="tji-phone"></i>
							</div>
							<h3 className="contact-title" style={titleStyle}>Call us</h3>
							<ul className="contact-list" style={listStyle}>
								<li style={listItemStyle}>
									<Link href="tel:00917593091945" style={linkStyle}>
										0091 7593 091 945
									</Link>
								</li>
								<li style={listItemStyle}>
									<Link href="tel:+919947945945" style={linkStyle}>
										+91 9947 945 945
									</Link>
								</li>
							</ul>
						</div>
					</div>

					{/* Live Chat */}
					<div className="col-xl-3 col-lg-6 col-sm-6 d-flex">
						<div className="contact-item style-2 wow fadeInUp w-100" data-wow-delay=".9s" style={cardStyle}>
							<div className="contact-icon" style={iconWrapStyle}>
								<i className="tji-chat"></i>
							</div>
							<h3 className="contact-title" style={titleStyle}>Live chat</h3>
							<ul className="contact-list" style={listStyle}>
								<li style={listItemStyle}>
									<Link href="mailto:inspireeduservice001@gmail.com" style={linkStyle}>
										inspireeduservice001@gmail.com
									</Link>
								</li>
								<li className="active" style={listItemStyle}>
									<Link href="/contact" style={linkStyle}>Need help?</Link>
								</li>
							</ul>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
};

const cardStyle = {
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	textAlign: "center",
	padding: "32px 20px",
	boxSizing: "border-box",
	height: "100%",
};

const iconWrapStyle = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	flexShrink: 0,
	marginBottom: "16px",
};

const titleStyle = {
	marginBottom: "12px",
	flexShrink: 0,
};

const textStyle = {
	margin: 0,
	wordBreak: "break-word",
	overflowWrap: "break-word",
};

const listStyle = {
	listStyle: "none",
	padding: 0,
	margin: 0,
	width: "100%",
};

const listItemStyle = {
	wordBreak: "break-word",
	overflowWrap: "break-word",
	marginBottom: "6px",
};

const linkStyle = {
	wordBreak: "break-word",
	overflowWrap: "break-word",
	display: "inline-block",
	maxWidth: "100%",
};

export default ContactTop;