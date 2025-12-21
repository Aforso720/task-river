import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Skeletons.scss";

const CardSkeleton = () => (
  <Skeleton
    className="SkeletonCard"
  />
);

export default CardSkeleton;
