import React from "react";
import { createUseStyles } from "react-jss";
import TitleText from "../TitleText/TitleText";

const useStyles = createUseStyles({
  root: {
    paddingBottom: 10,
    fontFamily: 'Roboto Mono',
  },
});
function Label({ children, text }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TitleText style={{ paddingBottom: 5 }}>{text}</TitleText>
      {children}
    </div>
  );
}

export default Label;
