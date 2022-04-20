import { State, Automata, Transition, Instance } from "./Logic/main";
import { Button, Label, NumberInput, TextInput, Dropdown, TitleText } from "./ui-library";
import { useSpring, animated, a } from 'react-spring'
import React, {useState, useEffect} from 'react';
import Graph from "./Graph";

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

function App() {
  const forceUpdate = useForceUpdate();

  const [automata, setAutomata] = useState(new Automata({}));
  const [instance, setInstance] = useState(new Automata({}));

  const [inputWord, setInputWord] = useState("");

  const [removeStateInput, setRemoveStateInput] = useState(0);

  const [fromStateInput, setFromStateInput] = useState("");
  const [toStateInput, setToStateInput] = useState("");

  const [startStateInput, setStartStateInput] = useState(0);
  const [inputSymbolInput, setInputSymbolInput] = useState("");
  const [stackSymbolInput, setStackSymbolInput] = useState("");
  const [stackSymbolOutput, setStackSymbolOutput] = useState("");

  const [currentId, setCurrentId] = useState(1);
//  console.log(instance);

  useEffect(() => {
    setInstance(i => new Instance(automata));
  }, [automata]);

  const addState = () => {
    if (automata.states.length === 0) { 
      setStartStateInput(currentId); 
      setRemoveStateInput(currentId); 
      setFromStateInput(currentId); 
      setToStateInput(currentId);
    } 
      setAutomata(a => a.addState(new State(currentId, Boolean(false)))); 
      setCurrentId(s => s + 1); 
      forceUpdate();
  }


  const addTransition = (fromState, toState, input, stack, outStack) => {
    setAutomata(a => 
      a.addTransition(
        fromState, 
        new Transition(
          input, 
          stack, 
          toState, 
          outStack
        )
      )
    );
    forceUpdate();
  }

  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={() => { setAutomata(a => a.reset());  forceUpdate();}} text={"Reset"} />

        <Button onClick={addState} text={"Add State"} />

        <Label text="State to be removed">
          <Dropdown value={removeStateInput} onChange={(e) => setRemoveStateInput(Number(e.target.value))} list={automata.states.map((e, i) => ({ name: e.id, id: e.id}) )} />
        </Label>
        <Button onClick={() => {
          setAutomata(a => a.removeState(removeStateInput)); 
          if (automata.states.length > 1) {
            var selId = automata.states.find(x => x.id !== removeStateInput).id;
            setStartStateInput(selId); setRemoveStateInput(selId); setFromStateInput(selId); setToStateInput(selId); 
          }
          forceUpdate();
         }
          } text={"Remove State"} />

        <TitleText>Add Transition</TitleText>
        <Label text="From State">
          <Dropdown value={fromStateInput} onChange={(e) => setFromStateInput(Number(e.target.value))} list={automata.states.map((e, i) => ({ name: e.id, id: e.id}) )} />
        </Label>

        <Label text="To State">
          <Dropdown value={toStateInput} onChange={(e) => setToStateInput(Number(e.target.value))} list={automata.states.map((e, i) => ({ name: e.id, id: e.id}) )} />
        </Label>

        <Label text="Required input symbol(s)">
          <TextInput 
            onChange={(e) => { setInputSymbolInput(e.target.value)}} 
            text={inputSymbolInput} width={50} 
          />
        </Label>

        <Label text="Required stack symbol(s)">
          <TextInput 
            onChange={(e) => { setStackSymbolInput(e.target.value)}} 
            text={stackSymbolInput} width={50} 
          />
        </Label>
        
        <Label text="Replaced stack symbol(s)">
          <TextInput 
            onChange={(e) => { setStackSymbolOutput(e.target.value)}} 
            text={stackSymbolOutput} width={50} 
          />
        </Label>
        <Button onClick={() => {
            setAutomata(a => a.addTransition(fromStateInput, new Transition(inputSymbolInput.split(""), stackSymbolInput.split(""), toStateInput, stackSymbolOutput.split(""))));
            forceUpdate();
        }
          } text={"Add Transition"} />
        <Label text="Initial state">
          <Dropdown value={startStateInput} onChange={(e) => setStartStateInput(Number(e.target.value))} list={automata.states.map((e, i) => ({ name: e.id, id: e.id}) )} />
        </Label>

        <Button onClick={() => {
          setAutomata(a => a.setInitialId(startStateInput)); 
          forceUpdate();
         }
          } text={"Set Start State"} />

          <TitleText>Start State: {automata.initialId}</TitleText>

        <TitleText>States + Transitions:</TitleText>

        {automata.states.map(s => (
          <>
            <TitleText>{s.id} - Accepting: {s.accepting ? "true" : "false"} <Button onClick={() => { setAutomata(a => a.toggleAcceptingState(s)); forceUpdate(); }} text="Toggle Accepting" /></TitleText>

            {s.transitions.map(t => (
              <>
                {s.id} ={">"} {t.nextId} | [{t.input.join(" ")}] | [{t.requiredStack.join(" ")}] | [{t.replacedStack.join(" ")}] 
                <Button onClick={() => { setAutomata(a => a.removeTransition(s, t));  forceUpdate(); }} text="Remove" />
                <br/>
              </>
            ))}
          </>
        ))}

        <Label text="Enter Input Word:">
          <TextInput 
            onChange={(e) => { setInputWord(e.target.value)}} 
            text={inputWord} width={50} 
          />
        </Label>
        <Button onClick={() => {
            setInstance(i => {
              let inst = i.setInputWord(inputWord.split(""));
              inst.walkAutomata();
              return inst;
            });
            forceUpdate();
        }
          } text="Run" />

      </header>
      
      {/*      <NodeAsHandleFlow />
*/}
      <Graph instance={instance} addStateAut={addState} addTransitionAut={addTransition}/>
    </div>
  );
}

export default App;
