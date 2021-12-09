import getInputSelectStyles from "./getInputSelectStyles";
import TreeComponent from "../../../../../editor/src/js/components/widgets/styled-components/TreeComponent";
import {styledString} from "../../helpers/styles";
const {getResponsiveSetting} = window.altrpHelpers;


export default function getInputSelectTreeStyles(settings, prefix, id) {
  const popoverStyles = [
    () => {
      const value = getResponsiveSetting(settings, "background_section_opacity", "", {})

      if(value.size) {
        return `opacity: ${value.size};`
      } else {
        return ""
      }
    },

    "bp3-tree-node-content",
      ["", "field_font_typographic", "typographic"],
      ["color", "items_font_color", "color"],
      ["background-color", "background_style_background_color", "color"],
    "}",

    "bp3-tree-node-content:hover",
      ["color", "items_font_color", "color", ":hover"],
      ["background-color", "background_style_background_color", "color", ":hover"],
    "}",

    "bp3-tree-node-selected .bp3-tree-node-content.bp3-tree-node-content",
      ["color", "items_font_color", "color", ".active"],
      ["background-color", "background_style_background_color", "color", ".active"],
    "",
  ]

  return getInputSelectStyles(settings) + TreeComponent(settings) + `.altrp-select-tree${id} {${styledString(popoverStyles, settings)}}`
}
