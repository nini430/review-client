import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RiAdminFill } from "react-icons/ri";
import { Parameter } from "../components";
import { Button } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { axiosFetch } from "../axios";

import { ToastContainer, toast } from "react-toastify";
import { toastOptions } from "../utils/toastOptions";
import { Link, useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socket);

  const requestMutation = useMutation(
    () => {
      return axiosFetch.post("/user/request", {}, { withCredentials: true });
    },
    {
      onSuccess: ({ data }) => {
        socket.emit("request_admin", { sender: currentUser.uuid });
        toast.success(data.msg, toastOptions);
      },
      onError: (err) => {
        toast.error(err.response.data.msg, toastOptions);
      },
    }
  );

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
    if (currentUser && currentUser.role === "admin") {
      navigate("/admin");
    }
  }, [navigate, currentUser]);

  return (
    <div className="settings">
      <Button onClick={() => requestMutation.mutate()} className="adminBtn">
        Request To Be An Admin <RiAdminFill />
      </Button>
      <h1>Update Your Personal Info</h1>
      <div className="attributes">
        <Parameter
          label="First Name"
          accessor="firstName"
          value={currentUser?.firstName}
        />
        <Parameter
          label="Last Name"
          accessor="lastName"
          value={currentUser?.lastName}
        />
        {!currentUser?.withSocials && (
          <Parameter
            label="Password"
            accessor="password"
            value="*******"
            isPassword
          />
        )}
      </div>
      {!currentUser?.twoFA && (
        <Link to="/twofactor" className="link">
          <Button className="mt-2">Set Up 2FA Authorization</Button>
        </Link>
      )}
      <ToastContainer />
    </div>
  );
};

export default Settings;
