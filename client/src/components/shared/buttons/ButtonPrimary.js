
import Link from "next/link";

const ButtonPrimary = ({ className, text, isTextBtn, url, type, iconName, hideIcon }) => {
	return (
		<>
			
			<style>{`
    .tj-primary-btn.no-icon.learning-btn {
       padding: 16px !important;
    }
    .tj-primary-btn.no-icon.learning-btn .btn-text {
        padding-right: 0 !important;
        margin-right: 0 !important;
    }
    .tj-primary-btn.no-icon.learning-btn .btn-text span {
        margin-right: 0 !important;
    }
`}</style>

			{type ? (
				<button
					type={type ? type : "submit"}
					className={`tj-primary-btn ${hideIcon ? "no-icon" : ""} ${className ? className : ""}`}
				>
					<span className="btn-text">
						<span>{text}</span>
					</span>
					{!hideIcon && (
						<span className="btn-icon">
							<i className={iconName ? iconName : "tji-arrow-right-long"}></i>
						</span>
					)}
				</button>
			) : (
				<Link
					href={url ? url : "/"}
					className={`${isTextBtn ? "text-btn" : "tj-primary-btn"} ${hideIcon ? "no-icon" : ""} ${className ? className : ""}`}
				>
					<span className="btn-text">
						<span>{text}</span>
					</span>
					{!hideIcon && (
						<span className="btn-icon">
							<i className={iconName ? iconName : "tji-arrow-right-long"}></i>
						</span>
					)}
				</Link>
			)}
		</>
	);
};

export default ButtonPrimary;