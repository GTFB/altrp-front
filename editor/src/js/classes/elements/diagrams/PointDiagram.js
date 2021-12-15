import Schemes from "../../../components/altrp-dashboards/settings/NivoColorSchemes.js";
import BaseElement from ".././BaseElement";
import PieIcon from "../../../../svgs/skill-bar.svg";
import { advancedTabControllers } from "../../../decorators/register-controllers";
import {
  CONTROLLER_DIMENSIONS,
  CONTROLLER_SELECT,
  CONTROLLER_SLIDER,
  CONTROLLER_SWITCHER,
  CONTROLLER_QUERY,
  TAB_CONTENT,
  TAB_STYLE,
  CONTROLLER_TEXT,
  CONTROLLER_REPEATER,
  CONTROLLER_COLOR,
  CONTROLLER_NUMBER,
  CONTROLLER_RANGE,
  CONTROLLER_DATE,
  CONTROLLER_SHADOW,
  CONTROLLER_TYPOGRAPHIC
} from "../../modules/ControllersManager";

import {
  TABLE,
  LINE,
  POINT,
  BAR,
  PIE,
  widgetTypes
} from "../../../../../../admin/src/components/dashboard/widgetTypes";
import Repeater from "../../Repeater";
import titleControllers from "../../../decorators/diagrams/diagram-title-subtitle.js";
import legendControllers from "../../../decorators/diagrams/diagram-legend.js";

