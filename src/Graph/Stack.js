import React from "react";
import { createUseStyles } from "react-jss";
import clsx from "clsx";

const useStyles = createUseStyles({
  root: {
    height: 50,
    width: 50,
    borderStyle: "dashed solid none solid",
    borderColor: "black",
    borderWidth: "thick",
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

    return <div className={clsx(classes.root, {[classes.base]: bottom, [classes.top]: top, [classes.only]: only})}>
        {item}
    </div>;
}
function Stack({ list }) {

    if (list.length < 2) return <> <StackItem top/><StackItem bottom item={list[0]}/></>;    
    return <>{list.map((x, i) => <StackItem bottom={i === list.length - 1} top={i === 0} item={x} />)}</>;
    
  };

export default Stack;
