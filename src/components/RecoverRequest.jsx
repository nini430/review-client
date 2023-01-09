import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";

import { axiosFetch } from ".././axios";
import { toastOptions } from ".././utils/toastOptions";
import { useTranslation } from "react-i18next";

const RecoverRequest = ({ show, onHide, email }) => {
  const { t } = useTranslation();
  const { mutate } = useMutation(
    () => {
      return axiosFetch.post(
        "/user/userrequest",
        { email },
        { withCredentials: true }
      );
    },
    {
      onSuccess: ({ data }) => {
        toast.success(data.msg, toastOptions);
        onHide();
      },
      onError: (err) => {
        if (err.response.data) {
          toast.error(err.response.data.msg, toastOptions);
        }
        onHide();
      },
    }
  );
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>{t("account_recovery")}</Modal.Header>
      <Modal.Body>{t("admin_message")}</Modal.Body>

      <Modal.Footer>
        <Button onClick={() => mutate()}>{t("request")}</Button>
        <Button onClick={onHide} variant="secondary">
          {t("cancel")}
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
};

export default RecoverRequest;
