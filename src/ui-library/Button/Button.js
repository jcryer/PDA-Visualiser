import React from "react";
import { colors } from "../defaults";
import { createUseStyles } from "react-jss";
import { ButtonText } from "..";

const useStyles = createUseStyles({
  root: ({ activated }) => ({
    borderRadius: 10,
    padding: "5px 10px",
    display: "inline-block",
    cursor: activated ? "pointer" : "default",
    backgroundColor: activated ? colors.primary.main : colors.actions.disabled,
    color: activated ? colors.primary.contrastText : colors.text.disabled,
  }),
});

function Button({ onClick, text, activated, style }) {
  const classes = useStyles({ activated });
  return (
    <div
      style={{ ...style }}
      className={classes.root}
      onClick={activated ? onClick : null}
    >
      <ButtonText color={""}>{text}</ButtonText>
    </div>
  );
}

Button.defaultProps = {
  activated: true,
  text: "",
  style: {},
};

export default Button;
