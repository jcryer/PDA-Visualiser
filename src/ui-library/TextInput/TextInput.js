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
function TextInput({ placeholder, onChange, text, width, fontSize }) {
  const classes = useStyles({ width, fontSize });
  return (
    <input
      type="text"
      className={classes.root}
      value={text}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

TextInput.defaultProps = {
  size: 16,
  width: "",
};

export default TextInput;
