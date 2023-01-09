import { getText } from "./utils/getText";
import Slider from "react-slick";
import moment from "moment";
import { keys } from "./env";
import { Link } from "react-router-dom";
import {Button,Image} from "react-bootstrap"



export const COLUMNS = [
  {
    Header: "review Name",
    accessor: "reviewName",
  },
  {
    Header: "reviewed Piece",
    accessor: "reviewedPiece",
  },
  {
    Header: "group",
    accessor: "group",
  },
  {
    Header: "tags",
    accessor: "tags",
    Cell: ({ value }) =>
      value
        .split(",")
        .map((item) => `#${item}`)
        .join(","),
  },
  {
    Header: "review Text",
    accessor: "reviewText",
    Cell: ({ value }) =>
      getText(value).length > 40
        ? getText(value).substring(0, 40) + "..."
        : getText(value),
  },
  {
    Header: "Images",
    accessor: "reviewImages",
    Cell: ({ value }) => (
      value.length ? (
        <Slider slidesToShow={1} autoplay autoplaySpeed={2000}>
        {value.length?value.map((val) => (
          <img className="miniImg" src={val.isDefault?keys.PF+val.img:val.img} alt="" />
        )):"No Images"}
      </Slider>
      ):"No Images"
     
    ),
   disableSortBy:true,
   disableFilters:true
  },

  {
    Header: "Grade",
    accessor: "grade",
  },
  {
    Header: "average Rating",
    accessor: "averageRating",

  },

  {
    Header: "rating Count",
    accessor: "ratingsCount",
   
  },
  {
    Header: "likes Count",
    accessor: "likesCount",

  },
  {
    Header: "comments Count",
    accessor: "commentsCount",

  },

  {
    Header: "created At",
    accessor: "createdAt",
    Cell: ({ value }) => moment(value).format("L"),
  },
  {
    Header:"Review Link",
    accessor:"uuid",
    Cell:({value})=><Link to={`/review/${value}`}>Link</Link>
  }
];

export const userColumns=[
  {
    Header:"First Name",
    accessor:"firstName",

  },
  {
    Header:"Last Name",
    accessor:"lastName",

  },
  {
    Header:"email",
    accessor:"email",

  },
  {
    Header:"profile Image",
    accessor:"profileImg",
    Cell:(props)=><Image width={40} height={30} thumbnail src={props.row?.original?.profUpdated?props.value:keys.PF+props.value}/>

  },
  {
    Header:"Rating Number",
    accessor:"ratingNumber",

  },
  {
    Header:"Number of Reviews Posted",
    accessor:"numberOfReviews",

  },
  {
    Header:"Role",
    accessor:"role",

  },
  {
    Header:"Member Since",
    accessor:"createdAt",
    Cell:({value})=>moment(value).format("L")

  },
  {
    Header:"Profile Link",
    accessor:"uuid",
    Cell:({value})=><Link  to={`/profile/${value}`}>Link To Profile</Link>
  },
  {
    Header:"Status",
    accessor:"status",
    Cell:({value})=><span className={value}>{value.charAt(0).toUpperCase()+value.substring(1,value.length)}</span>
  },
  
  
]

export const adminReviewColumns=[
  ...COLUMNS,
  {
    Header:'Created By',
    accessor:"user",
    Cell:({value})=><p>{value.firstName} {value.lastName}</p>
  }
]

export const deletedUsers=[
  ...COLUMNS,
]