import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { axiosFetch } from "../axios";
import { userColumns } from "../columns";
import TableComponent from "./Table";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

const DeletedUsers = () => {
  const { t } = useTranslation();
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.role !== "admin") {
      navigate("/");
    }
  }, [currentUser, navigate]);
  const { data, isLoading, refetch } = useQuery(["deleted"], () => {
    return axiosFetch.get("/admin/allusers/?deleted=true", {
      withCredentials: true,
    });
  });
  if (isLoading) return <ClipLoader size={150} />;
  return (
    <div className="adminLayout">
      <h1>{t("deleted_users")}</h1>
      <TableComponent
        subject="deleted_users"
        refetch={refetch}
        deleted
        columns={userColumns}
        data={data?.data}
      />
    </div>
  );
};

export default DeletedUsers;
