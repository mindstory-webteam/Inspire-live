"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import useIsSticky from "@/hooks/useIsSticky";
import Link from "next/link";
import { useState } from "react";
import ContactMenu from "./ContactMenu";
import HeaderTop from "./HeaderTop";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import Navbar from "./Navbar";

const Header = ({
	headerType = 1,
	isHeaderTop = false,
	topbarType = 1,
	isStickyHeader = false,
}) => {
	const [isContactOpen, setIsContactOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const isSticky = useIsSticky(isStickyHeader);
	const handleContactTogglerClick = () => {
		setIsContactOpen(true);
	};
	const handleMobileTogglerClick = () => {
		setIsMobileMenuOpen(true);
	};
	return (
		<>
			{/* <!-- start: Offcanvas Menu --> */}
			<ContactMenu
				isContactOpen={isContactOpen}
				setIsContactOpen={setIsContactOpen}
			/>
			{/* <!-- end: Offcanvas Menu --> */}

			{/* <!-- start: Offcanvas Menu --> */}
			<MobileMenu
				isMobileMenuOpen={isMobileMenuOpen}
				setIsMobileMenuOpen={setIsMobileMenuOpen}
			/>
			{/* <!-- end: Offcanvas Menu --> */}

			<header
				className={`header-area ${
					headerType === 10
						? "header-3 h10-header"
						: headerType === 9
						? isStickyHeader
							? "header-3"
							: "h9-header"
						: headerType === 8
						? "header-1 h8-header"
						: headerType === 7
						? "header-2 h7-header"
						: headerType === 6
						? "header-1 h6-header"
						: headerType === 5
						? `header-2 ${isStickyHeader ? "" : "header-5"}`
						: headerType === 3
						? "header-3"
						: headerType === 2
						? "header-2"
						: "header-1"
				} section-gap-x ${
					isStickyHeader
						? `header-duplicate header-sticky ${isSticky ? "sticky" : ""}`
						: "header-absolute"
				} `}
			>
				{isHeaderTop && <HeaderTop type={topbarType} />}
				{headerType === 8 && !isStickyHeader ? (
					<div className="h8-header-mainmenu-bg-shape"></div>
				) : (
					""
				)}
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="header-wrapper">
								{/* <!-- site logo --> */}
								<Logo headerType={headerType} isStickyHeader={isStickyHeader} />

								{/* <!-- navigation --> */}
								<Navbar />
								{/* <!-- header right info --> */}
								<div className="header-right-item d-none d-lg-inline-flex">
									{headerType === 4 || headerType === 6 ? (
										<Link
											className="header-contact d-none d-xl-inline-flex"
											href="tel:18884521505"
										>
											<span className="call-icon">
												<i className="tji-phone"></i>
											</span>
											<span className="call-text">1-888-452-1505</span>
										</Link>
									) : (
										""
									)}
									{headerType !== 5 ? (
										
										 <>
    <div className="header-button">
      <ButtonPrimary text={"Let's Talk"} url={"/contact"} />
    </div>
    {/* <div className="header-button">
      <ButtonPrimary text={"Learning"} url={"https://learn.inspireeducationservice.com"}  hideIcon={true}   className={"learning-btn"}
 />
    </div> */}
  </>
										
										
									) : (
										""
									)}
									{headerType === 3 ||
									headerType === 8 ||
									headerType === 9 ||
									headerType === 10 ? (
										""
									) : (
										<div
											className="menu_bar menu_offcanvas d-none d-lg-inline-flex"
											onClick={handleContactTogglerClick}
										>
											<span></span>
											<span></span>
											<span></span>
										</div>
									)}
								</div>
								{/* <!-- menu bar --> */}
								<div
									className="menu_bar mobile_menu_bar d-lg-none"
									onClick={handleMobileTogglerClick}
								>
									<span></span>
									<span></span>
									<span></span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>
		</>
	);
};

export default Header;