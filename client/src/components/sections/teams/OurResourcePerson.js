"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import TeamCard from "@/components/shared/cards/TeamCard";
import { fetchResourceMembersClient } from "@/utils/resourcepersonApi";
import { useEffect, useState } from "react";

const OurResourcePerson = ({ type }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResourceMembersClient()
      .then((data) => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      className={`${
        type === 2
          ? "tj-team-section section-gap"
          : type === 3
          ? "tj-team-section-3 section-gap section-gap-x"
          : "tj-team-section section-separator"
      }`}
    >
      <div className="container">
        {type === 2 ? (
          ""
        ) : (
          <div className="row">
            <div className="col-12">
              <div className={`sec-heading text-center ${type === 3 ? "" : "style-2"}`}>
                <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
                  {type === 3 ? <i className="tji-box"></i> : ""}
                  Expert Resource Team
                </span>
                {type === 3 ? (
                  <h2 className="sec-title title-anim">
                    Meet the Experts Behind Our Success
                  </h2>
                ) : (
                  <h2 className={`sec-title ${type === 2 ? "title-anim" : "text-anim"}`}>
                    People Behind <span style={{ color: "#1a598a" }}>Inspire.</span>
                  </h2>
                )}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="row">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="col-lg-3 col-sm-6">
                <div
                  style={{
                    height: 320,
                    borderRadius: 12,
                    background: "#e9ecef",
                    animation: "pulse 1.5s ease-in-out infinite",
                    marginBottom: 24,
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="row leftSwipeWrap">
            {items?.length ? (
              items.map((item, idx) => (
                <div key={idx} className="col-lg-3 col-sm-6">
                  <TeamCard teamMember={item} />
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p style={{ color: "#888", padding: "40px 0" }}>
                  No resource persons found.
                </p>
              </div>
            )}
          </div>
        )}

        {type === 2 ? (
          ""
        ) : (
          <div
            className="team-btn d-md-none mt-40 text-center wow fadeInUp"
            data-wow-delay="0.9s"
          >
            <ButtonPrimary text={"More member"} url={"/team"} />
          </div>
        )}
      </div>
    </section>
  );
};

export default OurResourcePerson;