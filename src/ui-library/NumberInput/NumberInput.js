import React from "react";
import { createUseStyles } from "react-jss";
import { colors } from "../defaults";

const useStyles = createUseStyles({
  root: ({ fontSize, width }) => ({
    border: "none",
    borderBottom: "2px solid lightgrey",
    width: width,
    fontFamily: "inherit",
    fontWeight: "normal",
    fontSize: fontSize,
    outline: "none",
    color: colors.text.primary,
  }),
});
function NumberInput({ placeholder, onChange, num, min, max, width, fontSize }) {
  const classes = useStyles({ width, fontSize });
  return (
    <input
      type="number"
      className={classes.root}
      value={num}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
    />
  );
}

NumberInput.defaultProps = {
  size: 16,
  width: "",
};

export default NumberInput;
