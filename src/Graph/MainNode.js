import React from "react";
import ReactFlow from 'react-flow-renderer';
import { createUseStyles } from "react-jss";
import clsx from "clsx";
import MainHandle from "./MainHandle";
const useStyles = createUseStyles({
  root: {
    position: 'relative',
    background: '#fff',
    border: 'solid 2px black',
    height: 50,
    width: 50,
    borderRadius: '50%',
  },
  accepting: {
    top: 2,
    left: 2,
    position: 'relative',
    background: '#fff',
    border: 'solid 2px black',
    height: 42,
    width: 42,
    borderRadius: '50%',
    zIndex: 1

  },
  hidden: {
      visibility: 'hidden'
  },
  handle: {
    borderRadius: 0,
    zIndex: 1,
  },
  selected: {
    borderColor: 'red'
  }
}); 

function MainNode({ data }) {

  const classes = useStyles();

  const mainStyle = clsx(classes.root, {
    [classes.selected] : data.selected
})
const acceptingStyle = clsx(classes.accepting, {
  [classes.selected] : data.selected
})
    return (
      <div className={mainStyle}>
        <MainHandle
        />
        <div style={{zIndex: 2, position: "absolute", top: 14, textAlign: "center", width: "100%", fontFamily: 'Roboto Mono'}}>{data.label}</div>
        {data.accepting ? <div className={acceptingStyle} /> : null}
      </div>
    );
  };

export default MainNode;
