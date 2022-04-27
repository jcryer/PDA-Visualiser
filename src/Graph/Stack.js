import React, {useState, useEffect, useRef} from 'react'
import { TitleText } from "../ui-library";

import { createUseStyles } from "react-jss";
import clsx from "clsx";

const useStyles = createUseStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    width: 200,
  },
  scroll: {
    overflowY: "scroll",
  },
  all: {
    height: 32,
    width: 140,
    borderStyle: "dashed solid none solid",
    borderColor: "black",
    borderWidth: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontFamily: 'Roboto Mono',
  },
  base: {
      borderStyle: "dashed solid solid solid"
  },
  top: {
    borderStyle: "none solid none solid"
  },
  only: {
      borderStyle: "none solid solid solid"
  }
}); 


function StackItem ({ bottom, top, only, item }) {
    const classes = useStyles();

    return <div className={clsx(classes.all, {[classes.base]: bottom, [classes.top]: top, [classes.only]: only})}>
        {item}
    </div>;
}
function Stack({ list }) {
  const classes = useStyles();

  const [height, setHeight] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current)
    setHeight(ref.current.clientHeight)
  });


  if (list.length < 2) return (
    <div className={classes.root}> 
      <TitleText style={{display: "flex", flexGrow: 1, flexShrink: 1, flexBasis: 0}}>Stack</TitleText>
      <div className={classes.scroll} style={{display: "flex", flexGrow: 9, flexShrink: 9, flexBasis: 0, flexDirection: "column"}}>
        <StackItem top/><StackItem bottom item={list[0]}/>
      </div>
    </div>); 

  return (
    <div className={classes.root}>
      <TitleText style={{display: "flex", flexGrow: 1, flexShrink: 1, flexBasis: 0}}>Stack</TitleText>
      <div className={classes.scroll} style={{display: "flex", flexGrow: 9, flexShrink: 9, flexBasis: 0, flexDirection: "column"}}>
        {list.map((x, i) => <StackItem bottom={i === list.length - 1} top={i === 0} item={x} />)}
      </div>
    </div>);
  
  };

export default Stack;
