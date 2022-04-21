import React from "react";
import { createUseStyles } from "react-jss";
import clsx from "clsx";

const useStyles = createUseStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    overflowX: "scroll",
    width: 200,
    margin: "10 10 0 10",
  },
  scroll: {
    overflowY: "scroll"
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

    if (list.length < 2) return <div className={classes.root}> <StackItem top/><StackItem bottom  item={list[0]}/></div>; 

    return (
      <div className={classes.root}>
        <div className={classes.scroll}>
          {list.map((x, i) => <StackItem bottom={i === list.length - 1} top={i === 0} item={x} />)}
        </div>
      </div>);
    
  };

export default Stack;
