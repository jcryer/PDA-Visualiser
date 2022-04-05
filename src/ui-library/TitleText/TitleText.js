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

function TitleText({ style, children, color, className }) {
  const classes = useStyles({ color });

  return (
    <div style={style} className={classes.root + " " + className}>
      {children}
    </div>
  );
}

TitleText.defaultProps = {
  style: {},
  color: colors.text.primary,
};

export default TitleText;
