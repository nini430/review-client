import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Image, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { RxCross2 } from "react-icons/rx";
import { MdDone } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { keys } from "../env";
import { axiosFetch } from "../axios";
import { useTranslation } from "react-i18next";

const Requests = () => {
  const client = useQueryClient();
  const { currentUser } = useSelector((state) => state.auth);
  const { requests } = useSelector((state) => state.request);
  const { socket } = useSelector((state) => state.socket);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (currentUser?.role !== "admin") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  let user;
  const respondToRequest = useMutation(
    (body) => {
      user = body.userId;
      return axiosFetch.put(
        `/admin/respond/${body.userId}/?position=${body.position}`,
        { status: body.status },
        { withCredentials: true }
      );
    },
    {
      onSuccess: ({ data }) => {
        socket.emit("respond_request", {
          recipient: user,
          request: data.request,
          adminPin: data.adminPin,
        });
        client.invalidateQueries(["requests"]);
      },
    }
  );

  if (!requests.length)
    return (
      <div className="p-5">
        <h1>No Requests So far</h1>
      </div>
    );
  return (
    <div className="requestPage  d-flex flex-column gap-3 adminLayout">
      <h1>Requests</h1>
      {requests.map((item) => {
        return (
          <>
            <div className="request  d-flex  align-items-center">
              <div className="candidate">
                <Image
                  thumbnail
                  rounded
                  src={
                    item.user?.profUpdated
                      ? item?.user.profileImg
                      : keys.PF + item.user?.profileImg
                  }
                />
                <span>
                  {item.user?.firstName} {item.user?.lastName}
                </span>
              </div>
              <span>{item.position}</span>
              <div className="icons">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>{t("accept")}</Tooltip>}
                >
                  <Button
                    onClick={() =>
                      respondToRequest.mutate({
                        userId: item?.user.uuid,
                        status: "fulfilled",
                        position: item.position,
                      })
                    }
                  >
                    <MdDone role="button" color="limegreen" />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>{t("decline")}</Tooltip>}
                >
                  <Button
                    onClick={() =>
                      respondToRequest.mutate({
                        userId: item?.user.uuid,
                        status: "rejected",
                        position: item.position,
                      })
                    }
                  >
                    <RxCross2 role="button" color="orangered" />
                  </Button>
                </OverlayTrigger>
              </div>
            </div>
            <hr />
          </>
        );
      })}
    </div>
  );
};

export default Requests;
