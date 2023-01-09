import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Tab, Nav, Image, Card } from "react-bootstrap";
import { useState } from "react";
import { Review } from "../components";
import reactStringReplace from "string-replace-jsx";

import { keys } from ".././env";
import { useQuery } from "@tanstack/react-query";
import { axiosFetch } from "../axios";
import { getSearchResults } from "../redux/slices/search";

const SearchResults = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeKey, setActiveKey] = useState("users");
  const { searchResults, searchWord } = useSelector((state) => state.search);

  const { refetch } = useQuery(
    ["search"],
    () => {
      return axiosFetch.get(`/reviews/search/?text=${searchWord}`);
    },
    {
      onSuccess: ({ data }) => {
        dispatch(getSearchResults(data));
      },
      enabled: false,
    }
  );
  useEffect(() => {
    if (searchWord) {
      refetch();
    }
    if (!searchWord) {
      navigate("/");
    }
  }, [searchWord, navigate]);

  if (!searchResults) return <h1>No Searches</h1>;
  return (
    <div className="search">
      <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
        <Nav variant="tabs">
          <Nav.Link eventKey="users">Users</Nav.Link>
          <Nav.Link eventKey="reviews">Reviews</Nav.Link>
          <Nav.Link eventKey="comments">Comments</Nav.Link>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="users">
            {searchResults.users.length ? (
              <div className="d-flex flex-wrap gap-2">
                {searchResults.users.map((user) => (
                  <Link className="link" to={`/profile/${user.uuid}`}>
                    <div>
                      <Card className="userSearch">
                        <Card.Header className="text-center">
                          {user.firstName} {user.lastName}
                        </Card.Header>
                        <Card.Body className="d-flex flex-column align-items-center">
                          <Image
                            thumbnail
                            src={
                              user.profUpdated
                                ? user.profileImg
                                : keys.PF + user.profileImg
                            }
                          />
                        </Card.Body>
                        <Card.Footer className="text-center">
                          <strong>Personal Rating :</strong>
                          {user.ratingNumber}
                        </Card.Footer>
                      </Card>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <h1 className="text-center">Users Are not Found</h1>
            )}
          </Tab.Pane>
          <Tab.Pane eventKey="reviews">
            {searchResults.reviews.length ? (
              <div className="d-flex flex-wrap gap-2">
                {searchResults.reviews.map((review) => (
                  <div className="reviewSearch">
                    <Review review={review} />
                  </div>
                ))}
              </div>
            ) : (
              <h1 className="text-center">Reviews Are not Found</h1>
            )}
          </Tab.Pane>
          <Tab.Pane eventKey="comments">
            {searchResults.comments.length ? (
              <div className="d-flex flex-wrap gap-2">
                {searchResults.comments.map((item) => {
                  return (
                    <div className="commentSearch">
                      <Review review={item.review} />
                      <p>
                        {reactStringReplace(
                          item.comment,
                          new RegExp(searchWord, "gi"),
                          (match) => (
                            <mark>{match}</mark>
                          )
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <h1 className="text-center">No Comments Found </h1>
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default SearchResults;
