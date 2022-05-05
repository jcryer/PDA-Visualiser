import { State, Automata, Transition, Instance } from "./Logic/main";
import React, { useState, useEffect, useRef } from 'react'
import ReactFlow, {
  ConnectionLineType,
  Background,
  MiniMap,
  Controls,
  useZoomPanHelper
} from "react-flow-renderer";
import { MainNode, MainEdge, NewEdgeForm, Stack, HelpModal, ExampleModal, ConfirmModal } from "./Graph/";
import { NewButton, TextInput, TitleText } from "./ui-library";
import { saveAs } from "file-saver";
import ReactFileReader from "react-file-reader";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Button from "@mui/material/Button";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IconButton } from '@mui/material';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import anbn from './examples/anbn.json';
import length from './examples/length.json';
import wcwr from './examples/wcwr.json';

const loadAnbn = () => JSON.parse(JSON.stringify(anbn));
const loadLength = () => JSON.parse(JSON.stringify(length));
const loadWcwr = () => JSON.parse(JSON.stringify(wcwr));

const nodeTypes = {
  mainNode: MainNode,
};

const edgeTypes = {
  mainEdge: MainEdge,
};

function getNodeIndex(elements) {
  if (elements.length === 0) return 0;
  const map = elements.map((x) => parseInt(x.id));
  return Math.max.apply(null, map) + 1;
}

