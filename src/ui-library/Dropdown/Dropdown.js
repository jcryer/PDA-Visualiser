import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    paddingBottom: 10,
  },
});

function Dropdown({ list, text, value, onChange }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
        <select value={value} onChange={onChange}>
            {list.map((e, i) => {
                return <option key={i} value={e.id}>{e.name}</option>
            })}
        </select>
    </div>
  );
}

export default Dropdown;



