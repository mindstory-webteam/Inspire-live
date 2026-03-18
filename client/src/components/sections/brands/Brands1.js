import BrandSlider1 from "@/components/shared/brands/BrandSlider1";

const Brands1 = ({ type = 1 }) => {
	return (
		<section
			className={`tj-client-section ${
				type === 2 ? "client-section-gap-2" : "client-section-gap"
			} wow fadeInUp`}
			data-wow-delay=".4s"
		>
			<div className="container-fluid client-container">
				<div className="row">
					<div className="col-12">
						<div className="client-content">
							<h5 className="sec-title" style={{
      color: "#015599",
    }}>
  Join Over <span  className="client-numbers">1000+</span>{" "}
  Students Who Chose
  <span  style={{
      color: "#1a598a",
    }} className="client-text"> Inspire</span > for Abroad Studies
</h5>

						</div>
						<BrandSlider1 />
					</div>
				</div>
			</div>
		</section>
	);
};

export default Brands1;
