import React from "react";
import ReactFlow from 'react-flow-renderer';
import { createUseStyles } from "react-jss";
import clsx from "clsx";
import MainHandle from "./MainHandle";
const useStyles = createUseStyles({
  whole: {
    height: 75,
    width: 75,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  svg: {
    position: "absolute",
    width: 75,
    height: 75
  },
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
  inner: {
    zIndex: 2, 
    position: "absolute", 
    top: 14, 
    textAlign: "center", 
    width: "100%", 
    fontFamily: 'Roboto Mono',
  },
  hidden: {
      visibility: 'hidden'
  },
  handle: {
    borderRadius: 0,
    zIndex: 1,
  },
  highlighted: {
    borderColor: 'red'
  },
  selected: {
    color: 'purple',
    borderColor: 'purple'
  },
}); 

function MainNode({ data, selected }) {

  const classes = useStyles();

  const mainStyle = clsx(classes.root, {
    [classes.selected] : selected,
    [classes.highlighted] : data.selected

  });

  const acceptingStyle = clsx(classes.accepting, {
    [classes.highlighted] : data.selected
  });


  //const arrowPoint1 = {x: }
  if (data.start)
    return (
      <div className={clsx({[classes.whole]: data.start})}>
        <svg className={classes.svg}>
          <defs>
            <marker id="start" markerWidth="15" markerHeight="15" refX="0" refY="7.5" orient="auto">
              <polygon points="0 0, 15 7.5, 0 15" />
            </marker>
          </defs>
          <line x1={0} y1={0} x2={20} y2={20} stroke="#000" markerEnd="url(#start)" />
        </svg>
        <div className={mainStyle}>
          <MainHandle/>
          <div className={clsx(classes.inner, {[classes.selected]: selected})}>{data.label}</div>
          {data.accepting ? <div className={acceptingStyle} /> : null}
        </div>
      </div>
    );

    return (
      <div className={mainStyle}>
        <MainHandle/>
        <div className={clsx(classes.inner, {[classes.selected]: selected})}>{data.label}</div>
        {data.accepting ? <div className={acceptingStyle} /> : null}
      </div>
    );
  };

export default MainNode;
