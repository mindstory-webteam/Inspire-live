"use client";
import ServiceCard4 from "@/components/shared/cards/ServiceCard4";
import Paginations from "@/components/shared/others/Paginations";
import usePagination from "@/hooks/usePagination";
import makeWowDelay from "@/libs/makeWowDelay";
import { useEffect, useState } from "react";

// Always fallback so client never fetches "undefined/services"
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const ServicesPrimary = function () {
  var limit = 6;
  var [items, setItems] = useState([]);
  var [loading, setLoading] = useState(true);

  useEffect(function () {
    fetch(API_BASE + "/services")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        setItems(data.data || []);
        setLoading(false);
      })
      .catch(function () { setLoading(false); });
  }, []);

  var {
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

  var totalItems = items.length;
  var totalItemsToShow = currentItems ? currentItems.length : 0;

  if (loading) {
    return (
      <div className="tj-service-section service-4 section-gap">
        <div className="container">
          <div className="row row-gap-4">
            {[1, 2, 3, 4, 5, 6].map(function (i) {
              return (
                <div key={i} className="col-lg-4 col-md-6">
                  <div
                    style={{
                      height: "280px",
                      background: "#f1f5f9",
                      borderRadius: "12px",
                      animation: "pulse 1.5s ease-in-out infinite",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tj-service-section service-4 section-gap">
      <div className="container">
        <div className="row row-gap-4">
          {currentItems &&
            currentItems.map(function (item, idx) {
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