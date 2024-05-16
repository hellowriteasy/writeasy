import {create} from "zustand";


interface FunctionState {
  correctedData: string;
  pdfExportFunction: (() => void) | null;
  copyToClipboardFunction: (() => void) | null;
  setCopyToClipboardFuntion: (func: (() => void) | null) => void;
  setPdfExportFunction: (func: (() => void) | null) => void;
}


// Create a Zustand store
const usePdfStore = create<FunctionState>((set) => ({
  correctedData:"",
  pdfExportFunction: null,
  copyToClipboardFunction: null,
  setPdfExportFunction: (func) => set({ pdfExportFunction: func }),
  setCopyToClipboardFuntion: (func) => set({ pdfExportFunction: func }),
}));



export default usePdfStore
