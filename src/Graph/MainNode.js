import React from "react";
import ReactFlow from 'react-flow-renderer';
import { createUseStyles } from "react-jss";
import clsx from "clsx";
import MainHandle from "./MainHandle";
const useStyles = createUseStyles({
  root: {
    position: 'relative',
    background: '#fff',
    border: 'solid 1px black',
    height: 50,
    width: 50,
    borderRadius: '50%',
  },
  accepting: {
    top: 2,
    left: 2,
    position: 'relative',
    background: '#fff',
    border: 'solid 1px black',
    height: 44,
    width: 44,
    borderRadius: '50%',
    zIndex: 1

  },
  hidden: {
      visibility: 'hidden'
  },
  handle: {
    borderRadius: 0,
    zIndex: 1,
}
}); 

function MainNode({ data }) {

  const classes = useStyles();
    return (
      <div className={classes.root}>
        <MainHandle
        />
        <div style={{zIndex: 2, position: "absolute", top: 14, textAlign: "center", width: "100%", fontFamily: 'Roboto Mono'}}>{data.label}</div>
        {data.accepting ? <div className={classes.accepting} /> : null}
      </div>
    );
  };

export default MainNode;
