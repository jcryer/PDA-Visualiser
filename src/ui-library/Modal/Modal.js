import React from "react";
import { createPortal } from "react-dom";
import { createUseStyles } from "react-jss";
import { useSpring, animated } from "react-spring";
import { colors } from "../defaults";
// Code mostly taken from https://medium.com/swlh/building-modals-in-react-64d92591f4b

const useStyles = createUseStyles({
  overlay: {
    backgroundColor: "#999999",
    height: "100vh",
    left: 0,
    opacity: 0.5,
    position: "fixed",
    top: 0,
    width: "100vw",
    zIndex: 500,
  },
  modalWrapper: {
    display: "flex",
    justifyContent: "center",
    left: 0,
    otline: 0,
    overflowX: "hidden",
    overflowY: "auto",
    height: "100vh",
    width: "100vw",
    zIndex: 500,
    padding: 0,
  },
  modal: {
    alignItems: "center",
    background: colors.background.white,
    borderRadius: "0.25rem",
    display: "flex",
    flexDirection: "column",
    margin: "1.875rem",
    maxWidth: "500px",
    position: "absolute",
    zIndex: "1000",
    height: "auto",
    margin: 0,
    height: "min-content",
    top: "50%",
    transform: "translateY(-50%)",
    borderRadius: 20,
    boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
  },
});

function Modal({ children, isVisible }) {
  const classes = useStyles();
  const modalStyle = useSpring({
    from: { opacity: 0 },
    to: { opacity: isVisible ? 1 : 0 },
    config: { duration: 200 },
  });

  return createPortal(
    <div>
      <animated.div
        style={{ ...modalStyle, pointerEvents: isVisible ? "" : "none" }}
      >
        <div className={classes.overlay} />
        <div className={classes.modalWrapper}>
          <div className={classes.modal}>{children}</div>
        </div>
      </animated.div>
    </div>,
    document.body
  );
}

export default Modal;
