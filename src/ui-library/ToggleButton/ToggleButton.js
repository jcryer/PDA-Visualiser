import React from "react";
import { colors } from "../defaults";
import { createUseStyles } from "react-jss";
import { useSpring, animated } from "react-spring";

const useStyles = createUseStyles({
  root: {
    position: "relative",
    width: 58,
    height: 38,
    cursor: "pointer",
  },
  groove: {
    position: "absolute",
    width: 34,
    height: 14,
    left: 12,
    top: "calc(50% - 14px/2)",
    opacity: 0.38,
    borderRadius: 10,
    background: colors.button.black,
  },
  knobWrapper: {
    position: "absolute",
    padding: 9,
  },
  knob: {
    width: 20,
    height: 20,
    background: colors.button.grey,
    borderRadius: 10,
    boxShadow:
      "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12)",
  },
});

function ToggleButton({ activated, onClick }) {
  const classes = useStyles();

  const grooveStyle = useSpring({
    background: activated ? colors.primary.main : colors.button.black,
  });
  const knobStyle = useSpring({
    background: activated ? colors.primary.main : colors.button.grey,
  });
  const knobWrapperStyle = useSpring({
    left: activated ? 20 : 0,
  });

  return (
    <div className={classes.root} onClick={onClick}>
      <animated.div
        className={classes.groove}
        style={grooveStyle}
      ></animated.div>
      <animated.div className={classes.knobWrapper} style={knobWrapperStyle}>
        <animated.div className={classes.knob} style={knobStyle}></animated.div>
      </animated.div>
    </div>
  );
}

export default ToggleButton;
