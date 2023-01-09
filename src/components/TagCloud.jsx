import React from "react";
import { TagCloud } from "react-tagcloud";
import { useTranslation } from "react-i18next";

const TagCloudComponent = () => {
  const { t } = useTranslation();
  return (
    <div className="tag-cloud">
      <TagCloud
        minSize={12}
        maxSize={35}
        tags={[
          { value: t("review"), count: 32 },
          { value: t("favorite_piece"), count: 18 },
          { value: t("rate_favorite"), count: 35 },
          { value: t("games"), count: 32 },
          { value: t("art"), count: 24 },
          { value: t("dance"), count: 34 },
          { value: t("theatre"), count: 20 },
          { value: t("books"), count: 24 },
          { value: t("highest_graded"), count: 21 },
          { value: t("latest_reviews"), count: 27 },
          { value: t("rating"), count: 21 },
          { value: t("reactions"), count: 26 },
        ]}
      />
    </div>
  );
};

export default TagCloudComponent;
