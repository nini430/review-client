import React from "react";
import { Review } from "./";
import Slider from "react-slick";

const ReviewList = ({ reviews }) => {
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
      {reviews?.data.map((review) => (
        <Review review={review} />
      ))}
    </Slider>
  );
};

export default ReviewList;
