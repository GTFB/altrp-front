import React from 'react';
const {isEditor, isSSR} = window.altrpHelpers;
import styled from "styled-components";
let Tooltip2;
let Popover2InteractionKind

if(window.altrpLibs) {
  Tooltip2 = window.altrpLibs.Tooltip2;
  Popover2InteractionKind = window.altrpLibs.Popover2InteractionKind;
}

function offset(slider) {
  if(!slider) {
    slider = {size: null}
  } else if(!slider.size) {
    slider = {size: null, ...slider }
  }

  if(slider.size === 0) {
    return { size: null }
  }

  return slider
}

const ElementLayout = styled.div`
  position: absolute;
  z-index: 0;
  pointer-events: none
`;

function AltrpTooltip2(props) {
  const minimal = props.minimal || false;
  const position = props.position || "bottom";
  let horizontal = offset(props.horizontal);
  let vertical = offset(props.vertical);
  let offsetArray = [parseInt(horizontal.size|| 0), parseInt(vertical.size|| 10)];
  const [size, setSize] = React.useState([0, 0]); // [width, height]

  function checkSize() {
    if(
      props.element.current.offsetWidth !== size[0] &&
      props.element.current.offsetHeight !== size[1]
    ) {
      setSize([
        props.element.current.offsetWidth,
        props.element.current.offsetHeight
      ])
    } else if(props.element.current.offsetWidth !== size[0]) {
      setSize([
        props.element.current.offsetWidth,
        size[1]
      ])
    } else if(props.element.current.offsetHeight !== size[1]) {
      setSize([
        size[0],
        props.element.current.offsetHeight,
      ])
    }
  }

  switch (position) {
    case "left":
      offsetArray = [parseInt(vertical.size), parseInt(horizontal.size|| 10)];
      break;
    case "right":
      offsetArray = [parseInt(vertical.size), parseInt(horizontal.size|| 10)];
      break;
  }

  let body = React.useMemo(() => {
    return isEditor() ?
      document.getElementById("editorContent").contentWindow.document.body
      :
      document.body
  });
  if(! isSSR()){
    React.useLayoutEffect(() => {
      if(isEditor()) {
        document.getElementById("editorContent").contentWindow.addEventListener("resize", checkSize);
      } else {
        window.addEventListener("resize", checkSize);
      }
      return () => {
        if(isEditor()) {
          document.getElementById("editorContent").contentWindow.removeEventListener("resize", checkSize);
        } else {
          window.removeEventListener("resize", checkSize);
        }
      }
    }, [])
  }

  if(isSSR()){
    return <></>;
  }
  if(Tooltip2 && props.text && !_.isString(props.children)) {
    return <Tooltip2
      content={props.text}
      popoverClassName={`altrp-tooltip-popover altrp-tooltip${props.id}`}
      isOpen={props.open || false}
      placement={position}
      minimal={minimal}
      interactionKind={Popover2InteractionKind.CLICK}
      portalContainer={body}
      modifiers={{
        eventListeners: {
          enabled: true,
          options: {
          }
        },
        offset: {
          enabled: true,
          options: {
            offset: offsetArray
          }
        },
      }}
      renderTarget={({ isOpen, ref, ...p }) => {
        return (

          <ElementLayout
            ref={ref}
            {...p}

            style={{
              height: size[1],
              width: size[0],
            }}
          />
        )
      }}
    />
  } else {
    return <></>
  }
}

export default AltrpTooltip2;
