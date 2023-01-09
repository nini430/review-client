import React, { useEffect, useRef } from "react";
import jsCookie from "js-cookie";
import {
  Form,
  InputGroup,
  Nav,
  Navbar,
  Button,
  NavDropdown,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  BsFillMoonStarsFill,
  BsFillSunFill,
  BsSearch,
  BsBellFill,
  BsPeopleFill,
} from "react-icons/bs";
import { BiLogOut, BiSearch } from "react-icons/bi";
import { TbEditCircle } from "react-icons/tb";
import ReactSwitch from "react-switch";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { countries } from "../utils/countries";
import { changeTheme } from "../redux/slices/theme";
import { keys } from "../env";
import { toastOptions } from ".././utils/toastOptions";
import { clearNotification, logout } from "../redux/slices/auth";
import { useState } from "react";
import { axiosFetch } from ".././axios";
import { addSearchWord } from "../redux/slices/search";
import {
  addNotification,
  removeNotifications,
  replaceNotification,
} from "../redux/slices/notifications";
import Notifications from "./Notifications";
import { addRequest, clearRequest } from "../redux/slices/requests";
import Admissions from "./Admissions";

const NavBar = () => {
  const themeRef = useRef();
  const client = useQueryClient();
  const { currentUser } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socket);
  const { notifications } = useSelector((state) => state.notification);
  const { adminPin, requests } = useSelector((state) => state.request);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { isLight } = useSelector((state) => state.theme);
  const [showDropDown, setShowDropDown] = useState(false);
  const dispatch = useDispatch();
  const [showNots, setShowNots] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const lang =
    jsCookie.get("i18next") === "en" ? "gb" : jsCookie.get("i18next");
  const { t } = useTranslation();
  const unviewedNots = notifications?.filter((not) => not?.viewed === false);
  const unviewedReqs = requests?.filter((item) => item.viewed === false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        themeRef.current &&
        !themeRef.current.contains(e.target) &&
        !e.target.contains(document.getElementById("ham"))
      ) {
        setShowDropDown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    socket?.on("receive_notify", (data) => {
      dispatch(addNotification(data));
    });
    socket?.on("receive_unreact", (data) => {
      dispatch(removeNotifications(data));
    });

    socket?.on("receive_replace", (data) => {
      dispatch(replaceNotification(data));
    });
    if (currentUser && currentUser?.role === "user") {
      socket?.on("receive_respond", (data) => {
        dispatch(
          addRequest({ request: data.request, adminPin: data.adminPin })
        );
      });
    }
  }, [socket, dispatch, currentUser?.role, currentUser]);

  const searchHandler = () => {
    dispatch(addSearchWord(search));
    navigate("/search");
  };

  const openNotification = useMutation(
    () => {
      setShowNots(!showNots);
      if (unviewedNots.length) {
        return axiosFetch.put("/user/openNots", {}, { withCredentials: true });
      }
    },
    {
      onSuccess: () => {
        client.invalidateQueries(["notifications"]);
      },
    }
  );

  const logoutHandler = async () => {
    const response = await axios.get(
      `https://webportal1.herokuapp.com/${
        currentUser.withSocials ? "auth/logout" : "api/v1/auth/logout"
      }`,
      { withCredentials: true }
    );
    toast.success(response.data.msg, toastOptions);
    dispatch(clearNotification());
    dispatch(clearRequest());
    dispatch(logout());

    navigate("/login");
  };

  const openRequest = useMutation(
    () => {
      setShowRequests(!showRequests);
      if (unviewedReqs.length) {
        return axiosFetch.put("/user/openReqs", {}, { withCredentials: true });
      }
    },
    {
      onSuccess: () => {
        if (adminPin) {
          setTimeout(() => {
            logoutHandler();
          }, 2000);
        }
        client.invalidateQueries(["userRequests"]);
      },
    }
  );

  return (
    <Navbar className="navbar">
      <Link to="/" className="link">
        <Navbar.Brand>
          <h1>{t("app_title")}</h1>
        </Navbar.Brand>
      </Link>
      <Nav className="d-flex gap-2 w-100">
        <Nav.Item className="d-flex gap-1 align-items-center theme">
          <BsFillSunFill className="icon" size={20} />
          <ReactSwitch
            onChange={() => dispatch(changeTheme())}
            onColor="#eee"
            checkedIcon={false}
            uncheckedIcon={false}
            checked={!isLight}
          />
          <BsFillMoonStarsFill className="icon" size={20} />
        </Nav.Item>
        <Nav.Item className="d-flex align-items-center">
          <InputGroup>
            <Form.Control
              value={search || ""}
              onChange={(e) => setSearch(e.target.value)}
              className="searchInput"
              type="text"
              placeholder={t("nav_search")}
            />
            <Button
              onClick={searchHandler}
              disabled={!search}
              variant="secondary"
            >
              <BsSearch size={20} />
            </Button>
          </InputGroup>
        </Nav.Item>
        <Nav.Item className="endPart">
          <NavDropdown
            className="flag"
            title={<div className={`flag-icon flag-icon-${lang}`}></div>}
          >
            {countries.map((country) => (
              <NavDropdown.Item
                key={country.country_code}
                onClick={() => i18next.changeLanguage(country.locale)}
              >
                <div
                  className={`flag-icon flag-icon-${country.country_code}`}
                ></div>
              </NavDropdown.Item>
            ))}
          </NavDropdown>
          {currentUser && currentUser?.role !== "admin" && (
            <>
              {" "}
              <div
                onClick={() => openRequest.mutate()}
                className="notification position-relative"
              >
                <BsPeopleFill
                  id="request"
                  onClick={() => openRequest.mutate()}
                  className="icon"
                  role="button"
                  size={25}
                />
                {unviewedReqs.length > 0 ? (
                  <div className="circle">
                    {unviewedReqs.length > 0 ? unviewedReqs.length : ""}
                  </div>
                ) : (
                  ""
                )}
                {showRequests ? (
                  <Admissions setShowRequests={setShowRequests} />
                ) : (
                  ""
                )}
              </div>
              <div className="notification position-relative">
                <BsBellFill
                  id="notification"
                  onClick={() => openNotification.mutate()}
                  className="icon"
                  role="button"
                  size={25}
                />
                {unviewedNots.length ? (
                  <div className="circle">
                    {unviewedNots.length ? unviewedNots.length : ""}
                  </div>
                ) : (
                  ""
                )}
                {showNots ? <Notifications setShowNots={setShowNots} /> : ""}
              </div>
            </>
          )}

          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>{t("create_review")}</Tooltip>}
          >
            <Link to="/write">
              <TbEditCircle className="icon write" role="button" size={25} />
            </Link>
          </OverlayTrigger>
          {currentUser ? (
            <NavDropdown
              className="prof"
              variant="link"
              title={
                <img
                  className="userImg"
                  src={
                    currentUser.profUpdated
                      ? currentUser?.profileImg
                      : `${keys.PF}${currentUser?.profileImg}`
                  }
                  alt=""
                />
              }
            >
              <NavDropdown.Item onClick={() => (window.location = "/settings")}>
                {t("settings")}
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logoutHandler}>
                {" "}
                <div>
                  <BiLogOut />
                  <span>{t("logout")}</span>
                </div>{" "}
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Link to="/login">
              <Button className="signin">{t("login_title")}</Button>
            </Link>
          )}
        </Nav.Item>
        <div className="hamburger jsutify-self-end">
          <div
            onClick={() => setShowDropDown(!showDropDown)}
            id="ham"
            className="hamInner"
          >
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>

          <div
            ref={themeRef}
            className={`d-flex flex-column position-absolute drop ${
              showDropDown ? "show" : ""
            }`}
          >
            <div className="d-flex justify-content-between mode mb-2">
              <p>
                <strong>Theme:</strong>
                {isLight ? "Light" : "Dark"}
              </p>
              <Button onClick={() => dispatch(changeTheme())} size="sm">
                Change
              </Button>
            </div>
            <div className="d-flex justify-content-between mode">
              <p>
                <strong>Lang:</strong>
                <span className={`flag-icon flag-icon-${lang}`}></span>
              </p>
              <div className="d-flex gap-2" size="sm">
                {countries
                  .filter((country) => country.country_code !== lang)
                  .map((c) => (
                    <span
                      onClick={() => i18next.changeLanguage(c.locale)}
                      className={` flag-icon flag-icon-${c.country_code}`}
                    ></span>
                  ))}
              </div>
            </div>
            {currentUser && (
              <>
                <Link className="link" to="/write">
                  <div className="d-flex gap-1 mt-1">
                    <strong>Write</strong>
                    <TbEditCircle />{" "}
                  </div>
                </Link>
                <Link className="link" to="/settings">
                  <div className="d-flex gap-1 mt-1">
                    <strong>Settings</strong>
                    <TbEditCircle />{" "}
                  </div>
                </Link>
                <Button onClick={logoutHandler} className="align-self-center">
                  Log Out
                </Button>
              </>
            )}
            <div className="mobileInp d-flex ">
              <Form.Control
                placeholder={t("search")}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={searchHandler}>
                <BiSearch />
              </Button>
            </div>
          </div>
        </div>
      </Nav>

      <ToastContainer />
    </Navbar>
  );
};

export default NavBar;
