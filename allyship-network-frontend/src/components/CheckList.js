import React from "react";
import CheckListItem from "./CheckListItem";
import { TASKS } from "../constants";

const CheckList = () => {
  const checkListItems = TASKS.map((task, i) => <CheckListItem key={`task-${i}`} taskObj={task} taskIndex={i} />);
  return (
    <>
      <h2>Participation Checklist:</h2>
      {checkListItems}
    </>
  );
};

export default CheckList;
