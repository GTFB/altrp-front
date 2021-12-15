import BaseElement from "./BaseElement";
import IconIcon from '../../../svgs/favorite.svg';
import {advancedTabControllers} from "../../decorators/register-controllers";
import {
  CONTROLLER_TEXTAREA,
  CONTROLLER_DIMENSIONS,
  CONTROLLER_NUMBER,
  CONTROLLER_SELECT2,
  CONTROLLER_SELECT,
  CONTROLLER_TEXT,
  CONTROLLER_LINK,
  CONTROLLER_TYPOGRAPHIC,
  CONTROLLER_CHOOSE,
  CONTROLLER_SLIDER,
  CONTROLLER_WYSIWYG,
  CONTROLLER_COLOR,
  CONTROLLER_SHADOW,
  CONTROLLER_SWITCHER,
  TAB_CONTENT,
  TAB_STYLE,
  TAB_ADVANCED,
  CONTROLLER_MEDIA,
  CONTROLLER_CREATIVE_LINK,
  CONTROLLER_GRADIENT, CONTROLLER_REPEATER, CONTROLLER_HEADING
} from "../modules/ControllersManager";


class Icon extends BaseElement {

  static getName() {
    return 'icon';
  }
  static getTitle() {
    return 'Icon';
  }

  static getIconComponent() {
    return IconIcon;
  }
  static getType() {
    return 'widget';
  }
  _registerControls() {
    if (this.controllersRegistered) {
      return
    }

    this.startControlSection('content', {
      label: 'Content',
      tab: TAB_CONTENT
    })

    this.addControl('icon', {
      type: CONTROLLER_MEDIA,
      label: 'Icon',
    })

    this.addControl('title_text', {
      type: CONTROLLER_TEXT,
      label: 'Title',
    })

    this.addControl('description', {
      type: CONTROLLER_TEXT,
      label: 'Description',
    })

    this.endControlSection()

    this.startControlSection('common_styles', {
      label: 'Common Styles',
      tab: TAB_STYLE
    })

    this.addControl('flex_direction', {
      type: CONTROLLER_SELECT,
      label: 'Flex Direction',
      options: [
        {
          value: "row",
          label: "Row"
        },
        {
          value: "column",
          label: "Columnn"
        },
        {
          value: "row-reverse",
          label: "Row reverse"
        },
        {
          value: "column-reverse",
          label: "Column reverse"
        },
      ],
    })

    this.endControlSection()

    this.startControlSection('title_styles', {
      label: 'Title',
      tab: TAB_STYLE
    })

    this.addControl('title_typography', {
      label: 'Typography',
      type: CONTROLLER_TYPOGRAPHIC
    })

    this.addControl('title_color', {
      label: 'Color',
      type: CONTROLLER_COLOR
    })

    this.addControl('title_padding', {
      label: 'Padding',
      type: CONTROLLER_DIMENSIONS
    })
    
    this.addControl('title_margin', {
      label: 'Margin',
      type: CONTROLLER_DIMENSIONS
    })

    this.addControl('title_alignment', {
      type: CONTROLLER_CHOOSE,
      label: 'Alignment',
      options:[
        {
          icon: 'left',
          value: 'left',
        },
        {
          icon: 'center',
          value: 'center',
        },
        {
          icon: 'right',
          value: 'right',
        }
      ],
    });

    this.endControlSection()

    this.startControlSection('description_styles', {
      label: 'Description',
      tab: TAB_STYLE
    })

    this.addControl('description_typography', {
      label: 'Typography',
      type: CONTROLLER_TYPOGRAPHIC
    })

    this.addControl('description_color', {
      label: 'Color',
      type: CONTROLLER_COLOR
    })

    this.addControl('description_padding', {
      label: 'Padding',
      type: CONTROLLER_DIMENSIONS
    })
    
    this.addControl('description_margin', {
      label: 'Margin',
      type: CONTROLLER_DIMENSIONS
    })

    this.addControl('description_alignment', {
      type: CONTROLLER_CHOOSE,
      label: 'Alignment',
      options:[
        {
          icon: 'left',
          value: 'left',
        },
        {
          icon: 'center',
          value: 'center',
        },
        {
          icon: 'right',
          value: 'right',
        }
      ],
    })

    this.endControlSection()

    this.startControlSection('icon_styles', {
      label: 'Icon',
      tab: TAB_STYLE
    })

    this.addControl("icon_height", {
      type: CONTROLLER_SLIDER,
      label: 'Height',
      units: [
        'px',
        '%',
      ],
      max: 1000,
      min: 0,
    });

    this.addControl("icon_fill", {
      type: CONTROLLER_COLOR,
      label: 'Fill color',
    });

    this.addControl('icon_padding', {
      label: 'Padding',
      type: CONTROLLER_DIMENSIONS
    })
    
    this.addControl('icon_margin', {
      label: 'Margin',
      type: CONTROLLER_DIMENSIONS
    })    
    
    this.addControl('icon_opacity', {
      type: CONTROLLER_SLIDER,
      label: 'Opacity',
      step: 0.01,
      min: 0,
      max: 1,
    })

    this.addControl('icon_alignment', {
      type: CONTROLLER_CHOOSE,
      label: 'Alignment',
      options:[
        {
          icon: 'left',
          value: 'flex-start',
        },
        {
          icon: 'center',
          value: 'center',
        },
        {
          icon: 'right',
          value: 'flex-end',
        }
      ],
    })

    this.endControlSection()

    advancedTabControllers(this);
  }
}

export default Icon
