import { useEditorStore } from "./src/hooks/useEditorStore.ts"; 
const store = useEditorStore.getState();
console.log("Document state:", JSON.stringify(store.document, null, 2));
