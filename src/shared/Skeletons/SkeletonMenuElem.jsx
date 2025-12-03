import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Skeletons.scss";

const SkeletonMenuElem = () => (
  <div className="SkeletonMenuElem">
    <div className="SkeletonMenuElem__left">
  
      <Skeleton  width={240} height={32}/>
    </div>
  </div>
);

export default SkeletonMenuElem;
