import React, {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';

export default function HelpModal({ open, setOpen }) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogContent>
          <Typography variant="h6" component="div">
            About the tool
          </Typography>
          <DialogContentText>
            This tool allows you to build Deterministic Pushdown Automata (DPDA) and test different words against them.
          </DialogContentText>
          <br />
          <DialogContentText>
            For a pushdown automata to be deterministic, there must be only one possible route through the automata for any given word. 
            This visualiser runs for up to a million computations. After that point, the system times out and rejects the input word. 
          </DialogContentText>
          <br />
          <DialogContentText>
            The DPDA terminates when it reaches the end of the tape (i.e. when the entire word has been read). 
            At this point, the given word will then be accepted if the stack is empty and the DPDA is currently in an accepting state. 
            Otherwise, the word will be rejected.
          </DialogContentText>
          <br />
          <DialogContentText>
            There is one universally reserved character: 'ϵ'. This will be stripped out of any entered word. 'ϵ' is used to represent the empty word. 
            If a field is left blank on a transition, the DPDA will not consult the input or the stack, depending on which field is left blank.
          </DialogContentText>
          <br />
          <DialogContentText>
            The character '$' will also be stripped out of any entered <b>input</b> word. This character is appended to the end of every input word.
            This allows us to transition to an accepting state, as we have a known 'end of input' character. 
            If it is not needed, the DPDA will still be allowed to terminate without this character being passed on the tape.
          </DialogContentText>
          <br />
          <DialogContentText>
            Double clicking on the <b>outer section</b> of a state toggles whether that state is an accepting state. <br />
            Click and drag from the centre of one state to the centre of another in order to create a new transition between those two states.<br />
            To setup a new transition from a state to itself, simply click in the centre of a state. <br />
            To delete a transition, hover over it and click on the 'x' button next to it.<br />
            To delete a node, click on it. It should be highlighted purple. Then, press the 'delete' keyboard key. You cannot delete the start node.  
          </DialogContentText>
          <br />
          <DialogContentText>
            When stepping through a DPDA, the bottom right will visualise the stack. 
          </DialogContentText>
          <br />
          <Typography variant="h6" component="div">
            Examples
          </Typography>
          <DialogContentText>
            Three examples have been included with this tool: 
            <br />
            • A DPDA that checks there are a number of a's followed by the same number of b's.
            <br />
            • A DPDA that ensures there is an equal number of  a's and b's.
            <br />
            • A DPDA that accepts any word followed by a 'c' character and then the reverse of the initial word.
          </DialogContentText>
          <br />

          <Typography variant="h6" component="div">
            About me
          </Typography>
          <DialogContentText>
            I'm Joseph Cryer, a third year Computer Science student at the University of Bath. This was built as part of my dissertation project. 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}