import { State, Automata, Transition, Instance } from "./Logic/main";

import React, {useState, useEffect} from 'react';
import ReactFlow, {addEdge, ConnectionLineType} from 'react-flow-renderer';
import { MainNode, MainEdge, NewEdgeForm, Stack } from "./Graph/";
import { Button, Label, TextInput } from "./ui-library";

const nodeTypes = {
  mainNode: MainNode,
};

const edgeTypes = {
  mainEdge: MainEdge
}

function getNodeIndex(elements) {
  if (elements.length === 0) return 0;
  const map = elements.map(x => parseInt(x.id));
  return Math.max.apply(null, map) + 1;
}

function Graph() {

  const [elements, setElements] = useState([]);

  const [automata, setAutomata] = useState(new Automata({}));

  const [instance, setInstance] = useState(new Instance(new Automata({})));
  
  const [inputWord, setInputWord] = useState("");

  const [inRun, setInRun] = useState(0);
  const [runType, setRunType] = useState(0);

  const [success, setSuccess] = useState("");

  useEffect(() => {
    buildAutomata();
  }, [elements]);

  
  useEffect(() => {
    setInstance(new Instance(automata));
  }, [automata]);

  
  const onNodeDoubleClick = (event, node) => setElements((els) => {
    return els.map((el) => 
    el.id === node.id ? {...el, data: {...el.data, accepting: !el.data.accepting}}
    : el)
  });

  const isUniqueTransition = (transitions, input, stack, outStack) => {

    for (var i = 0; i < transitions.length; i++) {
      if (transitions[i].input == input && transitions[i].stack == stack && transitions[i].outStack == outStack) return false;
    }

    return true;
  }

  const deleteTransition = (id, iter) => setElements((els) => {
    const el = els.find(x => x.id === id);
    if (el.data.transitions.length === 1) return els.filter(x => x.id !== id);
      
    return [
      ...els.filter(x => x.id !== id),
      {
        ...el,
        data: {
          ...el.data,
          transitions: el.data.transitions.filter((x, i) => i !== iter)
        }
      }
    ]
  });

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
          data: { text: `custom edge`, source: params.source, target: params.target, transitions: [{input, stack, outStack}], num: startNum, selected: false, selectedTran: -1, delete: deleteTransition },
          arrowHeadType: 'arrowclosed',
        }
      ];
    }

    if (!isUniqueTransition(els.find(x => x === el).data.transitions, input, stack, outStack)) {
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

  const addNode = () => 
  {
    setElements((els) => {
      const newId = getNodeIndex(els);
      return [
        ...els,
        { id: `${newId}`, type: 'mainNode', data: { label: `${els.filter(x => x.type === 'mainNode').length + 1}`, accepting: false, selected: false, selectedTran: -1 }, position: { x: 100, y: 50 } },
      ]
    });
  };

  const deselectAll = () => setElements((els) => els.map(el => ({...el, data: {...el.data, selected: false, selectedTran: -1 }})));

  const selectNode = (id) => setElements((els) => {
    const mostEls = els.filter(x => x.id !== id).map(el => ({...el, data: {...el.data, selected: false, selectedTran: -1 }}));

    const el = els.find(x => x.id === id);

    return [
      ...mostEls, 
      {
        ...el,
        data: {
          ...el.data,
          selected: true
        }
      }
    ]
  });

  const selectTransition = (source, tran) => setElements((els) => {
    const id = `${source}-${tran.nextId}`;
    const el = els.find(x => x.id === id);

    const mostEls = els.filter(x => x.id !== id).map(el => ({...el, data: {...el.data, selected: false, selectedTran: -1 }}));

    return [
      ...mostEls, 
      {
        ...el,
        data: {
          ...el.data,
          selectedTran: el.data.transitions.findIndex(x => x.input === tran.input && x.stack === tran.requiredStack && x.outStack === tran.replacedStack),
          transitions: el.data.transitions.map(t => ({...t, selected: t === tran ? true : false})),
          selected: true
        }
      }
    ]
  });

  const onConnect = (params) => {setParams(params); setOpen(true);}

  const buildAutomata = () => setAutomata(a => {
    a = a.reset();
    const nodes = elements.filter(x => x.type === 'mainNode');
    const edges = elements.filter(x => x.type === 'mainEdge');

    for (var i = 0; i < nodes.length; i++) {
      a = a.addState(new State(nodes[i].id, nodes[i].data.accepting));
    }

    for (var i = 0; i < edges.length; i++) {
      const edge = edges[i];
      for (var j = 0; j < edge.data.transitions.length; j++) {
        const trans = edge.data.transitions[j];
        a = a.addTransition(
          edge.data.source, 
          new Transition(trans.input, trans.stack, edge.data.target, trans.outStack) 
        );
      }
    }
    a = a.setInitialId("0");
    return a;
  });

  const walkAutomata = () => {
    setSuccess("");
    instance.setInputWord(inputWord.split(""));
    const result = instance.walkAutomata();
    if (result) setSuccess("Word accepted.");
    else setSuccess("Word rejected.");
  }

  const resetStep = () => {
    instance.setInputWord(inputWord.split(""));
    setSuccess("");
    setInRun(0);
    setRunType(0);
    deselectAll();
    return;
  }
  
  const stepAutomata = () => {
    if (inRun === 2) {
      instance.setInputWord(inputWord.split(""));
      setSuccess("");
      setInRun(0);
      setRunType(0);
      return;
    }
    if (inRun === 0) {
      instance.setInputWord(inputWord.split(""));
      setSuccess("");
      setInRun(1);
      selectNode(instance.currentState);
      setRunType(0);
      return;
    }

    let run = runType;
    setRunType(x => x === 0 ? 1 : 0);
    let out = instance.doNextStep(runType);

    if (out.end) {
      if (instance.checkAccepted()) setSuccess("Word accepted.");
      else setSuccess("Word rejected.");
      setInRun(2);
      deselectAll();
      return;
    }

    if (run === 0) {
      selectTransition(instance.currentState, out.tran);
      return;
    }
    
    selectNode(out.state);
    
  }


  const [open, setOpen] = useState(false);
  const [params, setParams] = useState(null);

  return (
    <>
    <NewEdgeForm open={open} setOpen={setOpen} addTransition={addTransition} params={params} />
    <Label text="Enter Input Word:">
      <TextInput 
        onChange={(e) => { setInputWord(e.target.value)}} 
        text={inputWord} width={50} 
      />
    </Label>
    <Button onClick={addNode} text={"Add Node"} />
    <Button onClick={walkAutomata} text="Run" />
    <Button onClick={stepAutomata} text={inRun === 1 ? "Step" : inRun === 0 ? "Start Step" : "Reset"} />
    <Button onClick={resetStep} text={"Reset Step"} />
    {success}
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
  <Stack list={instance.stack} />
</>
  );
}

export default Graph;
