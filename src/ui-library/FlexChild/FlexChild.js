import React from "react";
import { createUseStyles } from "react-jss";

const useStyle = createUseStyles({
  root: (props) => ({
    flexGrow: props.grow,
    flexBasis: props.basis,
    width: props.width,
    height: props.height,
  }),
});

function FlexChild({ children, grow, basis, width, height, style }) {
  const classes = useStyle({ grow, basis, width, height });
  return (
    <div style={style} className={classes.root}>
      {children}
    </div>
  );
}

FlexChild.defaultProps = {
  grow: 1,
  basis: 0,
  width: "auto",
  height: "auto",
  style: {},
};

export default FlexChild;
