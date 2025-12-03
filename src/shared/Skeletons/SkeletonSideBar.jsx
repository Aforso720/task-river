import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Skeletons.scss";

const SkeletonSideBar = () => (
  <div className="SkeletonSideBar">
    <Skeleton width={240} height={48} borderRadius={8} />
  </div>
);

export default SkeletonSideBar;
