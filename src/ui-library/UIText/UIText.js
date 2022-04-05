import { createUseStyles } from "react-jss";
import { colors } from "../defaults";

const useStyles = createUseStyles({
  root: ({ color }) => ({
    color: color,
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "36px",
    lineHeight: "42px",
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
  }),
  "@media (max-width: 1024px)": {
    root: ({ color }) => ({
      fontSize: "24px",
      lineHeight: "28px",
    }),
  },
});

function UIText({ children, style, color }) {
  const classes = useStyles({ color });

  return (
    <div style={style} className={classes.root}>
      {children}
    </div>
  );
}

UIText.defaultProps = {
  style: {},
  color: colors.text.primary,
};

export default UIText;
