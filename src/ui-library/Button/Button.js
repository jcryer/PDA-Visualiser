import React from "react";
import { colors } from "../defaults";
import { createUseStyles } from "react-jss";
import { ButtonText } from "..";
import Button from '@mui/material/Button';

const useStyles = createUseStyles({
  root: {
    borderRadius: 10,
    padding: "10px 10px",
    display: "inline-block",
    fontFamily: 'Roboto Mono',
    marginRight: 2,
    marginTop: 5,
    height: 50,
    width: 200,
    textAlign: "center"
  }
});

function NewButton({ onClick, text, style }) {
  const classes = useStyles();
  return (
    <Button
    variant="contained"
      style={{ ...style }}
      className={classes.root}
      onClick={onClick}
    >
      <ButtonText color={""}>{text}</ButtonText>
    </Button>
  );
}

Button.defaultProps = {
  text: "",
  style: {},
};

export default NewButton;
