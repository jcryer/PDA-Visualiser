import React, {useRef, useState} from 'react';
import { getEdgeCenter } from 'react-flow-renderer';
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({

  closeButton: {
    background: "#eee",
    border: "1px solid #fff",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "5px",
    height: "14px",
    lineHeight: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "14px",
    marginLeft: 2,
    marginTop: 4,
    "&:hover": {
       boxShadow: "0 0 3px 1px rgb(0 0 0 / 8%)"
    }
  }
}); 

function calcOffset(sX, sY, tX, tY, data) {
  const index = data.num;

  const sourceX = sX;
  const sourceY = sY;
  const targetX = tX;
  const targetY = tY;

  const centre = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY
  });

  const diffX = targetX - sourceX;
  const diffY = targetY - sourceY;
  
  const m = 0.35 * (Math.floor((index + 1) / 2)) * (index % 2 == 0 ? 1 : -1);

  return [centre[0] - (m * diffY), centre[1] + (m * diffX), centre[0] - ((m * diffY) / 2), centre[1] + ((m * diffX) / 2)];
}

export default function MainEdge({
  id,
  key,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  arrowHeadType,
  markerEndId,
}) {
  const onEdgeClick = (evt, i) => {
    evt.stopPropagation();
    data.delete(id, i);
    //alert(`remove ${i}`);
  };

  const [lineRef, setLineRef] = useState(null);


  function ArrowHead({isSelf}) {
    if (!lineRef) return <></>;

    const length = lineRef.getTotalLength();
    var offset = isSelf ? 49 : 40;
    var offset2 = isSelf ? 0 : 25;
    const arrowPoint1 = lineRef.getPointAtLength(length - offset);
    const arrowPoint2 = lineRef.getPointAtLength(length - offset2);
    return <>
      <defs>
        <marker id="arrowhead" markerWidth="15" markerHeight="15" refX="0" refY="7.5" orient="auto">
          <polygon points="0 0, 15 7.5, 0 15" />
        </marker>
      </defs>
      <line x1={arrowPoint1.x + (isSelf ? 2 : 0)} y1={arrowPoint1.y} x2={arrowPoint2.x + (isSelf ? 2 : 0)} y2={arrowPoint2.y} stroke="#fff" markerStart="url(#arrowhead)" />
    </>;
  }

  let pathNew = `M`;
  const index = data.num;

  let midX = 0;
  let midY = 0;

  var numLines = data.transitions.length;

  let isSelf = false;
  if (sourceX === targetX && sourceY === targetY) {
    isSelf = true;
    pathNew = `M ${sourceX} ${sourceY + 25} c ${((index+1) * -25) - 20} ${((index+1) * -75) - 20}, ${((index+1) * 25) + 20} ${((index+1) * -75) - 20}, 0 0`;

    midX = sourceX + 5;
    midY = sourceY - 45 - (10 * numLines);
  }
  else {
    
    const pull = calcOffset(
      sourceX,
      sourceY + 15,
      targetX,
      targetY + 15, data);

      midX = pull[2];
      midY = pull[3];
    pathNew = `M ${sourceX} ${sourceY + 15} Q ${pull[0]} ${pull[1]} ${targetX} ${targetY + 15}`;
  }

  const maxWidth = Math.max(...(data.transitions.map(x => `${x.input}, ${x.stack}→${x.outStack}}`.length))) * 7;

  const classes = useStyles();

  return (
    <>
    <ArrowHead isSelf={isSelf}/>
    <path ref={newRef => setLineRef(newRef)} id={id} style={{stroke: data.selected ? "red" : "black", strokeWidth: "3"}} className="react-flow__edge-path" d={pathNew} />
    
    <rect x={midX - 25} y={midY - ((13 * numLines) / 2)} width={maxWidth} height={(13 * numLines)} style={{fill: "#fff", zIndex: 1}}></rect>

    {data.transitions.map((x, i) => {
      const topLeftX = midX - 25;
      const topLeftY = midY - ((13 * numLines) / 2) + (8 + (i * 13));
      return (<>
        <text key={`text-${i}`} x={topLeftX} y={topLeftY} style={{ fontFamily: 'Roboto Mono', fontSize: '12px', fill: i === data.selectedTran ? "red" : "#000", zIndex: 10 }}>{x.input}, {x.stack}→{x.outStack}</text>
        <foreignObject key={`fo-${i}`} xmlns="http://www.w3.org/2000/svg" x={topLeftX + maxWidth} y={topLeftY - 13} width="20" height="20">
          <button 
            key={`but-${i}`}
            className={classes.closeButton}
            onClick={(event) => onEdgeClick(event, i)}
          >
            x
          </button>
        </foreignObject>
      </>);
    })}
        </>
  );
}
