
"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";

const Cta = () => {
  return (
    <section className="tj-cta-section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="cta-area">
              <div className="cta-content">
                <h2 className="title title-anim">
                  Let's Build Future Together.
                </h2>
                <div className="cta-btn wow fadeInUp" data-wow-delay=".6s">
                  <ButtonPrimary
                    text={"Get Started Now"}
                    url={"/contact"}
                    className={"btn-dark"}
                  />
                </div>
              </div>
              <div className="cta-img">
                {/* FIX: guard against missing image */}
                <img
                  src="/new-imges/contact-us/contact-us-img3.jpeg"
                  alt="Contact us"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;