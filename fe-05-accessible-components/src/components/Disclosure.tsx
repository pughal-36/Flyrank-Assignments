import { useState } from 'react';

export function Disclosure({ title, children }: { title: string, children: React.ReactNode }) {
  // We need state to track if the disclosure is open or closed
  const [isOpen, setIsOpen] = useState(false);
  
  // We need a unique ID to link the button to the content
  const contentId = "disclosure-content-123"; 

  return (
    <div style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
      
      {/* STEP 1: Add an onClick handler to this button to toggle `isOpen` */}
      {/* STEP 2: Add `aria-expanded={isOpen}` to this button */}
      {/* STEP 3: Add `aria-controls={contentId}` to this button */}
      <button
      onClick={()=>setIsOpen(!isOpen)}
      aria-expanded={isOpen}
      aria-controls={contentId}>
        {title}
      </button>

      {/* STEP 4: Give this div the id that matches `contentId` */}
      {/* STEP 5: Add logic to only render this div if `isOpen` is true */}
      {isOpen &&(
      <div id={contentId}>

        {children}
      </div>
      )}
      
    </div>
  );
}