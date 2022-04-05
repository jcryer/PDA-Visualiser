import { Handle } from 'react-flow-renderer';

function MainHandle() {
    return (
        <Handle
        isValidConnection={(connection) => true}
        onConnect={(params) => console.log('handle onConnect', params)}
        style={{ height: 30, width: 30, top: 9, color: 'grey', opacity: 0.2, zIndex: 3 }}
    />
    );
}
export default MainHandle;
