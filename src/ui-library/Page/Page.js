import React from "react";
import { createUseStyles } from "react-jss";
import { colors } from "../defaults";

const useStyles = createUseStyles({
  root: {
    backgroundColor: colors.background.gray,
    height: "100vh",
    width: "100vw",
    position: "fixed",
    "&, & *": {
      boxSizing: "border-box",
    },
    overflow: "hidden",
  },
});

function Page({ children }) {
  const classes = useStyles();
  return <div className={classes.root}>{children}</div>;
}

export default Page;
