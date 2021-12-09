import styled from 'styled-components';
import {getResponsiveSetting} from "../../../../../front-app/src/js/helpers";

const ImagePlaceholder = styled.div`& {
  position: relative;
  max-width: 100%;
  overflow: hidden;
  width:${props => {
  if (_.isNumber(props.width)) {
    return props.width + 'px';
  }
  return props.width ? props.width : '100%'
}};
${(props) => {
  const {settings} = props;
  const aspect_ratio_size = getResponsiveSetting(settings, 'aspect_ratio_size');
  if(Number(aspect_ratio_size) !== 0 && aspect_ratio_size === 'custom'|| Number(aspect_ratio_size)){
    return 'height:auto;'
  }
  if(! props.height || props.height.indexOf('%') !== -1) {
    return 'height:auto;'
  }
  return `height:${props.height ? props.height : 'auto'};`;
}}

  background-color: ${props => props.color ? props.color : '#fff'};
}
&::before{
  display: block;
  content: '';
  width: 100%;
${(props) => {
  const {settings, height} = props;
  let style = '';
  const aspect_ratio_size = getResponsiveSetting(settings, 'aspect_ratio_size');
  if(Number(aspect_ratio_size) !== 0) {
    if(aspect_ratio_size === 'custom') {
      let custom_aspect = getResponsiveSetting(settings, 'custom_aspect');
      custom_aspect = Number(custom_aspect) || 100;
      style += `padding-top:${custom_aspect}%;`;
    } else if(Number(aspect_ratio_size)){
      style += `padding-top:${aspect_ratio_size}%;`;
    }
    return style;
  }
  if (height && _.isString(height) && height.indexOf('%') === -1) {
    return style;
  }
  if (Number(props.mediaWidth) && Number(props.mediaHeight)) {
    style += `padding-top:${(props.mediaHeight / props.mediaWidth) * 100}%;`
  }
  return style;
}};
}
&& .altrp-skeleton,
&& .altrp-image{
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  height:100%;
  width:100%;
}
`;

export default ImagePlaceholder;
