import { Instance } from "./Logic/main";
import React, {useState, useEffect} from 'react';
import ReactFlow, {addEdge, ConnectionLineType} from 'react-flow-renderer';
import { MainNode, MainEdge, NewEdgeForm } from "./Graph/";
import { Button } from "./ui-library";

/*import { SmartEdge, SmartEdgeProvider } from '@tisoap/react-flow-smart-edge';*/

const buildElements = (instance) => {
    return [
        { id: '1', type: 'mainNode', data: { label: '1', accepting: false }, position: { x: 100, y: 50 } },
        { id: '2', type: 'mainNode', data: { label: '2', accepting: true }, position: { x: 200, y: 50 } },
        { id: '3', type: 'mainNode', data: { label: '3', accepting: true }, position: { x: 100, y: 150 } },
        { id: '4', type: 'mainNode', data: { label: '4', accepting: true }, position: { x: 200, y: 150 } },
      ];
};

  const nodeTypes = {
    mainNode: MainNode,
  };

  const edgeTypes = {
      mainEdge: MainEdge
  }

  function getEdgeIndex(elements, params) {
    const elFilter = elements.filter(x => {
      const spl = x.id.split('-');
      const a = spl[0];
      const b = spl[1];
      if ((a == params.source && b == params.target) || (a == params.target && b == params.source)) {
        return true;
      }
      return false;
    });

    if (elFilter.length === 0) {
      return 0;
    }

    const map = elFilter.map(x => parseInt(x.id.split('-')[2]));

    return Math.max.apply(null, map) + 1;
  }

  function getNodeIndex(elements) {
    const map = elements.map(x => parseInt(x.id));

    return Math.max.apply(null, map) + 1;
  }

function Graph({ instance, addStateAut, addTransitionAut }) {

    const [elements, setElements] = useState(buildElements(instance));

    useEffect(() => {
        console.log(elements);
  }, [elements]);

  const onNodeDoubleClick = (event, node) => setElements((els) => {
    return els.map((el) => 
    el.id === node.id ? {...el, data: {...el.data, accepting: !el.data.accepting}}
    : el)
  });

  const isUniqueTransition = (transitions, input, stack, outStack) => {

    for (var i = 0; i < transitions.length; i++) {
      if (transitions[i].input == input && transitions[i].stack == stack && transitions[i] == outStack) return false;
    }

    return true;
  }

  const addTransition = (params, input, stack, outStack) => setElements((els) => {
    const el = els.find(x => x.id == `${params.source}-${params.target}`);

    const startNum = els.some(x => x.id == `${params.target}-${params.source}`) ? 1 : 0;
    if (el == undefined) {
      return [
        ...els, 
        {
          id: `${params.source}-${params.target}`,
          source: params.source,
          target: params.target,
          type: 'mainEdge',
          data: { text: `custom edge`, source: params.source, target: params.target, transitions: [{input, stack, outStack}], num: startNum, selected: true },
          arrowHeadType: 'arrowclosed',
        }
      ];
    }

    if (!isUniqueTransition(els.filter(x => x === el).map(x => x.data.transitions))) {
      return els;
    }

    return [
      ...els.filter(x => x !== el), 
      {
        ...el, 
        data: {
          ...el.data,
          transitions: [...el.data.transitions, {input, stack, outStack}],
        }
      }
    ];
  });

  const onConnect = (params) => {setParams(params); setOpen(true);}

  const addNode = () => setElements((els) => {
    const newId = getNodeIndex(els);
    return [
      ...els,
      { id: `${newId}`, type: 'mainNode', data: { label: `${els.filter(x => x.type === 'mainNode').length + 1}`, accepting: false }, position: { x: 100, y: 50 } },
    ]
  });


  const [open, setOpen] = useState(false);
  const [params, setParams] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <>
    <NewEdgeForm open={open} setOpen={setOpen} addTransition={addTransition} params={params} />
    <Button onClick={addNode} text={"Add Node"} />
    <ReactFlow 
    /*onConnectStart={onConnectStart}
    onConnectEnd={onConnectEnd}*/
    onConnect={onConnect}
    onNodeDoubleClick={onNodeDoubleClick}
    connectionMode={"loose"}
    connectionLineType={ConnectionLineType.Bezier}
    nodeTypes={nodeTypes} 
    edgeTypes={edgeTypes}
    elements={elements} 
    style={{height: 500}} />
</>
  );
}

export default Graph;
