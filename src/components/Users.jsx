import {useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { axiosFetch } from "../axios";
import { userColumns } from "../columns";
import { TableComponent } from "../components";

const Users = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (currentUser?.role !== "admin") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const { isLoading, data } = useQuery(["users"], () => {
    return axiosFetch.get("/admin/allusers/?role=user", {
      withCredentials: true,
    });
  });
  if (isLoading) <ClipLoader size={150} />;

  return (
    <div className="adminLayout">
      <h1 className="mb-3">{t("list_of_users")}</h1>
      <TableComponent
        subject="users"
        users
        data={data?.data}
        columns={userColumns}
      />
    </div>
  );
};

export default Users;
