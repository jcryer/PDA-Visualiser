import React from "react";

function FlexParent({
  children,
  direction,
  wrap,
  alignContent,
  alignItems,
  alignSelf,
  justifyContent,
  width,
  height,
  padding,
  shortcut,
  margin,
}) {
  let style = {
    display: "flex",
  };
  switch (shortcut) {
    case "center":
      style = {
        ...style,
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      };
      break;
    case "bottom-left":
      style = {
        ...style,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-end",
      };
      break;
    case "bottom-right":
      style = {
        ...style,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
      };
      break;
    case "top-left":
      style = {
        ...style,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      };
      break;
    case "top-right":
      style = {
        ...style,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-start",
      };
      break;
  }

  if (direction !== null) style = { ...style, flexDirection: direction };
  if (wrap !== null) style = { ...style, flexWrap: wrap ? "wrap" : "nowrap" };
  if (alignContent !== null) style = { ...style, alignContent: alignContent };
  if (alignItems !== null) style = { ...style, alignItems: alignItems };
  if (alignSelf !== null) style = { ...style, alignSelf: alignSelf };
  if (justifyContent !== null)
    style = { ...style, justifyContent: justifyContent };
  if (padding !== null) style = { ...style, padding: padding };
  if (margin !== null) style = { ...style, margin: margin };
  if (width !== null) style = { ...style, width: width };
  if (height !== null) style = { ...style, height: height };

  return <div style={style}>{children}</div>;
}

FlexParent.defaultProps = {
  width: "100%",
  height: "100%",
  direction: null,
  flexWrap: null,
  alignContent: null,
  alignItems: null,
  justifyContent: null,
  alignSelf: null,
  padding: null,
  margin: null,
};

export default FlexParent;
