import React, { useState, useReducer, useEffect, useMemo, useRef, useContext, createContext } from 'react';
import { 
  AlertTriangle, BookOpen, Brain, Check, ChevronsRight, Loader2, Palette, Trash2, X, 
  Blocks, ClipboardList, Lightbulb, Library, Settings2, Zap, PlugZap, Radio, BrainCircuit, 
  MousePointer, Layers, Waypoints, Sparkles, Home, Square, Wind, Lamp, 
  Droplet, Sprout, Flower, Sun, Moon, Network, GitBranch, MessageSquare, DoorOpen, Triangle,
  Wrench, Thermometer, Ban // Import new icons
} from 'lucide-react';
import { nanoid } from 'nanoid';

// --- 1. GLOBAL STATE (The "Master Blueprint") ---

const HouseStateContext = createContext();
const HouseDispatchContext = createContext();

const generateExplanation = async (userPrompt, systemPrompt, dispatch) => {
  dispatch({ type: 'GENERATION_PENDING' });
  try {
    const response = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userPrompt, systemPrompt }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate explanation');
    }
    const data = await response.json();
    dispatch({ type: 'GENERATION_FULFILLED', payload: { explanation: data.text } });
  } catch (error) {
    dispatch({ type: 'GENERATION_REJECTED', payload: error.message });
  }
};

const initialHouseState = {
  blocks: [], // Our list of "LEGO" blocks
  explanation: '',
  isLoading: false,
  error: null,
};

