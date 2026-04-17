"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const FloatingLearningButton = ({
	url = "https://learn.inspireeducationservice.com",
	text = "Learn",
}) => {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 100);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			<style>{`
				.floating-learning-wrapper {
					position: fixed;
					right: 16px;
					top: 50%;
					transform: translateY(-50%);
					z-index: 9999;
					display: flex;
					align-items: center;
					justify-content: flex-end;
				}

				/* Default state - pill with text + icon */
				.floating-learning-btn {
					display: inline-flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					gap: 10px;
					position: relative;
					background-color: var(--tj-color-theme-primary);
					font-size: 16px;
					font-weight: var(--tj-fw-sbold);
					padding: 20px 10px 10px 10px;
					text-align: center;
					border-radius: 0px;
					line-height: 1;
					z-index: 2;
					overflow: hidden;
					white-space: nowrap;
					text-decoration: none;
					width: 62px;
					box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

					/* Smooth transition for everything */
					transition: 
						width 0.5s cubic-bezier(0.4, 0, 0.2, 1),
						height 0.5s cubic-bezier(0.4, 0, 0.2, 1),
						padding 0.5s cubic-bezier(0.4, 0, 0.2, 1),
						border-radius 0.5s cubic-bezier(0.4, 0, 0.2, 1),
						gap 0.5s cubic-bezier(0.4, 0, 0.2, 1),
						box-shadow 0.3s ease;
				}

				.floating-learning-btn:hover {
					box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
				}

				/* Text */
				.floating-learning-btn .btn-text {
					color: var(--tj-color-common-white);
					overflow: hidden;
					max-height: 100px;
					opacity: 1;
					writing-mode: vertical-rl;
					text-orientation: mixed;
					transform: rotate(180deg);
					transition: 
						max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1),
						opacity 0.3s ease,
						margin 0.5s cubic-bezier(0.4, 0, 0.2, 1);
				}

				.floating-learning-btn .btn-text span {
					display: flex;
					line-height: 1;
					backface-visibility: hidden;
					white-space: nowrap;
				}

				/* Icon circle */
				.floating-learning-btn .btn-icon {
					display: inline-flex;
					justify-content: center;
					align-items: center;
					font-size: 20px;
					line-height: 1;
					width: 42px;
					height: 42px;
					background-color: var(--tj-color-theme-primary);
					border-radius: 50%;
					flex-shrink: 0;
					transition: 
						width 0.5s cubic-bezier(0.4, 0, 0.2, 1),
						height 0.5s cubic-bezier(0.4, 0, 0.2, 1),
						font-size 0.5s cubic-bezier(0.4, 0, 0.2, 1),
						transform 0.3s ease,
						background-color 0.3s ease;
				}

				.floating-learning-btn .btn-icon i {
					color: var(--tj-color-common-white);
					transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
				}

				/* Icon hover spin */
				.floating-learning-btn:hover .btn-icon {
					background-color: var(--tj-color-theme-primary, #1a3c5e);
					transform: scale(1.08);
				}

				.floating-learning-btn:hover .btn-icon i {
					transform: rotate(20deg);
				}

				/* Pulse animation on icon */
				@keyframes pulse-ring {
					0% { box-shadow: 0 0 0 0 rgba(var(--tj-color-theme-primary-rgb, 26, 60, 94), 0.4); }
					70% { box-shadow: 0 0 0 10px rgba(var(--tj-color-theme-primary-rgb, 26, 60, 94), 0); }
					100% { box-shadow: 0 0 0 0 rgba(var(--tj-color-theme-primary-rgb, 26, 60, 94), 0); }
				}

				/* Scrolled - perfect circle */
				.floating-learning-btn.scrolled {
					width: 52px;
					height: 52px;
					padding: 0;
					
					gap: 0;
					animation: pulse-ring 2s ease-out infinite;
				}

				.floating-learning-btn.scrolled .btn-text {
					max-height: 0;
					opacity: 0;
					margin: 0;
					pointer-events: none;
				}

				.floating-learning-btn.scrolled .btn-icon {
					width: 52px;
					height: 52px;
					font-size: 22px;
				}

				/* Hover when scrolled - expand back */
				.floating-learning-btn.scrolled:hover {
					width: 62px;
					height: auto;
					padding: 20px 10px 10px 10px;
					
					gap: 10px;
					animation: none;
				}

				.floating-learning-btn.scrolled:hover .btn-text {
					max-height: 100px;
					opacity: 1;
				}

				.floating-learning-btn.scrolled:hover .btn-icon {
					width: 42px;
					height: 42px;
					font-size: 20px;
				}

				/* Entrance animation */
				@keyframes slideInRight {
					from {
						opacity: 0;
						transform: translateX(80px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}

				.floating-learning-wrapper {
					animation: slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
				}
			`}</style>

			<div className="floating-learning-wrapper">
				<Link
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className={`floating-learning-btn ${isScrolled ? "scrolled" : ""}`}
				>
					<span className="btn-text">
						<span>{text}</span>
					</span>
					<span className="btn-icon">
						<i className="fas fa-book-open"></i>
					</span>
				</Link>
			</div>
		</>
	);
};

export default FloatingLearningButton;