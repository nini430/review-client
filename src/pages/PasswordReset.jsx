import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import ReactPasswordChecklist from "react-password-checklist";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { toastOptions } from "../utils/toastOptions";
import { axiosFetch } from "../axios";
import { useTranslation } from "react-i18next";

const PasswordReset = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [passwords, setPasswords] = useState({
    newPassword: "",
    repeatPassword: "",
  });
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetPassword = useMutation(
    (newPassword) => {
      return axiosFetch.put(`/auth/reset/${resetToken}`, { newPassword });
    },
    {
      onSuccess: ({ data }) => {
        toast.success(data.msg, toastOptions);
        navigate("/login");
      },
      onError: (err) => {
        if (err.response.data) {
          setMessage(err.response.data);
        }
      },
    }
  );

  return (
    <div className="reset">
      <Form>
        <h1>{t("reset_your_password")}</h1>
        <Form.Group className="mb-2">
          <Form.Label>{t("enter_new_password")}</Form.Label>
          <Form.Control
            name="newPassword"
            type="password"
            value={passwords.newPassword}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>{t("repeat_new_password")}</Form.Label>
          <Form.Control
            name="repeatPassword"
            type="password"
            value={passwords.repeatPassword}
            onChange={handleChange}
          />
          {passwords.newPassword && passwords.repeatPassword && (
            <ReactPasswordChecklist
              rules={["match"]}
              value={passwords.newPassword}
              valueAgain={passwords.repeatPassword}
            />
          )}
        </Form.Group>
        {message && <p className="error">{message.msg}</p>}
        <Button
          onClick={() => resetPassword.mutate(passwords.newPassword)}
          disabled={
            !passwords.newPassword ||
            !passwords.repeatPassword ||
            passwords.newPassword !== passwords.repeatPassword
          }
          className="w-100"
        >
          {t("reset")}
        </Button>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default PasswordReset;
