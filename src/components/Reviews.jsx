import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { axiosFetch } from ".././axios";
import { TableComponent } from "../components";
import { adminReviewColumns } from "../columns";
import { useTranslation } from "react-i18next";

const Reviews = () => {
  const { t } = useTranslation();
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser.role !== "admin") {
      navigate("/");
    }
  }, [currentUser, navigate]);
  const { isLoading, data } = useQuery(["allReviews"], () => {
    return axiosFetch.get("/reviews/all", { withCredentials: true });
  });
  if (isLoading) return <ClipLoader size={150} />;
  return (
    <div className="adminLayout">
      <h1>{t("list_of_reviews")}</h1>
      <TableComponent
        subject="reviews"
        reviews
        data={data?.data}
        columns={adminReviewColumns}
      />
    </div>
  );
};

export default Reviews;
