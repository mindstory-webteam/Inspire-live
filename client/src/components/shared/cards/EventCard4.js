import Link from "next/link";

const EventCard4 = ({ event }) => {
	const {
		eventTitle,
		title,
		eventImage,
		image,
		eventBrief,
		id,
		_id,
		eventType,
		type,
		eventDate,
		tagline,
	} = event || {};

	const displayTitle = eventTitle || title || "Untitled Event";
	const displayType  = eventType  || type  || "event";

	// Backend stores eventImage as { url, publicId } object — extract .url
	const rawImage     = eventImage || image;
	const displayImage = typeof rawImage === "object"
		? rawImage?.url
		: rawImage || "/new-imges/events/event-1.jpg";

	return (
		<div className="project-item h4-project-item">
			<div className="project-content">
				<span className="categories">
					<Link href="/events">{displayType}</Link>
				</span>
				<div className="project-text">
					<h4 className="title">
						<Link href="/events">{displayTitle}</Link>
					</h4>
					<Link className="tji-icon-btn" href="/events">
						<i className="tji-arrow-right-long"></i>
					</Link>
				</div>
			</div>
			<div className="project-img">
				<img
					src={displayImage}
					alt={displayTitle}
					onError={(e) => {
						e.currentTarget.src = "/new-imges/events/event-1.jpg";
					}}
				/>
			</div>
		</div>
	);
};

export default EventCard4;