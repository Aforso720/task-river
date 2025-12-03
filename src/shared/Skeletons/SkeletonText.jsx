import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Skeletons.scss";

const SkeletonText = ({ width = "60%", height = 20 }) => (
  <Skeleton width={width} height={height} />
);

export default SkeletonText;
