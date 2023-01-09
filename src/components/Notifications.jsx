import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getNotifications } from "../redux/slices/notifications";
import { useQuery } from "@tanstack/react-query";
import { axiosFetch } from "../axios";
import { getReaction } from ".././utils/reactions";
import { Rating } from "react-simple-star-rating";
import { useTranslation } from "react-i18next";

const Notifications = ({ setShowNots }) => {
  const notifRef = useRef();
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notification);
  const { t } = useTranslation();

  const handleClickOutside = (e) => {
    if (
      notifRef.current &&
      !notifRef.current.contains(e.target) &&
      e.target !== document.getElementById("notification")
    ) {
      setShowNots(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useQuery(
    ["notifications"],
    () => {
      return axiosFetch.get("/user/notifications", { withCredentials: true });
    },
    {
      onSuccess: ({ data }) => {
        dispatch(getNotifications(data));
      },
    }
  );

  return (
    <div
      ref={notifRef}
      className="position-absolute  notify d-flex flex-column"
    >
      <div>
        {notifications.length ? (
          notifications.map((notif) => (
            <div key={notif.id} className="notif">
              <p>
                {notif.message}{" "}
                {notif.reaction === "rate" && (
                  <Rating readonly allowFraction initialValue={notif.value} />
                )}{" "}
                {notif.reaction === "react" && getReaction(notif.value)}
              </p>
              <span>{moment(notif.createdAt).format("L")}</span>
              <hr />
            </div>
          ))
        ) : (
          <h1 className="text-center text-small">{t("notifications_empty")}</h1>
        )}
      </div>
    </div>
  );
};

export default Notifications;
