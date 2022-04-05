import { width } from '@mui/system';
import React from 'react';
import { getSmoothStepPath, getMarkerEnd, getEdgeCenter } from 'react-flow-renderer';

function calcOffset(sX, sY, tX, tY, data) {
  const index = data.num;

  console.log(data);
/*
  const sourceX = data.source < data.target ? sX : tX;
  const sourceY = data.source < data.target ? sY : tY;
  const targetX = data.source < data.target ? tX : sX;
  const targetY = data.source < data.target ? tY : sY;
*/
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

  //const m = 0.3 * (index )
  //const m = -0.25 * index;

  return [centre[0] - (m * diffY), centre[1] + (m * diffX), centre[0] - ((m * diffY) / 2), centre[1] + ((m * diffX) / 2)];
}

export default function MainEdge({
  id,
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
  const edgePath = getSmoothStepPath({ sourceX, sourceY: sourceY + 15, sourcePosition, targetX, targetY: targetY + 15, targetPosition });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  const [edgeCentreX, edgeCentreY] = getEdgeCenter({
    sourceX,
    sourceY: sourceY + 15,
    targetX,
    targetY: targetY + 15
  });

  const onEdgeClick = (evt, id) => {
    evt.stopPropagation();
    alert(`remove ${id}`);
  };

  let pathNew = `M`;
  const index = data.num;

  let midX = 0;
  let midY = 0;

  var numLines = data.transitions.length;

  if (sourceX === targetX && sourceY === targetY) {
    pathNew = `M ${sourceX} ${sourceY + 15} c ${((index+1) * -30) - 20} ${((index+1) * -30) - 20}, ${((index+1) * 30) + 20} ${((index+1) * -30) - 20}, 0 0`;

    midX = sourceX;
    midY = sourceY - 20 - (10 * numLines);
  }
  else {
    const foreignObjectSize = 40;


    
    const pull = calcOffset(
      sourceX,
      sourceY + 15,
      targetX,
      targetY + 15, data);

      midX = pull[2];
      midY = pull[3];
    pathNew = `M ${sourceX} ${sourceY + 15} Q ${pull[0]} ${pull[1]} ${targetX} ${targetY + 15}`;
  }

  return (
    <>
      <path id={id} /*style={style}*/ style={{stroke: data.selected ? "red" : "black", strokeWidth: "3"}} className="react-flow__edge-path" d={pathNew}  markerEnd={"url(#head)"} />
      <foreignObject
        width={30}
        height={30}

      >
          <button
            className="edgebutton"
            onClick={(event) => onEdgeClick(event, id)}
          >
            x
          </button>
  </foreignObject>
       {/* <text>
      <textPath href={`#${id}`} style={{ fontSize: '12px' }} startOffset="50%" textAnchor="middle">
          {data.text}
        </textPath>
      </text>*/}
      <rect x={midX - 25} y={midY - ((10 * numLines) / 2)} width={Math.max(...(data.transitions.map(x => `${x.input}, ${x.stack}→${x.outStack}}`.length))) * 7} height={(10 * numLines)} style={{fill: "#fff", zIndex: 1}}></rect>

      {data.transitions.map((x, i) => <text x={midX - 25} y={midY - ((10 * numLines) / 2)} dy={8 + (i * 10)} dx={2} style={{ fontFamily: 'Roboto Mono', fontSize: '12px', fill: "#000", zIndex: 10 }}>{x.input}, {x.stack}→{x.outStack}</text>)}
      {/*<text x={edgeCentreX - 25} y={edgeCentreY - ((10 * numLines) / 2)} dy={8} dx={2} style={{ fontSize: '12px', fill: "#000", zIndex: 10 }}>a, a→b</text>
      <text x={edgeCentreX - 25} y={edgeCentreY - ((10 * numLines) / 2)} dy={8+10} dx={2} style={{ fontSize: '12px', fill: "#000", zIndex: 10 }}>b, a→c</text>
      <text x={edgeCentreX - 25} y={edgeCentreY - ((10 * numLines) / 2)} dy={8+20} dx={2} style={{ fontSize: '12px', fill: "#000", zIndex: 10 }}>b, a→c</text>
    */}
    </>
  );
}
