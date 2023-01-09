import React from "react";
import { Review } from "./";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";

const ReviewList = ({ reviews }) => {
  const {t}=useTranslation();
  return (
    <Slider
      responsive={[
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
          },
        },

        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            dots: true,
          },
        },
        {
          breakpoint: 960,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
      ]}
      autoplay
      autoplaySpeed={2000}
      infinite={false}
      className="cards"
      slidesToShow={4}
    >
      {reviews?.data.length? reviews.data.map((review) => (
        <Review review={review} />
      )):<h1>{t("reviews_empty")}</h1>}
    </Slider>
  );
};

export default ReviewList;
