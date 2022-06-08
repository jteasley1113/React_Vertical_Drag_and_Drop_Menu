import React, { useState, useRef } from "react";
import "./styles.css";

export default function App() {
  const [dragging, setDragging] = useState({
    state: false,
    index: null,
    x: null,
    y: null,
    bottom: null,
    top: null,
    height: null,
  });

  const [dragStyle, setDragStyle] = useState(
    Array(5).fill({
      transform: "translate(0px, 0px)",
      transitionDuration: "1s",
    })
  );

  const [listItems, setListItems] = useState(
    [...Array(5)].map((_, i) => ({ content: `Item ${i + 1}` }))
  );

  const ref = useRef(null);

  document.onmousemove = (e) => {
    if (dragging.state) {
      //var x = e.clientX - dragging.x;
      var y = window.event.clientY - dragging.y;
      var newDragStyle = [...dragStyle];

      newDragStyle[dragging.index] = {
        transform: `translate(0px, ${y}px)`,
      };

      var i;
      var count = -1;
      for (i = dragging.index; i < 4; i++) {
        count += 1;
        if (y >= dragging.height * 0.5 + count * dragging.height) {
          newDragStyle[i + 1] = {
            transform: "translate(0px, -51px)",
            transitionDuration: "0.3s",
          };
        } else {
          newDragStyle[i + 1] = {
            transform: "translate(0px, 0px)",
            transitionDuration: "0.3s",
          };
        }
      }
      count = -1;

      if (dragging.index > 0) {
        for (i = 0; i <= dragging.index; i++) {
          console.log(dragging.index);
          count += 1;
          if (y < -(dragging.height * 0.5 + count * dragging.height)) {
            newDragStyle[dragging.index - i - 1] = {
              transform: "translate(0px, 51px)",
              transitionDuration: "0.3s",
            };
          } else {
            newDragStyle[dragging.index - i - 1] = {
              transform: "translate(0px, 0px)",
              transitionDuration: "0.3s",
            };
          }
        }
      }
      setDragStyle(newDragStyle);
      console.log(dragStyle);
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    var top = ref.current.getBoundingClientRect().top;
    // var left = ref.current.getBoundingClientRect().left;
    // var x = window.event.clientX;
    var y = window.event.clientY;
    var yPos = window.event.clientY - top;
    // var xPos = window.event.clientX - left;

    var height = ref.current.getBoundingClientRect().height;
    var remaining = height - yPos;
    // if current = bottom - height*0.5 => trigger i++ transition

    var index = parseInt(e.target.getAttribute("index"));
    setDragging({
      state: true,
      index: index,
      // x: x,
      // xPos: xPos,
      y: y,
      yPos: yPos,
      bottom: ref.current.getBoundingClientRect().bottom,
      top: top,
      height: height,
      remaining: remaining,
    });
  };

  document.onmouseup = (e) => {
    setDragging({
      state: false,
      index: null,
      x: null,
      y: null,
      bottom: null,
      top: null,
      height: null,
    });
    var newDragStyle = [...dragStyle];

    let number = 0;
    newDragStyle.forEach((item, index) => {
      if (item.transform !== "translate(0px, 0px)") {
        if (index > dragging.index) {
          number += 1;
        } else if (index < dragging.index) {
          number -= 1;
        }
        newDragStyle[index] = {
          transform: "translate(0px, 0px)",
        };
      }
    });

    const newListItems = [...listItems];
    const currentIndex = newListItems[dragging.index];

    if (currentIndex) {
      newListItems.splice(dragging.index, 1);
      newListItems.splice(dragging.index + number, 0, currentIndex);
    }

    setListItems(newListItems);
    setDragStyle(newDragStyle);
  };

  return (
    <div className="App">
      <h2>Drag and Drop List</h2>
      <div>
        <ul>
          {listItems.map((item, index) => {
            return (
              <li
                ref={ref}
                index={index}
                style={{
                  transform: dragStyle[index].transform,
                  transitionDuration: dragStyle[index].transitionDuration,
                }}
                onMouseDown={handleMouseDown}
              >
                {item.content}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
