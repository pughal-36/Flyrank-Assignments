import { useState, useRef } from 'react';

// Define the shape of each tab's data
interface TabItem {
  label: string;
  content: React.ReactNode;
}

export function Tabs({ tabs }: { tabs: TabItem[] }) {
  // Track which tab is active (start with the first one)
  const [activeIndex, setActiveIndex] = useState(0);

  // We need refs to each tab button so we can .focus() them with arrow keys
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // TODO: Write this function to handle arrow key navigation
  // It receives the keydown event from any tab button
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let newIndex=index;
    if(e.key === "ArrowRight" || e.key === "ArrowDown"){
       newIndex=(index+1)%tabs.length;
    }
    if(e.key==="ArrowLeft" || e.key === "ArrowUp"){
        newIndex = (index - 1 + tabs.length) % tabs.length;
    }
    if(e.key==="Home"){
        newIndex=0;
    };
    if(e.key==="End"){
        newIndex=tabs.length-1;
    }
    if (newIndex !== index) {
      setActiveIndex(newIndex);
      tabRefs.current[newIndex]?.focus(); // focus after state update
    }
  };
  return (
    <div style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>

      {/* STEP 5: Add role="tablist" and aria-label="Sample Tabs" to this div */}
      <div role="tablist" aria-label="Sample Tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={index==activeIndex}
            aria-controls={`tabpanel-${index}`}
            id={`tab-${index}`}
            tabIndex={ index===activeIndex?0:-1}
            onClick={()=>setActiveIndex(index)}
            onKeyDown={(e)=>handleKeyDown(e,index)}
            ref={(el)=>(tabRefs.current[index]=el)}
          >
            {tab.label}
          </button>
        ))}
      </div>

    
      <div role="tabpanel"
        id={`tabpanel-${activeIndex}`}
        aria-labelledby={`tab-${activeIndex}`}
        tabIndex={0}>
        {tabs[activeIndex].content}
      </div>

    </div>
  );
}