// The Reducer (manages the Master Blueprint)
function houseReducer(state, action) {
  switch (action.type) {
    case 'ADD_BLOCK': {
      let newBlock = { id: nanoid(), type: action.payload.type, props: {} };
      // Add default props for each new block type
      switch (action.payload.type) {
        case 'WALL':
          newBlock.props = { label: 'Wall', color: 'bg-gray-300' };
          break;
        case 'WINDOW':
          newBlock.props = { label: 'Window', color: 'bg-blue-300' };
          break;
        case 'LAMP':
          newBlock.props = { label: 'Lamp', color: 'bg-gray-700' };
          break;
        case 'DOOR':
          newBlock.props = { label: 'Door', color: 'bg-yellow-800' };
          break;
        case 'ROOF':
          newBlock.props = { label: 'Roof', color: 'bg-red-700' };
          break;
        default:
          break;
      }
      return { ...state, blocks: [...state.blocks, newBlock] };
    }
    case 'UPDATE_BLOCK_PROPS': {
      return {
        ...state,
        blocks: state.blocks.map(b => 
          b.id === action.payload.id 
            ? { ...b, props: { ...b.props, ...action.payload.newProps } }
            : b
        )
      };
    }
    case 'REMOVE_BLOCK': {
      return { ...state, blocks: state.blocks.filter(b => b.id !== action.payload.id) };
    }
    case 'CLEAR_EXPLANATION': {
      return { ...state, explanation: '', error: null };
    }
    case 'GENERATION_PENDING': {
      return { ...state, isLoading: true, explanation: '', error: null };
    }
    case 'GENERATION_FULFILLED': {
      return { ...state, isLoading: false, explanation: action.payload.explanation };
    }
    case 'GENERATION_REJECTED': {
      return { ...state, isLoading: false, error: action.payload };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// The Provider Component
function HouseProvider({ children }) {
  const [state, dispatch] = useReducer(houseReducer, initialHouseState);
  return (
    <HouseStateContext.Provider value={state}>
      <HouseDispatchContext.Provider value={dispatch}>
        {children}
      </HouseDispatchContext.Provider>
    </HouseStateContext.Provider>
  );
}

// Custom Hooks to access the state and dispatch
function useHouseState() { return useContext(HouseStateContext); }
function useHouseDispatch() { return useContext(HouseDispatchContext); }


// --- 2. TUTOR CONTEXT (PAGE-SPECIFIC) ---
// This context is now applied *per page*, not globally.
// This fixes the bug where messages "bleed" between pages.
const TutorContext = createContext();

function TutorProvider({ children }) {
  const [messages, setMessages] = useState([]);
  
  // Encapsulate addMessage in a stable useCallback
  const addMessage = React.useCallback((message) => {
    const newMessage = { id: nanoid(), ...message, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [newMessage, ...prev].slice(0, 10)); // Keep only the last 10 messages
  }, []); // Empty dependency array means this function never changes

  const contextValue = useMemo(() => ({ messages, addMessage }), [messages, addMessage]);

  return (
    <TutorContext.Provider value={contextValue}>
      {children}
    </TutorContext.Provider>
  );
}
function useTutor() { return useContext(TutorContext); }


// --- 3. CONCEPTS.md Data ---
const concepts = [
  { id: 1, title: 'Components', analogy: 'LEGO® blocks', Icon: Blocks },
  { id: 2, title: 'Props', analogy: 'Instructions for a block', Icon: ClipboardList },
  { id: 3, title: 'State (useState)', analogy: 'Block\'s internal memory', Icon: Lightbulb },
  { id: 13, title: 'useContext + useReducer', analogy: 'The Master Blueprint', Icon: Library }, 
  { id: 7, title: 'useReducer', analogy: 'Garden Shed logic', Icon: Settings2 },
  { id: 4, title: 'useEffect', analogy: 'A "Motion Detector"', Icon: Zap },
  { id: 5, title: 'useEffect Cleanup', analogy: 'Unplugging the detector', Icon: PlugZap },
  { id: 6, title: 'useContext', analogy: 'House-Wide Radio', Icon: Radio },
  { id: 8, title: 'useMemo', analogy: 'Preserved Flower', Icon: BrainCircuit },
  { id: 9, title: 'useRef', analogy: 'Garden Shovel (DOM)', Icon: MousePointer }, 
  { id: 11, title: 'Virtual DOM', analogy: 'The *other* blueprint', Icon: Layers, page: 'vdom' },
  { id: 12, title: 'Routing', analogy: 'Pages in the house', Icon: Waypoints },
  // **NEW**: Added "What is a Hook?" concept
  { id: 15, title: 'What is a Hook?', analogy: 'Magical Tool Belt', Icon: Wrench, page: 'hooks-lab' },
  { id: 14, title: 'Gemini API', analogy: 'Your AI Tutor', Icon: Sparkles },
];

// --- 4. REACT COMPONENTS ---

// --- Theme Context (Concept #6) ---
const ThemeContext = createContext();
function useTheme() { return useContext(ThemeContext); }

// --- Reusable UI Components ---
function Button({ onClick, children, className = '', variant = 'primary' }) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'bg-transparent hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400'
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Modal({ children, onClose }) {
  return (
    <div 
      className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// --- NEW: TutorBot & EventLog Components ---
// (Moved here to be globally available)
function TutorBot() {
  const { messages } = useTutor();
  const latestMessage = messages[0]; // Get the most recent message

  if (!latestMessage) {
    return (
      <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg text-center text-gray-600 dark:text-gray-300">
        <BrainCircuit size={48} className="mx-auto text-blue-600" />
        <p className="mt-4 font-semibold">I'm React's Brain!</p>
        <p className="text-sm">Click an action to see what I'm thinking.</p>
      </div>
    );
  }

  // Map concept names to colors
  const conceptColors = {
    "useEffect": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    "useEffect Cleanup": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    "useMemo": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    "useReducer": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    "useRef": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
    "State (useState)": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
    "useContext + useReducer": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100",
    "Props": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
    "State Change": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
    "Diffing": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
    "Patch": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  };
  const color = conceptColors[latestMessage.concept] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";


  return (
    <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg">
      <div className="flex items-center gap-4">
        <BrainCircuit size={48} className="text-blue-600 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tutor Bot Says:</h3>
          <p className="text-xl font-semibold text-blue-700 dark:text-blue-400">{latestMessage.event}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${color}`}>
          Concept: {latestMessage.concept}
        </span>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{latestMessage.explanation}</p>
      </div>
    </div>
  );
}

function EventLog() {
  const { messages } = useTutor();
  const logEl = useRef(null);

  // Auto-scroll to top when new messages arrive
  useEffect(() => {
    if (logEl.current) {
      logEl.current.scrollTop = 0;
    }
  }, [messages]);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-lg font-mono text-xs">
      <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
        <MessageSquare /> Live Event Log
      </h2>
      <div ref={logEl} className="space-y-3 max-h-96 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-gray-400">No events yet...</p>
        )}
        {messages.map(msg => (
          <div key={msg.id}>
            <p className="text-green-300">[{msg.timestamp}] {msg.event}</p>
            <p className="text-gray-300 pl-4">{msg.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


// --- AI Tutor Modal (Concept #14) ---
function AiTutorModal() {
  const dispatch = useHouseDispatch();
  const { explanation, isLoading, error } = useHouseState();

  if (!explanation && !isLoading && !error) return null;

  return (
    <Modal onClose={() => dispatch({ type: 'CLEAR_EXPLANATION' })}>
      <div className="p-6 dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-blue-600" /> AI Tutor
          </h3>
          <button onClick={() => dispatch({ type: 'CLEAR_EXPLANATION' })} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-600 dark:text-gray-300">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <p className="mt-4 text-lg font-semibold">Generating explanation...</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center min-h-[200px] p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-700 dark:text-red-300">
            <AlertTriangle className="text-red-500" size={48} />
            <p className="mt-4 text-lg font-bold">Error</p>
            <p className="text-center">{error}</p>
          </div>
        )}
        {explanation && (
          <div className="prose prose-blue dark:prose-invert max-w-none max-h-[60vh] overflow-y-auto">
            <p className="whitespace-pre-wrap text-base leading-relaxed">{explanation}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}


// --- Prop Editor Modal (Concept #2) ---
function PropEditorModal({ block, onClose }) {
  const dispatch = useHouseDispatch();
  const { addMessage } = useTutor(); // Get the tutor's "microphone"
  const [label, setLabel] = useState(block.props.label || '');
  const [color, setColor] = useState(block.props.color || 'bg-gray-300');
  
  const colorSwatches = [
    'bg-gray-300', 'bg-red-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400', 
    'bg-indigo-400', 'bg-yellow-800', 'bg-red-700'
  ];

  const handleSave = () => {
    dispatch({ type: 'UPDATE_BLOCK_PROPS', payload: { id: block.id, newProps: { label, color } } });
    
    // **NEW**: Explain what just happened
    addMessage({
      concept: "Props",
      event: `✨ Props Changed!`,
      explanation: `You just edited the 'props' for the ${block.type}. React saw the props change and re-rendered *only that one component*!`
    });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-6 dark:bg-gray-800">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Palette className="text-blue-600" /> Edit Props (Instructions)
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">prop: `label` (string)</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">prop: `color` (string)</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {colorSwatches.map(swatch => (
                <button
                  key={swatch}
                  onClick={() => setColor(swatch)}
                  className={`w-10 h-10 rounded-full border-2 ${swatch} ${color === swatch ? 'ring-4 ring-offset-2 ring-blue-500 dark:ring-blue-400' : 'border-gray-200 dark:border-gray-600'}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t dark:border-gray-700">
          <Button onClick={onClose} variant="secondary">Cancel</Button>
          <Button onClick={handleSave} variant="primary">
            <Check size={20} /> Save Props
          </Button>
        </div>
      </div>
    </Modal>
  );
}


// --- "LEGO" Block Components (Concept #1, #2, #3) ---
// **NEW** More realistic-looking components
function Wall({ label, color = 'bg-gray-300', onEdit, onRemove }) {
  return (
    <div 
      className={`relative w-full h-32 ${color} rounded-lg border-2 border-black/20 shadow-inner flex items-center justify-center font-bold text-gray-800 text-lg cursor-pointer group transition-all hover:shadow-lg`}
      onDoubleClick={onEdit}
      title="Double-click to edit props"
    >
      <div className="absolute inset-0 bg-repeat bg-center opacity-10" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 0h10v10H0V0zm10 10h10v10H10V10z'/%3E%3C/g%3E%3C/svg%3E\")"}} />
      <span className="relative z-10">{label}</span>
      <button 
        onClick={onEdit}
        className="absolute top-2 right-10 p-1 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
        title="Edit Props"
      >
        <Palette size={16} />
      </button>
      <button 
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
        title="Remove"
      >
        <Trash2 size={16} className="text-red-600" />
      </button>
    </div>
  );
}

function Window({ label, color = 'bg-blue-300', onEdit, onRemove }) {
  return (
    <div 
      className={`relative w-full h-32 ${color} rounded-lg border-2 border-black/20 shadow-inner flex items-center justify-center font-bold text-gray-800 text-lg cursor-pointer group transition-all hover:shadow-lg p-2`}
      onDoubleClick={onEdit}
      title="Double-click to edit props"
    >
      <div className="w-full h-full bg-blue-100/70 rounded grid grid-cols-2 grid-rows-2 gap-1 p-1">
         <div className="bg-blue-200/50 backdrop-blur-sm rounded-sm"></div>
         <div className="bg-blue-200/50 backdrop-blur-sm rounded-sm"></div>
         <div className="bg-blue-200/50 backdrop-blur-sm rounded-sm"></div>
         <div className="bg-blue-200/50 backdrop-blur-sm rounded-sm"></div>
      </div>
      <span className="absolute bottom-2 z-10 text-sm bg-black/10 px-2 rounded">{label}</span>
      <button 
        onClick={onEdit}
        className="absolute top-2 right-10 p-1 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
        title="Edit Props"
      >
        <Palette size={16} />
      </button>
      <button 
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
        title="Remove"
      >
        <Trash2 size={16} className="text-red-600" />
      </button>
    </div>
  );
}

function LampComponent({ onRemove }) { 
  const { addMessage } = useTutor();
  const [isLit, setIsLit] = useState(false);
  
  const toggleLight = () => {
    setIsLit(prevState => !prevState);
    // **NEW**: Explain what just happened
    addMessage({
      concept: "State (useState)",
      event: `💡 Lamp Toggled ${!isLit ? 'ON' : 'OFF'}!`,
      explanation: `You clicked the lamp! I used 'useState' to manage its *internal memory*. When you clicked, I called 'setIsLit' to update its state, and React re-rendered *only this lamp*!`
    });
  };

  return (
    <div 
      className={`relative w-full h-32 rounded-lg border-2 border-black/20 shadow-inner flex flex-col items-center justify-center gap-2 cursor-pointer group transition-all ${isLit ? 'bg-yellow-200 shadow-yellow-400/50' : 'bg-gray-700'}`}
      onClick={toggleLight}
      title="Click to toggle state (isLit)"
    >
      <Lamp size={40} className={isLit ? 'text-yellow-500' : 'text-gray-400'} />
      <span className={`text-sm font-bold ${isLit ? 'text-gray-800' : 'text-gray-200'}`}>
        State: {isLit ? 'ON' : 'OFF'}
      </span>
      <button 
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute top-2 right-2 p-1 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
        title="Remove"
      >
        <Trash2 size={16} className="text-red-600" />
      </button>
    </div>
  );
}

// **NEW** Door Component
function Door({ label, color = 'bg-yellow-800', onEdit, onRemove }) {
  return (
    <div 
      className={`relative w-full h-32 ${color} rounded-lg border-2 border-black/20 shadow-inner flex items-center justify-center font-bold text-white text-lg cursor-pointer group transition-all hover:shadow-lg p-3`}
      onDoubleClick={onEdit}
      title="Double-click to edit props"
    >
      <div className="w-full h-full bg-black/10 rounded-lg flex items-center justify-center">
        <DoorOpen size={32} />
      </div>
      <span className="absolute bottom-2 z-10 text-sm">{label}</span>
      <button 
        onClick={onEdit}
        className="absolute top-2 right-10 p-1 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
        title="Edit Props"
      >
        <Palette size={16} />
      </button>
      <button 
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
        title="Remove"
      >
        <Trash2 size={16} className="text-red-600" />
      </button>
    </div>
  );
}

// **NEW** Roof Component
function Roof({ label, color = 'bg-red-700', onEdit, onRemove }) {
  return (
    <div 
      className={`relative w-full h-32 ${color} rounded-lg border-2 border-black/20 shadow-inner flex flex-col items-center justify-center font-bold text-white text-lg cursor-pointer group transition-all hover:shadow-lg p-3`}
      onDoubleClick={onEdit}
      title="Double-click to edit props"
    >
      <Triangle className="w-24 h-24 text-white/50 fill-current" />
      <span className="absolute bottom-2 z-10 text-sm">{label}</span>
      <button 
        onClick={onEdit}
        className="absolute top-2 right-10 p-1 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
        title="Edit Props"
      >
        <Palette size={16} />
      </button>
      <button 
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
        title="Remove"
      >
        <Trash2 size={16} className="text-red-600" />
      </button>
    </div>
  );
}


// --- House Page Components ---
function BlockPanel() {
  const dispatch = useHouseDispatch();
  const { addMessage } = useTutor();

  const handleAddBlock = (type) => {
    // 1. Dispatch action to the global "Blueprint"
    dispatch({ type: 'ADD_BLOCK', payload: { type } });
    
    // 2. Explain to the Tutor Bot
    addMessage({
      concept: "useContext + useReducer",
      event: `🧱 Added ${type}!`,
      explanation: `You added a ${type}! I just 'dispatch'ed an "ADD_BLOCK" action to the Master Blueprint (our global state). The blueprint updated, and now the 'House' component will re-render to show the new block.`
    });
  };

  return (
    <div className="w-full lg:w-96 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex-shrink-0">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Blocks /> Building Blocks
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={() => handleAddBlock('ROOF')} className="w-full">
          <Triangle size={20} /> Add Roof
        </Button>
        <Button onClick={() => handleAddBlock('WALL')} className="w-full">
          <Square size={20} /> Add Wall
        </Button>
        <Button onClick={() => handleAddBlock('WINDOW')} className="w-full">
          <Wind size={20} /> Add Window
        </Button>
        <Button onClick={() => handleAddBlock('DOOR')} className="w-full">
          <DoorOpen size={20} /> Add Door
        </Button>
        <Button onClick={() => handleAddBlock('LAMP')} className="w-full">
          <Lamp size={20} /> Add Lamp
        </Button>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
        Click to add a <strong>Component</strong>. This dispatches an action to the <strong>Master Blueprint</strong>.
      </p>
    </div>
  );
}

// **NEW** More realistic House Display
function HouseDisplay() {
  const dispatch = useHouseDispatch();
  const { blocks } = useHouseState();
  const [editingBlock, setEditingBlock] = useState(null);
  
  const houseGrid = blocks.length > 0 ? 'grid grid-cols-2 gap-4' : 'flex';

  return (
    <>
      <div className="flex-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 min-h-[400px]">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Home /> The House (Real DOM)
        </h2>
        <div className={`space-y-4 ${houseGrid} items-center justify-center`}>
          {blocks.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-10">Your house is empty! Add some blocks.</p>
          )}
          {blocks.map(block => {
            const props = {
              key: block.id,
              ...block.props,
              onEdit: () => setEditingBlock(block),
              onRemove: () => dispatch({ type: 'REMOVE_BLOCK', payload: { id: block.id } })
            };
            
            if (block.type === 'ROOF') return <Roof {...props} />;
            if (block.type === 'WALL') return <Wall {...props} />;
            if (block.type === 'WINDOW') return <Window {...props} />;
            if (block.type === 'DOOR') return <Door {...props} />;
            if (block.type === 'LAMP') return <LampComponent {...props} />;
            return null;
          })}
        </div>
      </div>
      
      {editingBlock && (
        <PropEditorModal 
          block={editingBlock}
          onClose={() => setEditingBlock(null)}
        />
      )}
    </>
  );
}


// --- HousePage Layout ---
function HousePage() {
  // This page gets its *own* Tutor Provider, isolating its messages.
  return (
    <TutorProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Controls & Tutor */}
        <div className="space-y-6">
          <BlockPanel />
          <TutorBot />
        </div>
        
        {/* Right Column: House */}
        <div className="space-y-6">
          <HouseDisplay />
          {/* EventLog REMOVED as requested */}
        </div>
      </div>
    </TutorProvider>
  );
}

// --- 4. GARDEN PAGE ---
// (No changes to internal logic, just wrapping in provider)

function gardenReducer(state, action) {
  switch (action.type) {
    case 'PLANT_FLOWER':
      return { ...state, plots: state.plots.map(p => p.id === action.payload.plotId ? { ...p, hasFlower: true, isWatered: false } : p) };
    case 'REMOVE_FLOWER':
      return { ...state, plots: state.plots.map(p => p.id === action.payload.plotId ? { ...p, hasFlower: false, isWatered: false } : p) };
    case 'WATER_ALL':
      return { ...state, plots: state.plots.map(p => p.hasFlower ? { ...p, isWatered: true } : p) };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

const initialGardenState = {
  plots: [
    { id: 1, hasFlower: false, isWatered: false },
    { id: 2, hasFlower: true, isWatered: false },
    { id: 3, hasFlower: false, isWatered: false },
  ]
};

function FlowerPlot({ plot, onPlant, onRemove }) {
  const { id, hasFlower, isWatered } = plot;
  const { addMessage } = useTutor(); 

  useEffect(() => {
    let timerId;
    if (hasFlower) {
      addMessage({
        concept: "useEffect",
        event: `🌸 Flower ${id} Planted!`,
        explanation: `My "motion detector" (useEffect) saw [hasFlower] change to 'true'. I'm now running this side effect to start a 3-second timer.`
      });
      timerId = setInterval(() => {
        addMessage({
          concept: "useEffect",
          event: `☀️ Sun shines on flower ${id}`,
          explanation: `The timer I set with 'useEffect' just fired!`
        });
      }, 3000);
    }
    return () => {
      if (timerId) {
        clearInterval(timerId);
        addMessage({
          concept: "useEffect Cleanup",
          event: `🔌 Flower ${id} Removed.`,
          explanation: `You removed the flower! My 'cleanup function' just ran to stop the timer. This prevents memory leaks!`
        });
      }
    };
  }, [hasFlower, id, addMessage]); 

  return (
    <div className={`p-4 rounded-lg shadow-inner ${isWatered ? 'bg-blue-200' : 'bg-yellow-800/60'}`}>
      <div className="text-4xl text-center mb-2 h-10 flex items-center justify-center">
        {hasFlower ? (isWatered ? <Droplet className="text-blue-600" /> : <Flower className="text-pink-500" />) : <Sprout className="text-green-700" />}
      </div>
      <p className="text-center font-semibold text-gray-900 dark:text-gray-800">{hasFlower ? `Plot ${id} (Flower)` : `Plot ${id} (Empty)`}</p>
      {hasFlower ? (
        <Button onClick={onRemove} variant="secondary" className="w-full mt-2">Remove</Button>
      ) : (
        <Button onClick={onPlant} variant="primary" className="w-full mt-2">Plant</Button>
      )}
    </div>
  );
}

function GardenStats({ plots }) {
  const { addMessage } = useTutor(); 
  const { theme } = useTheme(); 
  const isFirstRender = useRef(true);
  const isFirstCalc = useRef(true);

  const calculateFlowerCount = (plots) => {
    console.log("...Recalculating flower count (this is slow!)...");
    return plots.filter(p => p.hasFlower).length;
  };

  const flowerCount = useMemo(() => calculateFlowerCount(plots), [plots]);

  useEffect(() => {
    if (isFirstCalc.current) {
      isFirstCalc.current = false;
      return;
    }
    addMessage({
      concept: "useMemo",
      event: `🧠 Recalculating flower count...`,
      explanation: `This "slow" calculation ran because the [plots] array changed. 'useMemo' re-ran its function.`
    });
  }, [flowerCount, addMessage]); 

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    addMessage({
      concept: "useMemo",
      event: `🎨 Theme Changed!`,
      explanation: `The whole 'GardenStats' component re-rendered, but "Recalculating..." did NOT appear. 'useMemo' provided the saved value!`
    });
  }, [theme, addMessage]); 

  return (
    <div className="p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg mt-6">
      <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white"><Flower /> Garden Stats (useMemo)</h3>
      <p className="dark:text-gray-300">Total Flowers: <strong>{flowerCount}</strong></p>
      <p className="text-xs text-gray-600 dark:text-gray-400">Toggle the light/dark theme. See? The count doesn't recalculate!</p>
    </div>
  );
}

function GardenPage() {
  const [gardenState, dispatch] = useReducer(gardenReducer, initialGardenState);
  const firstPlotRef = useRef(null);
  
  // This page gets its *own* Tutor Provider
  return (
    <TutorProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: The Garden UI */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 dark:text-white"><Sprout /> The Garden (useReducer)</h2>
            <p className="text-gray-600 dark:text-gray-400">This page is managed by `useReducer`, not the Master Blueprint!</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {/* We need to get addMessage *from the context* */}
            <TutorContext.Consumer>
              {({ addMessage }) => (
                <>
                  <Button onClick={() => {
                    dispatch({ type: 'WATER_ALL' });
                    addMessage({
                      concept: "useReducer",
                      event: "💧 Watering all plants!",
                      explanation: "I just `dispatch`ed an 'WATER_ALL' action to the `gardenReducer`. It will handle the logic to update all plots with flowers."
                    });
                  }} variant="primary">
                    <Droplet size={20} /> Water All Flowers
                  </Button>
                  
                  <Button onClick={() => {
                    if (firstPlotRef.current) {
                      firstPlotRef.current.focus();
                      addMessage({
                        concept: "useRef",
                        event: "🔎 Plot 1 Focused!",
                        explanation: "I just used `useRef` to get a direct link to the Plot 1 DOM element and called `.focus()` on it. No re-renders needed!"
                      });
                    }
                  }} variant="secondary">
                    <MousePointer size={20} /> Focus Shovel (useRef)
                  </Button>
                </>
              )}
            </TutorContext.Consumer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gardenState.plots.map((plot, index) => (
              <div 
                key={plot.id} 
                ref={index === 0 ? firstPlotRef : null} 
                tabIndex={-1} 
                className="rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500"
              >
                <FlowerPlot
                  plot={plot}
                  onPlant={() => dispatch({ type: 'PLANT_FLOWER', payload: { plotId: plot.id } })}
                  onRemove={() => dispatch({ type: 'REMOVE_FLOWER', payload: { plotId: plot.id } })}
                />
              </div>
            ))}
          </div>
          <GardenStats plots={gardenState.plots} />
        </div>

        {/* Right Column: The NEW Tutor Bot & Log */}
        <div className="space-y-6">
          <TutorBot />
          <EventLog />
        </div>
      </div>
    </TutorProvider>
  );
}


// --- 5. VIRTUAL DOM LAB PAGE ---

function VDomNode({ label, value, diffValue, isDiffing, depth = 0 }) {
  const hasChanged = value !== diffValue;
  const isString = typeof value === 'string';
  
  let bgColor = 'bg-white/70 dark:bg-gray-800/70';
  let pulseClass = '';

  if (isDiffing) {
    bgColor = hasChanged 
      ? 'bg-red-200 dark:bg-red-900/50' 
      : 'bg-green-200 dark:bg-green-900/50';
    pulseClass = hasChanged ? 'animate-pulse' : '';
  }

  return (
    <div className={`pl-4 ${pulseClass}`}>
      <div className={`flex items-center space-x-2 p-2 rounded-lg border border-gray-300 dark:border-gray-700 ${bgColor} transition-colors`}>
        <span className="font-mono text-sm text-blue-600 dark:text-blue-400">{`<${label}>`}</span>
        {!isString && <span className="font-mono text-sm text-gray-500 dark:text-gray-400">{`{...}`}</span>}
        {isString && <span className="font-mono text-sm text-pink-600 dark:text-pink-400">{`"${value}"`}</span>}
        <span className="font-mono text-sm text-blue-600 dark:text-blue-400">{`</${label}>`}</span>
      </div>
    </div>
  );
}

function VirtualDomLabContent() { // Renamed to avoid conflict with provider
  const { addMessage } = useTutor();
  const [uiState, setUiState] = useState({ text: 'Hello', color: 'bg-blue-500' });
  const [previousState, setPreviousState] = useState(uiState);
  const [diffPhase, setDiffPhase] = useState('idle'); 
  const realDomRef = useRef(null);

  const handleUpdate = (newProps) => {
    addMessage({
      concept: "State Change",
      event: `⚛️ State is changing!`,
      explanation: `You clicked a button! This called 'setUiState' to request a UI update.`
    });
    setPreviousState(uiState); 
    setUiState(newProps);       
    setDiffPhase('diffing');  
  };

  useEffect(() => {
    let diffTimer, patchTimer;
    if (diffPhase === 'diffing') {
      addMessage({
        concept: "Diffing",
        event: `🤔 Diffing VDOM trees...`,
        explanation: `React is comparing the "New VDOM" to the "Previous VDOM" to see what changed.`
      });
      diffTimer = setTimeout(() => {
        setDiffPhase('patching');
      }, 1500); 
    } 
    else if (diffPhase === 'patching') {
      const changes = [];
      if (uiState.text !== previousState.text) changes.push('`text`');
      if (uiState.color !== previousState.color) changes.push('`color`');

      addMessage({
        concept: "Patch",
        event: `✅ Change found! Patching...`,
        explanation: `A difference was found in ${changes.join(' and ')}! React is now updating *only that part* of the Real DOM.`
      });
      
      realDomRef.current?.classList.add('animate-pulse', 'ring-4', 'ring-green-500');

      patchTimer = setTimeout(() => {
        setDiffPhase('idle');
        realDomRef.current?.classList.remove('animate-pulse', 'ring-4', 'ring-green-500');
        addMessage({
          concept: "Patch",
          event: `✨ Patch complete!`,
          explanation: `The Real DOM is updated. The "New VDOM" now becomes the "Previous VDOM" for the next update.`
        });
      }, 1000); 
    }
    return () => {
      clearTimeout(diffTimer);
      clearTimeout(patchTimer);
      realDomRef.current?.classList.remove('animate-pulse', 'ring-4', 'ring-green-500');
    };
  }, [diffPhase, addMessage, uiState, previousState]);

  const buildTree = (props, diffProps, isDiffing) => (
    <div className="space-y-2">
      <VDomNode label="div" value={{}} diffValue={{}} isDiffing={isDiffing} />
      <div className="ml-4 pl-4 border-l-2 border-gray-300 dark:border-gray-700 space-y-2">
        <VDomNode label="h2" value={props.text} diffValue={diffProps.text} isDiffing={isDiffing} />
        <VDomNode label="div" value={props.color} diffValue={diffProps.color} isDiffing={isDiffing} />
      </div>
    </div>
  );

  return (
    // **NEW LAYOUT**: As requested
    <div className="flex flex-col gap-6">

      {/* --- TOP ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Control */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 dark:text-white"><Layers /> The Virtual DOM Lab</h2>
            <p className="text-gray-600 dark:text-gray-400">See how React's "diffing" algorithm works.</p>
          </div>
          <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold mb-4 dark:text-white">1. Change State</h3>
            <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">Click a button to change the state. This will create a new Virtual DOM tree.</p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => handleUpdate({ text: 'Goodbye!', color: uiState.color })}>
                Change Text
              </Button>
              <Button onClick={() => handleUpdate({ text: uiState.text, color: 'bg-red-500' })} variant="secondary">
                Change Color
              </Button>
              <Button onClick={() => handleUpdate({ text: 'Hello', color: 'bg-blue-500' })} variant="secondary">
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Tutor Bot (MOVED) */}
        <div className="space-y-6">
           <TutorBot />
        </div>
      </div>

      {/* --- BOTTOM ROW (MOVED) --- */}
      <div className="space-y-6">
        <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold mb-4 dark:text-white">2. Visualization</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Previous VDOM */}
            <div>
              <h4 className="font-semibold text-center mb-2 dark:text-gray-200">Previous VDOM</h4>
              <div className="p-4 bg-gray-200 dark:bg-gray-900 rounded-lg min-h-[150px]">
                {buildTree(previousState, uiState, diffPhase === 'diffing')}
              </div>
            </div>
            {/* New VDOM */}
            <div>
              <h4 className="font-semibold text-center mb-2 dark:text-gray-200">New VDOM</h4>
              <div className="p-4 bg-gray-200 dark:bg-gray-900 rounded-lg min-h-[150px]">
                {buildTree(uiState, previousState, diffPhase === 'diffing')}
              </div>
            </div>
            {/* Real DOM */}
            <div>
              <h4 className="font-semibold text-center mb-2 dark:text-gray-200">The "Real" DOM</h4>
              <div className="p-4 bg-gray-200 dark:bg-gray-900 rounded-lg min-h-[150px] flex items-center justify-center">
                <div 
                  ref={realDomRef}
                  className={`w-40 h-24 rounded-lg shadow-lg flex items-center justify-center font-bold text-white transition-all duration-300 ${uiState.color}`}
                >
                  {uiState.text}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* EventLog component is REMOVED from VDOM page */}
      </div>

    </div>
  );
}

// **NEW** Wrapper to provide page-specific context
function VirtualDomLab() {
  return (
    <TutorProvider>
      <VirtualDomLabContent />
    </TutorProvider>
  );
}

// --- 6. **NEW**: HOOKS LAB PAGE ---

function HooksLabContent() {
  const { addMessage } = useTutor();
  const [hasUseState, setHasUseState] = useState(false);
  const [temperature, setTemperature] = useState(20);

  // --- Drag and Drop Logic ---
  const handleDragStart = (e, hookName) => {
    e.dataTransfer.setData("hookName", hookName);
    // You can't style the ghost, but you can make it semi-transparent
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleGoodDrop = (e) => {
    e.preventDefault();
    const hookName = e.dataTransfer.getData("hookName");
    if (hookName === 'useState') {
      setHasUseState(true);
      addMessage({
        concept: "Rules of Hooks",
        event: "✅ Hook Added Correctly!",
        explanation: "Great job! You've 'hooked' in `useState` at the top level of the component. This follows the #1 Rule of Hooks. React now knows to give this component 'memory' every time it renders."
      });
    }
  };

  const handleBadDrop = (e) => {
    e.preventDefault();
    const hookName = e.dataTransfer.getData("hookName");
    addMessage({
      concept: "Rules of Hooks",
      event: "❌ Whoops! Can't add a Hook here!",
      explanation: `React Hooks *must* be called in the exact same order every render. By putting ${hookName} inside an 'if' block, you'd be breaking that rule! React wouldn't know if the hook exists or not on the next render.`
    });
  };

  // --- Components for this page ---
  
  const ToolBelt = () => (
    <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Wrench /> React's Tool Belt
      </h3>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Drag a "Hook" (a tool) onto the component blueprint to give it super-powers!</p>
      
      <div 
        draggable
        onDragStart={(e) => handleDragStart(e, 'useState')}
        onDragEnd={handleDragEnd}
        className={`flex items-center gap-3 p-4 rounded-lg bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200 cursor-grab ${hasUseState ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
        title={hasUseState ? "Already added!" : "Drag me! (useState)"}
      >
        <Lightbulb size={24} />
        <div>
          <strong className="font-bold">useState</strong>
          <p className="text-sm">Gives your component "Memory".</p>
        </div>
      </div>
      
      <div 
        draggable
        onDragStart={(e) => handleDragStart(e, 'useEffect')}
        onDragEnd={handleDragEnd}
        className="flex items-center gap-3 p-4 rounded-lg bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 cursor-grab hover:shadow-lg mt-4"
        title="Drag me! (useEffect)"
      >
        <Zap size={24} />
        <div>
          <strong className="font-bold">useEffect</strong>
          <p className="text-sm">Gives your component "Sensors".</p>
        </div>
      </div>
    </div>
  );

  const CodeEditor = () => (
    <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-lg font-mono text-sm">
      <h3 className="text-lg font-bold text-green-400 mb-4">// WeatherStation.jsx</h3>
      <p className="text-blue-400">function <span className="text-yellow-300">WeatherStation</span>() {`{`}</p>
      
      {/* --- Good Drop Zone --- */}
      <div 
        onDragOver={handleDragOver}
        onDrop={handleGoodDrop}
        className={`ml-4 my-2 p-3 rounded-lg border-2 border-dashed transition-colors ${hasUseState ? 'border-green-500 bg-green-900/50' : 'border-gray-500 hover:border-green-400 hover:bg-gray-800'}`}
      >
        {hasUseState ? (
          <p className="text-white">
            <span className="text-purple-400">const</span> [<span className="text-blue-300">temp</span>, <span className="text-yellow-300">setTemp</span>] = <span className="text-yellow-300">useState</span>(<span className="text-orange-400">20</span>);
          </p>
        ) : (
          <p className="text-gray-400">... Drop `useState` here (Top Level) ...</p>
        )}
      </div>
      
      <p className="ml-4 text-gray-500">// (Some other code...)</p>
      
      {/* --- FIX: Corrected mismatched <p> and <span> tags --- */}
      <p className="ml-4"><span className="text-purple-400">if</span> (<span className="text-blue-300">temp</span> &gt; <span className="text-orange-400">30</span>) {`{`}</p>
      
      {/* --- Bad Drop Zone --- */}
      <div 
        onDragOver={handleDragOver}
        onDrop={handleBadDrop}
        className="ml-8 my-2 p-3 rounded-lg border-2 border-dashed border-red-500/50 hover:border-red-400 hover:bg-red-900/30 transition-colors"
      >
        <p className="text-red-400/70 flex items-center gap-2"><Ban size={16} /> ... DON'T drop a Hook here! ...</p>
      </div>
      
      <p className="ml-4">{`}`}</p>
      <p className="ml-4 text-purple-400">return</p>
      <p className="ml-8 text-gray-500">{`(`} ... (see Live Preview) ... {`)`}</p>
      <p>{`}`}</p>
    </div>
  );

  const LivePreview = () => (
    <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Sparkles /> Live Preview
      </h3>
      <div className="flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {!hasUseState ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <Thermometer size={48} className="mx-auto" />
            <p className="mt-2 font-bold">Weather Station</p>
            <p className="text-sm">This component has no "Memory" yet. Drag `useState` into its blueprint!</p>
          </div>
        ) : (
          <div className="text-center text-gray-900 dark:text-gray-100">
            <Thermometer size={48} className="mx-auto text-blue-600" />
            <p className="mt-2 font-bold">Weather Station</p>
            <p className="text-3xl font-bold my-2">{temperature}°C</p>
            <div className="flex gap-2">
              <Button onClick={() => setTemperature(t => t + 1)} variant="secondary">+</Button>
              <Button onClick={() => setTemperature(t => t - 1)} variant="secondary">-</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <ToolBelt />
      </div>
      <div className="lg:col-span-2 space-y-6">
        <CodeEditor />
        <LivePreview />
        <TutorBot />
      </div>
    </div>
  );
}

// **NEW** Wrapper to provide page-specific context
function HooksLabPage() {
  return (
    <TutorProvider>
      <HooksLabContent />
    </TutorProvider>
  );
}


// --- 8. Main App Component ---
function MasterBlueprint() {
  // **FIX**: Moved useHouseState here to fix selector warning
  const globalState = useHouseState(); 
  
  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-lg font-mono text-xs">
      <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
        <GitBranch /> The "Master Blueprint"
      </h2>
      <pre className="whitespace-pre-wrap break-all max-h-96 overflow-y-auto">
        {JSON.stringify(globalState, null, 2)}
      </pre>
      <p className="text-green-300/70 text-xs mt-4">
        This shows the <strong>entire</strong> global state, now managed by `useReducer` and `useContext`.
      </p>
    </div>
  );
}

function App() {
  const houseDispatch = useHouseDispatch();
  const [page, setPage] = useState('house'); 
  const { theme, setTheme } = useTheme(); // Get theme from context
  
  // **NEW**: State for our routing "toast" notification
  const [routingToast, setRoutingToast] = useState(null);
  const isAppFirstRender = useRef(true);

  // **NEW**: useEffect to show the routing toast when 'page' changes
  useEffect(() => {
    if (isAppFirstRender.current) {
      isAppFirstRender.current = false;
      return; // Don't show toast on initial load
    }

    // Determine the component name for the message
    let pageName = page.charAt(0).toUpperCase() + page.slice(1);
    if (page === 'vdom') pageName = 'VirtualDomLab';
    if (page === 'house') pageName = 'HousePage';
    if (page === 'garden') pageName = 'GardenPage';
    if (page === 'hooks-lab') pageName = 'HooksLabPage'; // **NEW**


    // Set the toast message
    setRoutingToast({
      title: 'React is Routing!',
      message: `The 'page' state just changed to "${page}". React's "Router" (our state) is now rendering the <${pageName}> component.`
    });

    // Hide the toast after 3.5 seconds
    const timer = setTimeout(() => {
      setRoutingToast(null);
    }, 3500);

    // Cleanup the timer if the component unmounts or 'page' changes again
    return () => clearTimeout(timer);
  }, [page]); // This effect runs *only* when the 'page' state changes

  const handleConceptClick = (concept) => {
    if (concept.page) {
      setPage(concept.page);
    }
    
    const userPrompt = `Explain the React concept "${concept.title}" like I'm a 10-year-old. Use the analogy of "${concept.analogy}". Keep it simple and clear.`;
    const systemPrompt = "You are an AI Tutor who explains complex React concepts to a complete beginner (a kid). You are friendly, encouraging, and use simple analogies. Do not use code blocks, just explain the concept.";
    
    generateExplanation(userPrompt, systemPrompt, houseDispatch);
  };
  
  const themeClasses = theme === 'light' 
    ? 'bg-gray-100 text-gray-900' 
    : 'bg-gray-900 text-gray-100';
    
  const mainAppClasses = `min-h-screen transition-colors duration-300 ${themeClasses} ${theme === 'dark' ? 'dark' : ''}`;

  return (
    <div className={mainAppClasses}>
      
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md sticky top-0 z-20 border-b border-gray-200/50 dark:border-gray-700/50">
        <nav className="container mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-blue-600">
            <BookOpen className="inline-block -mt-1 mr-2" />
            React Lair
          </h1>
          <div className="flex items-center gap-4">
            <Button onClick={() => setPage('house')} variant={page === 'house' ? 'primary' : 'ghost'}>
              <Home size={20} /> House (Blueprint)
            </Button>
            <Button onClick={() => setPage('garden')} variant={page === 'garden' ? 'primary' : 'ghost'}>
              <Sprout size={20} /> Garden (useReducer)
            </Button>
            <Button onClick={() => setPage('vdom')} variant={page === 'vdom' ? 'primary' : 'ghost'}>
              <Layers size={20} /> VDOM Lab
            </Button>
            {/* **NEW** Hooks Lab Button */}
            <Button onClick={() => setPage('hooks-lab')} variant={page === 'hooks-lab' ? 'primary' : 'ghost'}>
              <Wrench size={20} /> Hooks Lab
            </Button>
            <button
              onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              title="Toggle Theme (useContext)"
            >
              {theme === 'light' ? <Moon /> : <Sun />}
            </button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto p-6">
        <div className="flex flex-col xl:flex-row gap-6">

          {/* --- Left Panel: Concepts & AI --- */}
          <div className="w-full xl:w-[400px] flex-shrink-0 space-y-6">
            <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Brain /> React Concepts
              </h2>
              <div className="flex flex-wrap gap-2">
                {concepts.map(concept => (
                  <button
                    key={concept.id}
                    onClick={() => handleConceptClick(concept)}
                    title={`Click to learn about ${concept.title}`}
                    className="px-3 py-2 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 transition-all text-sm flex items-center gap-2"
                  >
                    <concept.Icon size={16} /> {concept.title}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">Click any concept to ask the <strong>AI Tutor (Gemini)</strong> for an explanation!</p>
            </div>

            {/* --- Blueprint Panel (Concept #13) --- */}
            <MasterBlueprint />
          </div>

          {/* --- Center Panel: The "World" --- */}
          <div className="flex-1">
            {/* CONCEPT #12: Simple "Router" */}
            {page === 'house' && <HousePage />}
            {page === 'garden' && <GardenPage />}
            {page === 'vdom' && <VirtualDomLab />}
            {page === 'hooks-lab' && <HooksLabPage />} {/* **NEW** */}
          </div>

        </div>
      </main>

      {/* **NEW**: Render the routing toast notification */}
      {/* We add a style tag here to define a simple fade-in/out animation */}
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(20px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(20px); }
        }
        .toast-animate {
          animation: fadeInOut 3.5s ease-in-out;
        }
      `}</style>
      {routingToast && (
        <div 
          className="fixed bottom-6 right-6 z-50 max-w-sm bg-green-600 text-white p-4 rounded-lg shadow-xl toast-animate"
        >
          <div className="flex items-center gap-3">
            <Waypoints size={24} className="flex-shrink-0" />
            <div>
              <h4 className="font-bold">{routingToast.title}</h4>
              <p className="text-sm mt-1">{routingToast.message}</p>
            </div>
          </div>
        </div>
      )}

      <AiTutorModal />
    </div>
  );
}

// --- 9. The New Default Export ---
// **FIX**: Moved TutorProvider to be page-specific
// **FIX**: Added ThemeProvider here
function AppWrapper() {
  // Manages light/dark mode
  const [theme, setTheme] = useState('light');
  const themeContextValue = useMemo(() => ({ theme, setTheme }), [theme]);
  
  return (
    <ThemeContext.Provider value={themeContextValue}>
      {/* The "Master Blueprint" Provider (Global) */}
      <HouseProvider>
        <App />
      </HouseProvider>
    </ThemeContext.Provider>
  );
}

export default AppWrapper;