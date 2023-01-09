import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Image, Button, Form } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosFetch } from ".././axios";
import { getUserProfile } from "../redux/slices/profile";
import { ClipLoader } from "react-spinners";
import moment from "moment";
import Slider from "react-slick";
import { TiEdit } from "react-icons/ti";
import axios from "axios";

import { keys } from "../env";
import { COLUMNS } from "../columns";
import { useTranslation } from "react-i18next";
import { TableComponent } from "../components";

const Profile = () => {
  const client = useQueryClient();
  const navigate = useNavigate();
  const { userProfile } = useSelector((state) => state.profile);
  const { currentUser } = useSelector((state) => state.auth);
  const [inEditMode, setInEditMode] = useState(false);
  const [text, setText] = useState(userProfile?.bio || "");
  const [file, setFile] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [navigate, currentUser]);

  const dispatch = useDispatch();
  const { userId } = useParams();

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", keys.UPLOAD_PRESET);
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${keys.MY_CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data.secure_url;
  };

  useQuery(
    ["profile"],
    () => {
      return axiosFetch.get(`/user/${userId}`);
    },
    {
      onSuccess: ({ data }) => {
        dispatch(getUserProfile(data));
        setText(data.bio);
      },
    }
  );

  const { isLoading, mutate } = useMutation(
    async (updates) => {
      let img = userProfile.profileImg;
      if (file) {
        img = await upload();
      }
      return axiosFetch.put(
        `/user/${userId}`,
        { ...updates, profileImg: img },
        { withCredentials: true }
      );
    },
    {
      onSuccess: ({ data }) => {
        client.invalidateQueries(["profile"]);
        setInEditMode(false);
      },
    }
  );

  if (!userProfile) return <ClipLoader size={150} />;

  const {
    firstName,
    lastName,
    profileImg,
    profUpdated,
    email,
    createdAt,
    numberOfReviews,
    reviews,
    ratingNumber,
    bio,
  } = userProfile;

  return (
    <div className="profile">
      <div className="left">
        <div className="leftTop d-flex flex-column gap-3">
          <h1>
            {firstName} {lastName}
          </h1>
          {isLoading ? (
            <ClipLoader size={80} />
          ) : (
            <Image
              thumbnail="true"
              src={
                file
                  ? URL.createObjectURL(file)
                  : profUpdated
                  ? profileImg
                  : keys.PF + profileImg
              }
            />
          )}
          {inEditMode && (
            <Form.Control
              onChange={(e) => setFile(e.target.files[0])}
              id="profile"
              type="file"
            />
          )}
          <p>
            <strong>{t("number_of_reviews")} </strong>
            {numberOfReviews}
          </p>

          <p>
            <strong>{t("rating_number")}: </strong>
            {ratingNumber}
          </p>

          <p>
            <strong>{t("email")}: </strong>
            {email}
          </p>
          <div className="d-flex gap-2">
            <strong>{t("bio")}: </strong>
            {isLoading ? (
              <ClipLoader size={40} />
            ) : inEditMode ? (
              <Form.Control
                onChange={(e) => setText(e.target.value)}
                value={text}
                as="textarea"
              />
            ) : (
              <div className="bio">{bio ? bio : t("no_bio")}</div>
            )}
          </div>
          <p>
            <strong>{t("member_since")}: </strong>
            {moment(createdAt).format("L")}
          </p>
          <Button
            onClick={
              inEditMode
                ? () => mutate({ bio: text })
                : () => setInEditMode(true)
            }
            className="d-flex align-items-center gap-1 justify-content-center"
          >
            {inEditMode ? (
              "Save"
            ) : (
              <>
                <TiEdit size={20} />
                {t("update")}
              </>
            )}
          </Button>
        </div>

        <div className="leftBottom">
          <h1>
            {firstName} {t("reviews_own")}
          </h1>
          <div className="myReviews">
            {reviews.slice(0, 2).map((review) => (
              <Link
                to={`/review/${review.uuid}`}
                className="link"
                key={review.id}
              >
                <div className="mini-review">
                  <h4 className="text-center">{review.reviewName}</h4>
                  <Slider className="mini-slider" autoplay autoplaySpeed={2000}>
                    {review.reviewImages.map((img) => (
                      <img
                        thumbnail
                        src={img.isDefault ? keys.PF + img.img : img.img}
                        alt=""
                      />
                    ))}
                  </Slider>
                  <p className="mt-2">
                    <strong>{t("review_name")}:</strong> {review.reviewName}
                  </p>
                  <p className="mt-2">
                    <strong>{t("average_rating")}:</strong>{" "}
                    {review.averageRating}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="right">
        <h1>
          {userProfile?.firstName} {t("reviews_own")}{" "}
        </h1>
        <hr />
        <TableComponent
          subject={currentUser.uuid}
          data={userProfile?.reviews}
          columns={COLUMNS}
        />
      </div>
    </div>
  );
};

export default Profile;
