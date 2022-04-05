import React from "react";
import { createUseStyles } from "react-jss";
import { colors } from "../defaults";

const useStyles = createUseStyles({
  root: ({ color }) => ({
    color: color,
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "19px",
  }),
});

function BodyText({ style, children, color }) {
  const classes = useStyles({ color });

  return (
    <div style={style} className={classes.root}>
      {children}
    </div>
  );
}

BodyText.defaultProps = {
  style: {},
  color: colors.text.primary,
};

export default BodyText;
