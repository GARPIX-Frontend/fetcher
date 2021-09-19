import React from "react";
import { useStoreon } from 'storeon/react'

const PageContainer = ({Component}) => {
  const { page } = useStoreon('page');
  const { data, error, status } = page;
  return <>{Component(data, error, status)}</>
}

export {
  PageContainer
}
