import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import PasswordCheckList from "react-password-checklist";
import { useMutation } from "@tanstack/react-query";
import { axiosFetch } from "../axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { toastOptions } from "../utils/toastOptions";
import { useTranslation } from "react-i18next";

const UpdatePasswordModal = ({ show, close }) => {
  const { t } = useTranslation();
  const { currentUser } = useSelector((state) => state.auth);
  const [errors, setErrors] = useState({});
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  const handleChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateMutation = useMutation(
    (updates) => {
      if (passwords.oldPassword === passwords.newPassword) {
        setErrors({ newPassword: "This is the same as old password input" });
        throw new Error("This is the same as old password input");
      }
      return axiosFetch.put(
        `/user/${currentUser.uuid}/?personal=true`,
        updates,
        { withCredentials: true }
      );
    },
    {
      onSuccess: () => {
        close();
        toast.success("password_changed", toastOptions);
      },
      onError: (err) => {
        if (err.response.data) {
          setErrors(err.response.data);
        }
      },
    }
  );

  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>{t("update_password")}</Modal.Header>
      <Modal.Body>
        <Form onSUbmit={(e) => e.preventDefault()}>
          <Form.Group className="mb-2">
            <Form.Label>{t("enter_old_pass")}</Form.Label>
            <Form.Control
              name="oldPassword"
              isInvalid={errors.oldPassword}
              value={passwords.oldPassword}
              onChange={handleChange}
            />
            {errors.oldPassword && (
              <p className="error">{errors.oldPassword}</p>
            )}
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>{t("enter_new_pass")}</Form.Label>
            <Form.Control
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
            />
            {errors.newPassword && (
              <p className="error">{errors.newPassword}</p>
            )}
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>{t("repeat_new_pass")}</Form.Label>
            <Form.Control
              name="repeatPassword"
              value={passwords.repeatPassword}
              onChange={handleChange}
            />
            {passwords.newPassword && passwords.repeatPassword && (
              <PasswordCheckList
                rules={["match"]}
                value={passwords.newPassword}
                valueAgain={passwords.repeatPassword}
              />
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={
            !passwords.oldPassword ||
            !passwords.newPassword ||
            !passwords.repeatPassword ||
            passwords.newPassword !== passwords.repeatPassword
          }
          onClick={() =>
            updateMutation.mutate({
              oldPassword: passwords.oldPassword,
              newPassword: passwords.newPassword,
            })
          }
          type="submit"
          variant="success"
        >
          {t("update")}
        </Button>
        <Button onClick={close} variant="secondary">
          {t("cancel")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdatePasswordModal;
