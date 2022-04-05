import React from "react";
import { createUseStyles } from "react-jss";
import { colors } from "../defaults";
import { animated, useTransition } from "@react-spring/web";

const useStyles = createUseStyles({
  root: ({ width, height }) => ({
    position: "relative",
    width: width,
    height: height,
    backgroundColor: colors.background.white,
    borderRadius: 10,
  }),
  animated: ({ width, height }) => ({
    width: width,
    height: height,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    position: "absolute",
  }),
  notAnimated: ({ width, height }) => ({
    backgroundColor: colors.background.white,
    borderRadius: 10,
    width: width,
    height: height,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
  }),
});

function FormContainer({ children, width, height, shouldAnimate }) {
  const classes = useStyles({ width, height });
  const transition = useTransition(children, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    keys: [children.key],
  });

  if (!shouldAnimate)
    return <div className={classes.notAnimated}>{children}</div>;
  else {
    return (
      <div className={classes.root}>
        {transition((style, item) => (
          <animated.div className={classes.animated} style={{ ...style }}>
            {item}
          </animated.div>
        ))}
      </div>
    );
  }
}

export default FormContainer;
