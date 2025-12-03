import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import './Skeletons.scss'

const CardSkeleton = () => (
  <Skeleton
    className='SkeletonCard'
    width={350}
    height={500}
    style={{ borderRadius: 30 }}
  />
);

export default CardSkeleton;
