import FunfactSingle from "@/components/shared/funfact/FunfactSingle";
import ProgressBar from "@/components/shared/progress/ProgressBar";

const Funfact2 = () => {
  return (
    <section className="tj-funfact-section section-gap section-gap-x">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading-wrap-content">
              <div className="sec-heading style-4">
                <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
                  <i className="tji-box"></i>OUR IMPACT
                </span>
                <h2 className="sec-title title-anim">
                  Proven Results That Define Our Impact
                </h2>
              </div>
              <div className="progress-item">
                <div className="progress-circle">
                  <ProgressBar />
                </div>
                <div className="progress-text">
                  <span className="sub-title">
                    Students achieved their preferred university placements
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row row-gap-4">
          {/* Card 1 */}
          <div className="col-lg-3 col-md-6">
            <div className="countup-item style-2 wow fadeInUp" data-wow-delay=".7s">
              <span className="count-icon"><i className="tji-growth"></i></span>
              <span className="steps">01.</span>
              <div className="count-inner">
                <span className="count-text">Successful Admissions</span>
                <span className="count-text">Students successfully placed in leading universities worldwide</span>
                <FunfactSingle currentValue={435} symbol={"+"} />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-lg-3 col-md-6">
            <div className="countup-item style-2 wow fadeInUp" data-wow-delay=".5s">
              <span className="count-icon"><i className="tji-worldwide"></i></span>
              <span className="steps">02.</span>
              <div className="count-inner">
                <span className="count-text">Global Student Base</span>
                <span className="count-text">Diverse student community from across the globe</span>
                <FunfactSingle currentValue={20} symbol={"+"} />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-lg-3 col-md-6">
            <div className="countup-item style-2 wow fadeInUp" data-wow-delay=".3s">
              <span className="count-icon"><i className="tji-complete"></i></span>
              <span className="steps">03.</span>
              <div className="count-inner">
                <span className="count-text">Enrolment Success Rate</span>
                <span className="count-text">Consistent track record of successful PhD enrolments</span>
                <FunfactSingle currentValue={100} symbol={"%"} />
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="col-lg-3 col-md-6">
            <div className="countup-item style-2 wow fadeInUp" data-wow-delay=".1s">
              <span className="count-icon"><i className="fa fa-university"></i></span>
              <span className="steps">04.</span>
              <div className="count-inner">
                <span className="count-text">University Network</span>
                <span className="count-text"></span>
                <span className="count-text">Strong collaborations with reputed institutions worldwide</span>
                <FunfactSingle currentValue={49} symbol={"+"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Funfact2;