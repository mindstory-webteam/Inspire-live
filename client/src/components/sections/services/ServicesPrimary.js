"use client";
import ServiceCard4 from "@/components/shared/cards/ServiceCard4";
import Paginations from "@/components/shared/others/Paginations";
import usePagination from "@/hooks/usePagination";
import makeWowDelay from "@/libs/makeWowDelay";
import { getAllServices } from "@/utils/serviceApi";
import { useEffect, useState, useCallback } from "react";

const LIMIT = 6;

const ServicesPrimary = function () {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // ── Fetch — wrapped in useCallback so we can call it again on demand ─────
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllServices(); // cache: "no-store" inside
      setItems(data);
    } catch (err) {
      console.error("ServicesPrimary:", err);
      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Re-fetch when the tab becomes visible again (user comes back from admin)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchServices();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [fetchServices]);

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
  } = usePagination(items, LIMIT);

  const totalItems       = items.length;
  const totalItemsToShow = currentItems ? currentItems.length : 0;

  return (
    <div className="tj-service-section service-4 section-gap">
      <style>{`
        .sc4-card { transition: transform .25s ease, box-shadow .25s ease; }
        .sc4-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px rgba(26,89,138,.14) !important; }
        .sc4-card:hover img { transform: scale(1.05); }
        .sc4-btn:hover { gap: 6px; color: #0f3d62 !important; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .skeleton {
          background: linear-gradient(90deg,#f0f4f8 25%,#e8eef4 50%,#f0f4f8 75%);
          background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite;
          border-radius: 16px; height: 340px;
        }
      `}</style>

      <div className="container">

        {/* Loading */}
        {loading && (
          <div className="row row-gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="skeleton" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p style={{ textAlign:"center", color:"#e53e3e", padding:"60px 0" }}>
            {error}
          </p>
        )}

        {/* Empty */}
        {!loading && !error && items.length === 0 && (
          <p style={{ textAlign:"center", color:"#888", padding:"60px 0" }}>
            No services found.
          </p>
        )}

        {/* Grid */}
        {!loading && !error && currentItems?.length > 0 && (
          <div className="row row-gap-4">
            {currentItems.map((item, idx) => (
              <div
                key={item._id || item.id}
                className="col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay={makeWowDelay(idx, 0.1)}
              >
                <ServiceCard4 service={item} idx={idx} />
              </div>
            ))}
          </div>
        )}

        {totalItemsToShow < totalItems && (
          <Paginations
            paginationDetails={{
              currentItems, currentpage, setCurrentpage,
              paginationItems, currentPaginationItems,
              totalPages, handleCurrentPage, firstItem, lastItem,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ServicesPrimary;