function Graph() {

  const { fitView } = useZoomPanHelper();

  const [elements, setElements] = useState([]);

  const [automata, setAutomata] = useState(new Automata({}));

  const [instance, setInstance] = useState(new Instance(new Automata({})));

  const [inputWord, setInputWord] = useState("");

  const [inRun, setInRun] = useState(0);
  const [runType, setRunType] = useState(0);

  const [success, setSuccess] = useState("");

  const [selectedNode, setSelectedNode] = useState(null);

  const [example, setExample] = useState("");

  const [reactInstance, setReactInstance] = useState(null);

  const handleExample = async (val) => {
    setExample(val);
    switch (val) {
      case 1:
        setElements(loadAnbn());
        break;
      case 2:
        setElements(loadLength());
        break;
      case 3:
        setElements(loadWcwr());
        break;
    }
    await new Promise(r => setTimeout(r, 50));
    setElements(els => 
      els.map(el => ({...el, data: {...el.data, delete: deleteTransition } }))
    );
    fitView({ padding: 0.8 });
  };

  useEffect(() => {
    buildAutomata();
  }, [elements]);

  useEffect(() => {
    setInstance(new Instance(automata));
  }, [automata]);

  const onNodeDoubleClick = (event, node) =>
    setElements((els) => {
      return els.map((el) =>
        el.id === node.id
          ? {
              ...el,
              data: {
                ...el.data,
                accepting: !el.data.accepting,
              },
            }
          : el
      );
    });

  const isUniqueTransition = (transitions, input, stack, outStack) => {
    for (var i = 0; i < transitions.length; i++) {
      if (
        transitions[i].input == input &&
        transitions[i].stack == stack &&
        transitions[i].outStack == outStack
      )
        return false;
    }

    return true;
  };

  const deleteTransition = (id, iter) => {
    setExample("");
    setElements((els) => {
      const el = els.find((x) => x.id === id);
      if (el.data.transitions.length === 1)
        return els.filter((x) => x.id !== id);

      return [
        ...els.filter((x) => x.id !== id),
        {
          ...el,
          data: {
            ...el.data,
            transitions: el.data.transitions.filter((x, i) => i !== iter),
          },
        },
      ];
    });
  }

  const addTransition = (params, input, stack, outStack) => {
    setExample("");
    setElements((els) => {
      const el = els.find((x) => x.id == `${params.source}-${params.target}`);

      const startNum = els.some(
        (x) => x.id == `${params.target}-${params.source}`
      )
        ? 1
        : 0;
      if (el == undefined) {
        return [
          ...els,
          {
            id: `${params.source}-${params.target}`,
            source: params.source,
            target: params.target,
            type: "mainEdge",
            data: {
              text: `custom edge`,
              source: params.source,
              target: params.target,
              transitions: [
                {
                  input,
                  stack,
                  outStack,
                },
              ],
              num: startNum,
              selected: false,
              selectedTran: -1,
              delete: deleteTransition,
            },
            arrowHeadType: "arrowclosed",
          },
        ];
      }

      if (
        !isUniqueTransition(
          els.find((x) => x === el).data.transitions,
          input,
          stack,
          outStack
        )
      ) {
        return els;
      }

      return [
        ...els.filter((x) => x !== el),
        {
          ...el,
          data: {
            ...el.data,
            transitions: [
              ...el.data.transitions,
              {
                input,
                stack,
                outStack,
              },
            ],
          },
        },
      ];
    });
  };

  const addNode = () => {
    setExample("");
    setElements((els) => {
      const newId = getNodeIndex(els);
      let x = 100;
      let y = 50;
      if (reactInstance) {
        const pos = reactInstance.toObject();
        console.log(pos);
        console.log(pos.position);
        x = (-pos.position[0] / pos.zoom) + 200;
        y = (-pos.position[1] / pos.zoom) + 100;
      }
      return [
        ...els,
        {
          id: `${newId}`,
          type: "mainNode",
          data: {
            label: `${newId + 1}`,
            accepting: false,
            selected: false,
            selectedTran: -1,
            start: newId === 0 ? true : false,
          },
          position: {
            x: x,
            y: y,
          },
        },
      ];
    });
  };

  const removeNode = () => {
    setExample("");
    setElements((els) => {
      if (selectedNode.length === 1 && selectedNode[0].id !== "0") {
        const noNodes = els.filter((x) => x.id !== selectedNode[0].id);
        const transitions = els.filter((x) => x.id.includes("-")).filter((x) => {
          const ids = x.id.split("-");
          if (ids[0] === selectedNode[0].id || ids[1] === selectedNode[0].id) return true;
          return false;
        });
        return noNodes.filter(x => transitions.indexOf(x) === -1);
      }
      return els;
    });
  };

  const removeAllNodes = () => {
    setElements((els) => {
      const el = els.find((x) => x.id === "0");
      return [
        {
          ...el,
          data: {
            ...el.data,
            selected: false,
            selectedTran: -1,
            accepting: false,
          },
        },
      ];
    });
  };

  const deselectAll = () =>
    setElements((els) =>
      els.map((el) => ({
        ...el,
        data: {
          ...el.data,
          selected: false,
          selectedTran: -1,
        },
      }))
    );

  const selectNode = (id) =>
    setElements((els) => {
      const mostEls = els
        .filter((x) => x.id !== id)
        .map((el) => ({
          ...el,
          data: {
            ...el.data,
            selected: false,
            selectedTran: -1,
          },
        }));

      const el = els.find((x) => x.id === id);

      return [
        ...mostEls,
        {
          ...el,
          data: {
            ...el.data,
            selected: true,
          },
        },
      ];
    });

  const selectTransition = (source, tran) =>
    setElements((els) => {
      const id = `${source}-${tran.nextId}`;
      const el = els.find((x) => x.id === id);

      const mostEls = els
        .filter((x) => x.id !== id)
        .map((el) => ({
          ...el,
          data: {
            ...el.data,
            selected: false,
            selectedTran: -1,
          },
        }));

      return [
        ...mostEls,
        {
          ...el,
          data: {
            ...el.data,
            selectedTran: el.data.transitions.findIndex(
              (x) =>
                x.input === tran.input &&
                x.stack === tran.requiredStack &&
                x.outStack === tran.replacedStack
            ),
            transitions: el.data.transitions.map((t) => ({
              ...t,
              selected: t === tran ? true : false,
            })),
            selected: true,
          },
        },
      ];
    });

  const onConnect = (params) => {
    setParams(params);
    setOpen(true);
  };
  const onSelectionChange = (elements) => {
    setSelectedNode(elements);
  };

  

  const buildAutomata = () =>
    setAutomata((a) => {
      a = a.reset();
      const nodes = elements.filter((x) => x.type === "mainNode");
      const edges = elements.filter((x) => x.type === "mainEdge");

      for (var i = 0; i < nodes.length; i++) {
        a = a.addState(new State(nodes[i].id, nodes[i].data.accepting));
      }

      for (var i = 0; i < edges.length; i++) {
        const edge = edges[i];
        for (var j = 0; j < edge.data.transitions.length; j++) {
          const trans = edge.data.transitions[j];
          a = a.addTransition(
            edge.data.source,
            new Transition(
              trans.input,
              trans.stack,
              edge.data.target,
              trans.outStack
            )
          );
        }
      }
      a = a.setInitialId("0");
      return a;
    });

  const checkWord = (chars) => chars.filter(x => x !== "ϵ" && x !== "$");

  const walkAutomata = () => {
    setSuccess("");
    instance.setInputWord(checkWord(inputWord.split("")));
    const result = instance.walkAutomata();
    if (result) setSuccess("Accepted.");
    else setSuccess("Rejected.");
  };

  const resetStep = () => {
    instance.setInputWord(checkWord(inputWord.split("")));
    setSuccess("");
    setInRun(0);
    setRunType(0);
    deselectAll();
    return;
  };

  const clearScreen = () => {
    setConfirmOpen(true);
  }

  const resetAll = () => {
    instance.setInputWord(checkWord(inputWord.split("")));
    setSuccess("");
    setInRun(0);
    setRunType(0);
    setInputWord("");
    removeAllNodes();
    setSelectedNode(null);
    return;
  };

  const exportCurrent = () => {
    var blob = new Blob([JSON.stringify(elements)], {
      type: "application/json;charset=utf-8",
    });
    saveAs(blob, "automata.json");
  };

  const handleFiles = async (files) => {
    setElements(JSON.parse(atob(files.base64.slice(29))));
    await new Promise(r => setTimeout(r, 50));
    setElements(els => [...els]);
    fitView({ padding: 0.8 });
  };

  const onLoad = (i) => {
    addNode();
    i.fitView();
    setReactInstance(i);
    return;
  };

  const onNodeDragStop = (e, n) => {
    setElements((els) => els.map((el) => (el.id === n.id ? n : el)));
  };
  const stepAutomata = () => {
    if (inRun === 0) {
      instance.setInputWord(checkWord(inputWord.split("")));
      setSuccess("");
      setInRun(1);
      selectNode(instance.currentState);
      setRunType(0);
      return;
    }

    let run = runType;
    setRunType((x) => (x === 0 ? 1 : 0));
    let out = instance.doNextStep(runType);

    if (out.end) {
      if (instance.checkAccepted()) setSuccess("Accepted.");
      else setSuccess("Rejected.");
      instance.setInputWord(checkWord(inputWord.split("")));
      setInRun(0);
      setRunType(0);
      deselectAll();
      return;
    }

    if (run === 0) {
      selectTransition(instance.currentState, out.tran);
      return;
    }

    selectNode(out.state);
  };

  const [open, setOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [exampleOpen, setExampleOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const [params, setParams] = useState(null);

  return (
    <>
      <div>
        <NewEdgeForm
          open={open}
          setOpen={setOpen}
          addTransition={addTransition}
          params={params}
        />
        <HelpModal open={helpOpen} setOpen={setHelpOpen} />
        <ExampleModal open={exampleOpen} setOpen={setExampleOpen} />
        <ConfirmModal open={confirmOpen} setOpen={setConfirmOpen} reset={resetAll} />
        <div
          style={{
            display: "flex",
          }}
        >
          <div
            style={{
              flexGrow: 1,
              width: 150,
              alignItems: "center",
              display: "flex"
            }}
          >
            <Button
              variant="contained"
              endIcon={<HelpOutlineIcon />}
              style={{
                margin: 5,
                padding: "10px 30px 10px 30px",
              }}
              onClick={(_) => setHelpOpen(true)}
            >
              Help
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
              marginTop: 10,
              flexGrow: 3,
            }}
          >
            <TitleText style={{fontSize: 40}}>Pushdown Automata Visualiser</TitleText>
            <TitleText>By Joseph Cryer</TitleText>

          </div>
          <div
            style={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              width: 150

            }}
          >
            <IconButton onClick={(e) => setExampleOpen(true)} aria-label="delete" style={{height: 40}}>
              <InfoOutlinedIcon />
            </IconButton>
             <FormControl style={{margin: 10, width: 150}}>
              <InputLabel id="demo-simple-select-label">Examples</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={example}
                label="Examples"
                onChange={(e) => handleExample(e.target.value)}
                >
                <MenuItem value={1}>aⁿbⁿ</MenuItem>
                <MenuItem value={2}>|a| = |b|</MenuItem>
                <MenuItem value={3}>wcw<sup>R</sup></MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 10,
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TitleText style={{fontSize: 20}}> Enter Input Word: </TitleText>
            <div
              style={{
                textAlign: "center",
              }}
            >
              <TextInput
                onChange={(e) => {
                  setInputWord(e.target.value);
                }}
                text={inputWord}
                width={400}
                submit={() => walkAutomata()}
              />
              <TitleText> {success} </TitleText>
            </div>
          </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 5
          }}
        >
          <NewButton onClick={walkAutomata} text="Run" />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <NewButton onClick={addNode} text={"Add State"} />
          <NewButton
            onClick={stepAutomata}
            text={inRun === 1 ? "Step" : "Start Step"}
          />
          <NewButton onClick={resetStep} text={"Restart Step"} />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <NewButton onClick={clearScreen} text={"Clear Screen"} />
          <div
            style={{
              display: "inline-block",
            }}
          >
            <ReactFileReader
              fileTypes={[".json"]}
              multipleFiles={false}
              base64={true}
              handleFiles={handleFiles}
              style={{
                display: "inline-block",
              }}
            >
              <NewButton text={"Import"} />
            </ReactFileReader>
          </div>
          <NewButton onClick={exportCurrent} text={"Export"} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexGrow: 10,
          marginLeft: 10,
          marginTop: 10,
        }}
      >
        <ReactFlow
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          selectNodesOnDrag={false}
          onNodeDoubleClick={onNodeDoubleClick}
          multiSelectionKeyCode={false}
          selectionKeyCode={false}
          onElementsRemove={(x) => removeNode()}
          onNodeDragStop={onNodeDragStop}
          connectionMode={"loose"}
          onLoad={onLoad}
          connectionLineType={ConnectionLineType.Bezier}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          elements={elements}
          defaultZoom={1.3}
          style={{
            height: "100%",
            border: "1px solid black",
            borderRadius: "10px",
          }}
        >
          <Background variant="lines" gap={60} size={2} />
          <MiniMap
            nodeColor={(node) => {
              if (node.id === "0") return "green";
              return "red";
            }}
            nodeStrokeWidth={2}
            nodeBorderRadius={"50%"}
          />
          <Controls />
        </ReactFlow>
        <Stack list={instance.stack}/>
      </div>
      <div
        style={{
          display: "flex",
          flexGrow: 1,
        }}
      >
        
      </div>
    </>
  );
}

export default Graph;
