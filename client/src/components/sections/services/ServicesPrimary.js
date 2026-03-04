"use client";
import ServiceCard4 from "@/components/shared/cards/ServiceCard4";
import Paginations from "@/components/shared/others/Paginations";
import usePagination from "@/hooks/usePagination";
import makeWowDelay from "@/libs/makeWowDelay";
import { useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const ServicesPrimary = function () {
  const limit = 6;
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    fetch(API_BASE + "/services")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        setItems(data.data || []);
        setLoading(false);
      })
      .catch(function () { setLoading(false); });
  }, []);

  const {
    currentItems,
    currentpage,
    setCurrentpage,
    paginationItems,
    currentPaginationItems,
    totalPages,
    handleCurrentPage,
    firstItem,
    lastItem,
  } = usePagination(items, limit);

  const totalItems      = items.length;
  const totalItemsToShow = currentItems ? currentItems.length : 0;

  return (
    <div className="tj-service-section service-4 section-gap">
      {/* Hover micro-interactions */}
      <style>{`
        .sc4-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 32px rgba(26,89,138,0.14) !important;
        }
        .sc4-card:hover img {
          transform: scale(1.05);
        }
        .sc4-btn:hover {
          gap: 6px;
          color: #0f3d62 !important;
        }
      `}</style>

      <div className="container">
        {/* Loading skeleton */}
        {loading && (
          <div className="row row-gap-4">
            {[1, 2, 3, 4, 5, 6].map(function (i) {
              return (
                <div key={i} className="col-lg-4 col-md-6">
                  <div style={{
                    height: "340px",
                    background: "linear-gradient(90deg, #f0f4f8 25%, #e8eef4 50%, #f0f4f8 75%)",
                    backgroundSize: "200% 100%",
                    borderRadius: "16px",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }} />
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <p style={{ textAlign: "center", color: "#888", padding: "60px 0" }}>
            No services found.
          </p>
        )}

        {/* Cards grid */}
        {!loading && currentItems?.length > 0 && (
          <div className="row row-gap-4">
            {currentItems.map(function (item, idx) {
              return (
                <div
                  key={item._id || item.id}
                  className="col-lg-4 col-md-6 wow fadeInUp"
                  data-wow-delay={makeWowDelay(idx, 0.1)}
                >
                  <ServiceCard4 service={item} idx={idx} />
                </div>
              );
            })}
          </div>
        )}

        {totalItemsToShow < totalItems && (
          <Paginations
            paginationDetails={{
              currentItems,
              currentpage,
              setCurrentpage,
              paginationItems,
              currentPaginationItems,
              totalPages,
              handleCurrentPage,
              firstItem,
              lastItem,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ServicesPrimary;