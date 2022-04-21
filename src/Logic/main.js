export class Automata {
    constructor({states, inputAlphabet, stackAlphabet, initialId}) {
        this.states = states ?? [];
        this.inputAlphabet = inputAlphabet ?? [];
        this.stackAlphabet = stackAlphabet ?? [];
        this.initialId = initialId ?? -1;
    }

    setInitialId(id) {
        this.initialId = id;
        return this;
    }

    addState(s) {
        if (this.states.some(x => x.id === s.id)) return this;
        this.states = [...this.states, s];
        return this;
    }

    toggleAcceptingState(s) {
        this.states = this.states.map((e) => {
            if (e === s) {
                return e.toggleAccepting();
            }
            else {
                return e;
            }
        });
        return this;
    }

    removeState(id) {
        this.states = this.states.map((e) => e.removeTransitions(id)).filter((e, i) => e.id !== id);
        return this;
    }

    addTransition(stateId, t) {
        this.states = this.states.map(s => s.id === stateId ? s.addTransition(t) : s);
        return this;
    }
    
    removeTransition(state, t) {
        this.states = this.states.map(s => s === state ? s.removeTransition(t) : s);
        return this;
    }

    reset() {
        this.states = [];
        this.inputAlphabet = [];
        this.stackAlphabet = [];
        this.initialId = -1;
        return this;
    }
}

export class State {
    constructor(id, accepting) {
        this.id = id;
        this.accepting = accepting;
        this.transitions = [];
    }

    toggleAccepting() {
        this.accepting = !this.accepting;
        return this;
    }

    addTransition(t) {
        for (var i = 0; i < this.transitions.length; i++) {
            if (this.transitions[i].equals(t)) return this;
        }
        this.transitions = [...this.transitions, t];
        return this;
    }

    removeTransition(t) {
        this.transitions = this.transitions.filter((x) => t !== x);
        return this;
    }

    removeTransitions(id) {
        this.transitions = this.transitions.filter((e) => e.nextId !== id);
        return this;
    }
}

export class Transition {
    constructor(input, requiredStack, nextId, replacedStack) {
        this.input = input; // can be null
        this.requiredStack = requiredStack; // can be null
        this.nextId = nextId;
        this.replacedStack = replacedStack;
    }

    equals(o) {
        if (this.input.length !== o.input.length) return false;
        if (this.requiredStack.length !== o.requiredStack.length) return false;
        if (this.replacedStack.length !== o.replacedStack.length) return false;
        
        for (var i = 0; i < this.input.length; i++) {
            if (this.input[i] !== o.input[i]) return false;
        }

        for (var i = 0; i < this.requiredStack.length; i++) {
            if (this.requiredStack[i] !== o.requiredStack[i]) return false;
        }

        for (var i = 0; i < this.replacedStack.length; i++) {
            if (this.replacedStack[i] !== o.replacedStack[i]) return false;
        }

        if (this.nextId !== o.nextId) return false;

        return true;
    }

    isValid(word, stack) {

        if (word === undefined) word = "";
        if (stack === undefined) stack = "";

        if (word !== this.input && this.input !== "") return false;
        if (stack !== this.requiredStack && this.requiredStack !== "") return false;
        return true;
    }
}

export class Instance {
    constructor(automata) {
        this.automata = automata;
        this.stack = [];
        this.inputWord = [];
        this.currentState = automata.initialId;
        this.numComputations = 0;
    }
    setInputWord(i) {
        this.stack = [];
        this.inputWord = i;
        this.inputWord.push("$");
        this.currentState = this.automata.initialId;
        this.numComputations = 0;
        return this;
    }
    
    stepAutomata() {
        let state;

        if (this.inputWord.length === 0) {
            return true;
        }

        state = this.automata.states.find(x => x.id === this.currentState);

        let tran = state.transitions.find(x => x.isValid(this.inputWord[0], this.stack[0]));
        if (tran === undefined) return true;

        if (tran.input !== undefined && tran.input !== "") this.inputWord.splice(0, 1);
        if (tran.requiredStack !== undefined && tran.requiredStack !== "") this.stack.splice(0, 1);
        if (tran.replacedStack !== undefined && tran.replacedStack !== "") this.stack.unshift(tran.replacedStack.split(""));

        this.stack = this.stack.flat();
        
        this.currentState = tran.nextId;
        return false;
    }

    doNextStep(type) { // 0: transition, 1: state
        this.numComputations++;
        if (this.inputWord.length === 0)  return { end: true, tran: null, state: null }; // return end
        
        let state = this.automata.states.find(x => x.id === this.currentState);
        let tran = state.transitions.find(x => x.isValid(this.inputWord[0], this.stack[0]));
        if (tran === undefined) return { end: true, tran: null, state: null }; // return end
        if (type === 0)  return { end: false, tran: tran, state: null }; // return transition id??

        if (tran.input !== undefined && tran.input !== "") this.inputWord.splice(0, 1);
        if (tran.requiredStack !== undefined && tran.requiredStack !== "") this.stack.splice(0, 1);
        if (tran.replacedStack !== undefined && tran.replacedStack !== "") this.stack.unshift(tran.replacedStack.split(""));

        this.stack = this.stack.flat();
        
        this.currentState = tran.nextId;
        if (this.numComputations > 1000000) return {end: true, tran: null, state: null}; 

        return { end: false, tran: null, state: tran.nextId }; // return state id
    }

    checkAccepted() {
        if ((this.inputWord.length === 0 || (this.inputWord.length === 1 && this.inputWord[0] === "$")) && this.stack.length === 0 && this.automata.states.find(x => x.id === this.currentState).accepting) {
            return true;
        }
        return false;
    }

    walkAutomata() {
        this.currentState = this.automata.initialId;
        while (true) {
            let out = this.stepAutomata();
            this.numComputations++;
            if (out) break;
            if (this.numComputations > 1000000) break; 
        }
        if ((this.inputWord.length === 0 || (this.inputWord.length === 1 && this.inputWord[0] === "$")) && this.stack.length === 0 && this.automata.states.find(x => x.id === this.currentState).accepting) {
            return true;
        }
        return false;
    }
}