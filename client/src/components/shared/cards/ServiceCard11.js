import modifyNumber from "@/libs/modifyNumber";
import Link from "next/link";
import Image from "next/image";

const ServiceCard11 = ({ service, idx, lastItemIdx, biggerCard = false }) => {
	const {
		title,
		desc,
		desc3,
		slug,
		id,
		iconName,
		iconImage,
	} = service || {};

	const iconUrl = (typeof iconImage === "object" ? iconImage?.url : iconImage) || null;
	const cardDesc = desc || desc3 || "Through a combination of data-driven insights and innovative approaches business.";
	const href = `/services/${slug || id}`;

	return (
		<div className={`service-item style-4 ${biggerCard ? "service-item-bigger" : ""}`}>
			<h6 className="h10-service-sln">{modifyNumber(idx + 1)}.</h6>

			{iconUrl ? (
				/* Custom wrapper — bypasses .service-icon theme styles entirely */
				<div style={{
					width: 80,
					height: 80,
					borderRadius: "50%",
					overflow: "hidden",
					position: "relative",
					flexShrink: 0,
					/* force-override any inherited background/padding from theme */
					background: "transparent",
					padding: 0,
					margin: 0,
				}}>
					<img
						src={iconUrl}
						alt={title || "service icon"}
						style={{
							position: "absolute",
							inset: 0,
							width: "100%",
							height: "100%",
							objectFit: "cover",
							objectPosition: "center",
							borderRadius: "50%",
						}}
					/>
				</div>
			) : (
				<div className="service-icon">
					<i className={iconName}></i>
				</div>
			)}

			<div className="service-content">
				<h4 className="title">
					<Link href={href}>{title}</Link>
				</h4>
				<p className="desc">{cardDesc}</p>
				<Link className="text-btn" href={href}>
					<span className="btn-text">
						<span>Learn More</span>
					</span>
					<span className="btn-icon">
						<i className="tji-arrow-right-long"></i>
					</span>
				</Link>
			</div>
		</div>
	);
};

export default ServiceCard11;