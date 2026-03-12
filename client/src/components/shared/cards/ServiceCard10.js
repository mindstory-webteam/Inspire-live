import Link from "next/link";
import Image from "next/image";

const ServiceCard10 = ({ service, idx, lastItemIdx }) => {
	const {
		title,
		desc,
		desc3,
		shortDesc,
		description1,
		slug,
		id,
		img5,
		img,
		iconName,
		iconImage,
	} = service || {};

	const href     = `/services/${slug || id}`;
	const imageSrc = img5 || img?.url || img || "/images/service/h9-service-1.webp";
	const iconUrl  = (typeof iconImage === "object" ? iconImage?.url : iconImage) || null;
	const cardDesc = desc || desc3 || shortDesc || description1 ||
		"Through a combination of data-driven insights and innovative approaches, we help your business grow.";

	return (
		<div className="service-item style-5 tj-progress-item">
			<div className="service-content-area">

				{/* Icon */}
				<div className="service-icon" style={{
					width: 70,
					height: 70,
					borderRadius: "50%",
					overflow: "hidden",
					padding: 0,
					flexShrink: 0,
					position: "relative",
				}}>
					{iconUrl ? (
						<Image
							src={iconUrl}
							alt={title || "service icon"}
							fill
							sizes="70px"
							style={{
								objectFit: "cover",
								objectPosition: "center",
							}}
						/>
					) : (
						<i className={iconName} style={{ lineHeight: "70px", fontSize: 28, display: "block", textAlign: "center" }} />
					)}
				</div>

				<div className="service-content">
					<h4 className="title">
						<Link href={href}>{title}</Link>
					</h4>
					<p className="desc">{cardDesc}</p>
				</div>

				<Link href={href} className="h9-service-nav">
					<i className="tji-arrow-right-long"></i>
				</Link>
			</div>

			<div className="service-img">
				<Image
					src={imageSrc}
					alt={title || "service"}
					width={600}
					height={400}
					style={{ width: "100%", height: "auto", objectFit: "cover" }}
				/>
			</div>
		</div>
	);
};

export default ServiceCard10;