import React from "react";
import { createUseStyles } from "react-jss";
import { colors } from "../defaults";

const useStyles = createUseStyles({
  root: ({ color }) => ({
    color: color,
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "21px",
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
  }),
});

function ButtonText({ style, children, color }) {
  const classes = useStyles({ color });

  return (
    <div style={style} className={classes.root}>
      {children}
    </div>
  );
}

ButtonText.defaultProps = {
  style: {},
  color: colors.text.primary,
};

export default ButtonText;