class PointDiagram extends BaseElement {
  static getName() {
    return "point-diagram";
  }
  static getTitle() {
    return "Point Diagram";
  }
  static getIconComponent() {
    return PieIcon;
  }
  static getType() {
    return "widget";
  }
  _registerControls() {
    if (this.controllersRegistered) {
      return;
    }

    this.startControlSection("content_section", {
      tab: TAB_CONTENT,
      label: "Content"
    });

    this.addControl("datasource_path", {
      dynamic: false,
      label: "Path to Data"
    });

    this.addControl("key_name", {
      dynamic: false,
      label: "Key Field (X)"
    });

    this.addControl("key_is_date", {
      dynamic: false,
      label: "Key has Date format?",
      type: CONTROLLER_SWITCHER
    });

    this.addControl("data_name", {
      dynamic: false,
      label: "Data Field (Y)"
    });

    this.addControl("sort", {
      type: CONTROLLER_SELECT,
      label: "Сортировка",
      options: [
        {
          id: 0,
          value: "",
          label: "По умолчанию"
        },
        {
          id: 1,
          value: "value",
          label: "По значению"
        },
        {
          id: 2,
          value: "key",
          label: "По ключу"
        }
      ]
    });

    this.addControl("use_legend", {
      type: CONTROLLER_SWITCHER,
      label: "Use legend?",
    });

    this.endControlSection();

    this.startControlSection("multiple_data", {
      dynamic: false,
      label: "Multiple data"
    });

    let repeater = new Repeater();
    repeater.addControl("title", {
      label: "Title",
      dynamic: false
    });
    repeater.addControl("path", {
      label: "Path",
      dynamic: false
    });
    repeater.addControl("data", {
      label: "Y",
      dynamic: false
    });
    repeater.addControl("key", {
      label: "X",
      dynamic: false
    });

    this.addControl("isMultiple", {
      type: CONTROLLER_SWITCHER,
      label: "Use multiple data?",
    });

    // this.addControl("keysIsDate", {
    //   label: "Ключи как дата",
    //   type: CONTROLLER_SWITCHER,
    //   dynamic: false
    // });

    this.addControl("rep", {
      type: CONTROLLER_REPEATER,
      fields: repeater.getControls()
    });

    this.endControlSection();

    this.startControlSection("style", {
      tab: TAB_STYLE,
      label: "Visual"
    });

    const colors = Schemes.map(object => {
      return { label: object.label, value: object.value };
    });

    this.addControl("colorScheme", {
      type: CONTROLLER_SELECT,
      label: "Color Scheme",
      options: colors
    });

    this.addControl("yScaleMax", {
      type: CONTROLLER_NUMBER,
      label: "Y scale max"
    });

    this.addControl("bottomAxis", {
      type: CONTROLLER_SWITCHER,
      label: "Enable bottom axis",
    });

    this.addControl("enableGridX", {
      type: CONTROLLER_SWITCHER,
      label: "Enable grid X",
    });

    this.addControl("enableGridY", {
      type: CONTROLLER_SWITCHER,
      label: "Enable grid Y",
    });

    this.addControl("tickRotation", {
      type: CONTROLLER_SLIDER,
      label: "Bottom axis rotation",
      min: -90,
      max: 90,
      step: 1
    });

    this.addControl("xScaleType", {
      type: CONTROLLER_SELECT,
      label: "X scale type",
      options: [
        {
          id: 0,
          label: "Linear",
          value: "linear"
        },
        {
          id: 1,
          label: "Point",
          value: "point"
        },
        {
          id: 2,
          label: "Time",
          value: "time"
        }
      ],
    });

    this.addControl("precision", {
      type: CONTROLLER_SELECT,
      label: "Time scale",
      options: [
        { id: 0, label: "Day", value: "day" },
        { id: 1, label: "Month", value: "month" },
        { id: 2, label: "Year", value: "year" }
      ],
      conditions: {
        xScaleType: "time",
      }
    });

    this.addControl("pointSize", {
      type: CONTROLLER_NUMBER,
      label: "Point size",
      conditions: {
        enablePoints: true,
      }
    });

    this.endControlSection();

    legendControllers(this)

    this.startControlSection("axisConstants", {
      tab: TAB_STYLE,
      label: "Axis constatns"
    });
    let repeaterY = new Repeater();

    repeaterY.addControl("yMarkerLabel", {
      type: CONTROLLER_TEXT,
      label: "Label Y",
      dynamic: false
    });
    repeaterY.addControl("yMarkerValue", {
      type: CONTROLLER_TEXT,
      label: "Value Y (only numbers)",
      dynamic: false
    });
    repeaterY.addControl("yMarkerOrientation", {
      type: CONTROLLER_SELECT,
      label: "Orientation Y",
      options: [
        { id: 0, value: "vertical", label: "Vertical" },
        { id: 1, value: "horizontal", label: "Horizontal" }
      ],
      dynamic: false
    });

    repeaterY.addControl("yMarkerColor", {
      type: CONTROLLER_COLOR,
      label: "Color Y",
      dynamic: false
    });

    repeaterY.addControl("yMarkerLabelColor", {
      type: CONTROLLER_COLOR,
      label: "Label color Y",
      dynamic: false
    });

    repeaterY.addControl("yMarkerWidth", {
      type: CONTROLLER_NUMBER,
      label: "Width Y",
      dynamic: false
    });

    //Y AXIS
    this.addControl("axisY", {
      label: "AXIS Y",
      type: CONTROLLER_REPEATER,
      fields: repeaterY.getControls()
    });

    let repeaterX = new Repeater();

    repeaterX.addControl("xMarkerLabel", {
      type: CONTROLLER_TEXT,
      label: "Label X",
      dynamic: false
    });

    repeaterX.addControl("xMarkerIsDate", {
      type: CONTROLLER_SWITCHER,
      label: "Value X is Date",
      dynamic: false
    });
    repeaterX.addControl("xMarkerValue", {
      type: CONTROLLER_TEXT,
      label: "Value X (only numbers or dates)",
      dynamic: false
    });
    repeaterX.addControl("xMarkerOrientation", {
      type: CONTROLLER_SELECT,
      label: "Orientation X",
      options: [
        { id: 0, value: "vertical", label: "Vertical" },
        { id: 1, value: "horizontal", label: "Horizontal" }
      ],
      dynamic: false
    });

    repeaterX.addControl("xMarkerColor", {
      type: CONTROLLER_COLOR,
      label: "Color X",
      dynamic: false
    });

    repeaterX.addControl("xMarkerLabelColor", {
      type: CONTROLLER_COLOR,
      label: "Label color X",
      dynamic: false
    });

    repeaterX.addControl("xMarkerWidth", {
      type: CONTROLLER_NUMBER,
      label: "Width X",
      dynamic: false
    });
    //X AXIS
    this.addControl("axisX", {
      label: "AXIS X",
      type: CONTROLLER_REPEATER,
      fields: repeaterX.getControls()
    });

    this.endControlSection();

    this.startControlSection("custom_color_scheme", {
      tab: TAB_STYLE,
      label: "Custom color scheme"
    });

    let repeaterScheme = new Repeater();

    repeaterScheme.addControl("color", {
      label: "Color",
      type: CONTROLLER_COLOR,
      dynamic: false
    });

    this.addControl("isCustomColor", {
      type: CONTROLLER_SWITCHER,
      label: "Use custom color scheme?",
    });

    this.addControl("customScheme", {
      type: CONTROLLER_REPEATER,
      fields: repeaterScheme.getControls()
    });

    this.endControlSection();

    this.startControlSection("size", {
      tab: TAB_STYLE,
      label: "Size"
    });

    this.addControl("width", {
      type: CONTROLLER_SLIDER,
      label: "width",
      units: ["px", "%", "vh"],
      max: 1000,
      min: 0,
    });

    this.addControl("height", {
      type: CONTROLLER_SLIDER,
      label: "height",
      units: ["px", "%", "vh"],
      max: 1000,
      min: 0,
    });

    this.addControl("margin", {
      type: CONTROLLER_DIMENSIONS,
      label: "Margin",
      units: ["px", "%", "vh"],
    });

    advancedTabControllers(this);
  }
}
export default PointDiagram;