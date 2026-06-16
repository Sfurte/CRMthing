# Architecture Overview

 This document describes the actual architecture of the drag-and-drop page builder.

 ## Component Tree

 ```mermaid
graph TD
    App["<App> (DndContext)"] --> Header["<Header>\nНазад / Dashboard"]
    App --> MainLayout["flex row"]
    MainLayout --> LeftPanel["<LeftPanel>\n¡войства (359px)"]
    MainLayout --> RightColumn["flex column"]
    RightColumn --> Toolbar["<Toolbar>\nМобоавить компонент · Layout · Данные · Desktop · 100%"]
    RightColumn --> CanvasArea["<Canvas>\n#F0F7FF container, 1px border"]
    CanvasArea --> WorldContainer["panned/zoomed\ntranslate() scale()"]
    WorldContainer --> Artboard["1440x900 white\ndashed blue border\noverflow hidden"]
    Artboard --> DraggableElements["<DraggableElement>\nfor each element in state"]
    DraggableElements --> ElementRenderer["Renderer from\nElementRenderers[type]"]
    Toolbar --> AddDropdown["Добавить компонент ↓\nInput, Button, Table, Card"]
    Toolbar --> ZoomControl["100% ↓\nclick opens input"]
    App --> CanvasTransform["useCanvasTransform()\npan · zoom · space"]
    App --> Store["Zustand store\nelements[], selectedId, zoom"]
    Store -.=>|"reads"| LeftPanel
    Store -.->|"reads"| CanvasArea
    Store -.=>|"reads/writes"| Toolbar
    style Store fill:#f9f0ff,stroke:#333
    style Artboard fill:#fff,stroke:#3B82F6,stroke-dasharray:3
```

 ## Data Flow

 ### Adding an Element
1. User clicks "Добавить компонент" in the toolbar
2. Dropdown opens with available types (from elements/registry.js)
3. User clicks a type -> addElement(type, 200, 200) dispatched to Zustand store
4. Store appends { id: el-N, type, x, y } to elements[]
5. Canvas re-renders -> new DraggableElement appears on the artboard

### Dragging a Placed Element
1. DraggableElement registers with @nnd-kit via useDraggable
2. On drag, App.handleDragMove updates position through setElementPosition
3. On drag end with minimal delta: triggers selection instead
4. On drag end over canvas with data.type: creates a new element (from palette)

### Selecting an Element
1. Click on an element -> selectElement(id) in store
2. LeftPanel reads selectedId, finds the element, displays: type, id, PosX, PosY
3. Changing inputs -> setElementPosition(id, x, y)
4. Clicking empty canvas space -> selectElement(null) deselects

### Zoom and Pan
- Scroll wheel: zooms toward cursor (0.2x to 5x)
- Middle mouse button or Space+click+drag: pans the canvas
- Toolbar shows current %, click opens input for custom value
- Zoom stored in Zustand store, synced bidirectionally with canvas hook

## Folder Structure

 ```
src/
  └ App.jsx        root: DndContext, layout, drag handlers
  └ main.jsx         Vite entry point
  └ index.css        global styles, Inter font, focus ring
  └ store.js         Zustand store (elements, selectedId, zoom)
  └  components/
  ─  └ Header.jsx       top bar: back arrow, Назад, Dashboard
  ─   └  Toolbar.jsx      filter bar: dropdowns, zoom
  ─  └ LeftPanel.jsx    properties inspector (359px): PosX/PosY
  ─   └  Canvas.jsx       canvas wrapper (#F0F7FF bg, 1px border)
  ─  └ DraggableElement.jsx  useDraggable wrapper, click-to-select
  └  elements/
  ─  └ input.jsx        placeholder (gray dashed box)
  ─  └ button.jsx       placeholder (gray dashed box)
  ─  └ table.jsx        placeholder (gray dashed box)
  ─  └ card.jsx         real component (styled card)
  ─  └ registry.js       imports all, exports ElementRenderers, ELEMENT_TYPES
  └° hooks/
    └ useCanvasTransform.js  zoom/pan logic, space key, wheel
```

## Key Design Decisions

### Elements as Full React Components
Each element lives in elements/*.jsx and exports:
- A default export: the React component to render on canvas
- A named export "definition": { type, label } for the toolbar

To add a new element:
1. Create elements/mything.jsx with a component and definition export
2. Import it in elements/registry.js and add to arrays

No placeholder configs, no color abstractions - just a React component.

### State Management
- Zustand store is the single source of truth
- Components read directly from store (no prop drilling)
- canvasTransformRef passes latest transform to drag calculations
- Zoom synced bidirectionally between useCanvasTransform and store

### Canvas Architecture
- Outer container: full width, #F0F7FF background, 1px solid border
- World container: panned/zoomed via translate() + scale()
- Artboard: 1440x900 white, overflow hidden, dashed blue border (mask)
- Elements absolutely positioned inside the artboard
- Zoom shown in toolbar (bottom-left indicator removed)