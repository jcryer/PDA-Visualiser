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
        if (word.length < this.input.length) return false;
        if (stack.length < this.requiredStack.length) return false;

        for (var i = 0; i < this.input.length; i++) {
            if (word[i] !== this.input[i]) return false;
        }

        for (var i = 0; i < this.requiredStack.length; i++) {
            if (stack[i] !== this.requiredStack[i]) return false;
        }

        
        // if (word[0] !== this.input[0]) {
        //     return false;
        // }

        //if (this.requiredStack.length === 0) return true;
        
        // if (stack[0] !== this.requiredStack[0]) {
        //     return false;
        // }

        return true;
    }
}

export class Instance {
    constructor(automata) {
        this.automata = automata;
        this.stack = [];
        this.inputWord = [];
        this.currentState = automata.initialId;
    }
    setInputWord(i) {
        this.stack = [];
        this.inputWord = i;
        this.currentState = this.automata.initialId;
        return this;
    }

    stepAutomata() {
        let state;

        if (this.inputWord.length === 0) {
            return true;
        }

        console.log("Current State: " + this.currentState);
        console.log("Current Stack: [" + this.stack.join(", ") + "]");
        state = this.automata.states.find(x => x.id === this.currentState);
        //console.log(state);

        let tran = state.transitions.find(x => x.isValid(this.inputWord,this.stack));
        if (tran === undefined) return true;
        //console.log(tran);

        
        this.inputWord.splice(0, tran.input.length);
        this.stack.splice(0, tran.requiredStack.length);


        this.stack.unshift(tran.replacedStack);
        this.stack = this.stack.flat();
        
        this.currentState = tran.nextId;
        return false;
    }

    walkAutomata() {
        this.currentState = this.automata.initialId;
        console.log("==========");
        //let state;
        while (true) {
            let out = this.stepAutomata();
            if (out) break;
        }
        console.log("Current State: " + this.currentState);
        console.log("Current Stack: [" + this.stack.join(", ") + "]");

        if (this.inputWord.length === 0 && this.automata.states.find(x => x.id === this.currentState).accepting) {
            console.log("Pass!");
            return true;
        }
        console.log("Fail");
        return false;
    }
}