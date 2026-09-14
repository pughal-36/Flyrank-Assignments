# Accessibility Implementation Notes

## Gap 1: Dialog Portal & Inert Background

**Our Implementation:**
Our `Modal` component renders inline exactly where it is placed in the DOM. While we trap focus using JavaScript, the rest of the page (the background) is technically still accessible to screen readers using virtual cursors. Additionally, if the parent container has `overflow: hidden` or a low `z-index`, the modal could be visually clipped or hidden.

**Shadcn (Radix UI) Implementation:**
Shadcn wraps the Dialog in a `<Portal>`, which teleports the modal DOM nodes to the very end of the `<body>`. This guarantees it is visually on top of everything else. Crucially, it applies `aria-hidden="true"` to the main application root and locks `body` scrolling via CSS. This guarantees that the background is completely inert for screen readers and impossible to interact with via mouse scrolling.

## Gap 2: Tabs Orientation & Activation Modes

**Our Implementation:**
Our `Tabs` component strictly handles left/right arrow keys (`ArrowRight`, `ArrowLeft`), assuming a horizontal layout. It also uses "Automatic Activation"—meaning the moment focus moves to a tab via an arrow key, that tab becomes active and displays its content.

**Shadcn (Radix UI) Implementation:**
Shadcn checks for an `orientation="vertical"` prop. If provided, it switches the keyboard handlers to use `ArrowUp` and `ArrowDown` instead of left/right. It also supports "Manual Activation", where navigating with arrow keys simply moves focus, and the user must explicitly press `Enter` or `Space` to activate the tab and show its content. This is a critical APG recommendation for tabs whose content is computationally expensive to load.
