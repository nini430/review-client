import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import { useMutation } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import { axiosFetch } from ".././axios";
import { toastOptions } from ".././utils/toastOptions";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../redux/slices/auth";
import { getRequests } from "../redux/slices/requests";
import { getNotifications } from "../redux/slices/notifications";

const TwoFactorAuth = () => {
  const { search } = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (search) {
      setShowCodeInput(true);
    }
  }, [search]);

  const { isLoading, mutate } = useMutation(
    (phone) => {
      return axiosFetch.post(
        "/user/send",
        { phone },
        { withCredentials: true }
      );
    },
    {
      onSuccess: () => {
        setShowCodeInput(true);
        localStorage.setItem("webportal_app_phone", JSON.stringify(phone));
      },
    }
  );
  const confirmMutation = useMutation(
    (code) => {
      const phone = JSON.parse(localStorage.getItem("webportal_app_phone"));
      return axiosFetch.post(
        `/user/confirm`,
        { code, phone },
        { withCredentials: true }
      );
    },
    {
      onSuccess: () => {
        toast.success("enabled TFA", toastOptions);
        navigate("/");
      },
    }
  );

  const loginMutation = useMutation(
    ({ code, email }) => {
      return axiosFetch.post("/auth/confirm", { code, email });
    },
    {
      onSuccess: ({ data }) => {
        toast.success("2FA passed", toastOptions);
        navigate("/");
        dispatch(getUser(data.user));
        dispatch(getRequests(data.requests));
        dispatch(getNotifications(data.notifications));
      },
    }
  );

  if (isLoading) return <ClipLoader size={150} />;
  return (
    <div className="twofactor d-flex justify-content-center align-items-center">
      <Form onSubmit={(e) => e.preventDefault()} className="form">
        <h1>{search ? "" : "Enable"} 2 factor authentication</h1>
        {!showCodeInput ? (
          <>
            <PhoneInput value={phone} onChange={(val) => setPhone(val)} />
            <Button
              onClick={() => mutate(phone)}
              disabled={!phone}
              className="mt-2"
            >
              Send
            </Button>
          </>
        ) : (
          <>
            <p>Code is sent to your Phone! Please Enter it below:</p>
            <Form.Control
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button
              onClick={
                search
                  ? () =>
                      loginMutation.mutate({
                        code,
                        email: search.substring(1, search.length),
                      })
                  : () => confirmMutation.mutate(code)
              }
            >
              Confirm
            </Button>
          </>
        )}
      </Form>
      <ToastContainer />
    </div>
  );
};

export default TwoFactorAuth;
