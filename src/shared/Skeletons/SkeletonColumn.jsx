// src/shared/Skeletons/SkeletonColumn.jsx
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Skeletons.scss";

const SkeletonColumn = () => (
  <div className="SkeletonColumn">
    <div className="SkeletonColumn__header">
      <Skeleton width={180} height={24} />
      <div className="SkeletonColumn__header-right">
        <Skeleton width={32} height={24} />
      </div>
    </div>

    <div className="SkeletonColumn__cards">
      <Skeleton height={60} />
      <Skeleton height={60} />
      <Skeleton height={60} />
    </div>
  </div>
);

export default SkeletonColumn;
