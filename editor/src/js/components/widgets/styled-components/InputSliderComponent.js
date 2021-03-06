
import {defaultStyled, sliderStyled, styledString} from "../../../../../../front-app/src/js/helpers/styles";
import {getResponsiveSetting} from "../../../../../../front-app/src/js/helpers";

export default function InputSliderComponent(settings) {
  const styles = [
    "bp3-slider-axis .bp3-slider-label",
      ["", "label_typographic", "typographic"],
      ["color", "label_color", "color"],
    "}",

    "bp3-slider-axis .bp3-slider-label:hover",
      ["", "label_typographic", "typographic", ":hover"],
      ["color", "label_color", "color", ":hover"],
    "}",

    "bp3-slider-handle span.bp3-slider-label",
      ["", "current_label_typographic", "typographic"],
      ["color", "current_label_color", "color"],
    "}",

    "bp3-slider-handle:hover span.bp3-slider-label",
      ["", "current_label_typographic", "typographic", ":hover"],
      ["color", "current_label_color", "color", ":hover"],
    "}",


    "bp3-slider-handle",
      ["height", "handle_size", "slider"],
      ["width", "handle_size", "slider"],
      ["border-radius", "handle_radius", "dimensions"],
    "}",

    "altrp-field-slider-horizontal .altrp-field-slider",
      ["width", "width", "slider"],
    "}",
      () => {
        let tr_x = getResponsiveSetting(settings, "tr_x") ;
        let tr_y = getResponsiveSetting(settings, "tr_y") ;
        if(! tr_x && ! tr_y){
          return ''
        }
        return `& .bp3-slider-handle{transform:translate(${tr_x || '0px'},${tr_y || '0px'});}`
      },
    "altrp-field-slider-vertical .altrp-field-slider",
      ["height", "length", "slider"],
    "}",

    "bp3-slider-progress, & .bp3-slider-track",
      ["height", "height", "slider"],
    "}",

    "altrp-field-slider-vertical .bp3-slider-progress.bp3-slider-progress, & .altrp-field-slider-vertical .bp3-slider-track.bp3-slider-track",
      ["width", "thickness", "slider"],
    "}",

    "altrp-field-slider-horizontal .bp3-slider-label",
      () => {
        let height = getResponsiveSetting(settings, "height", "", { size: 6, unit: "px" })

        height = sliderStyled(height)

        return `transform: translate(-50%, calc(14px + ${height}));`
      },
    "}",

    "altrp-field-slider-vertical .bp3-slider-label.bp3-slider-label.bp3-slider-label",
      () => {
        let thickness = getResponsiveSetting(settings, "thickness", "", { size: 6, unit: "px" })

        thickness = sliderStyled(thickness)

        return `transform: translate(calc(14px + ${thickness}), 50%);`
      },
    "}",

    "bp3-slider-handle .bp3-slider-label, & .bp3-slider-handle.bp3-active .bp3-slider-label",
      ["background-color", "tooltip_color", "color"],
    "}",

    "bp3-slider-handle, & .bp3-slider-handle.bp3-active",
      ["background-color", "handle_color", "color"],
    "}",

    "bp3-slider-handle:hover, & .bp3-slider-handle:hover.bp3-active",
      ["background-color", "handle_color", "color", ":hover"],
    "}",

    "bp3-slider-handle:active, & .bp3-slider-handle:active.bp3-active ",
    ["background-color", "handle_color", "color", ".active"],
    "}",

    "bp3-slider-progress.bp3-intent-primary",
      ["background-color", "filled_color", "color"],
    "}",

    "bp3-slider-progress",
      ["background-color", "blank_color", "color"],
    "}",
  ];

  return styledString(styles, settings)
}
