import React from "react";
import { createUseStyles } from "react-jss";
import { colors } from "../defaults";

const useStyles = createUseStyles({
  root: ({ width, fontSize }) => ({
    display: "inline-block",
    border: "none",
    borderBottom: "2px solid lightgrey",
    width: width,
    fontFamily: "Roboto Mono",
    fontWeight: "normal",
    fontSize: fontSize,
    outline: "none",
    color: colors.text.primary,
    marginRight: 10
  }),
});
function TextInput({ placeholder, onChange, text, width, fontSize, submit }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      submit();
    }
  }

  const classes = useStyles({ width, fontSize });
  return (
    <input
      type="text"
      className={classes.root}
      value={text}
      onChange={onChange}
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
    />
  );
}

TextInput.defaultProps = {
  fontSize: 20,
  width: 500,
};

export default TextInput;
