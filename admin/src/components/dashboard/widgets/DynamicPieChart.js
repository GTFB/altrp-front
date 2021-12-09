import React, { useState, useEffect, useCallback } from "react";
import { ResponsivePie } from "@nivo/pie";
import Spinner from "./Spinner";
import EmptyWidget from "./EmptyWidget";

import Schemes from "../../../../../editor/src/js/components/altrp-dashboards/settings/NivoColorSchemes";
const regagroScheme = _.find(Schemes, { value: "regagro" }).colors;
const milkScheme = _.find(Schemes, { value: "milk" }).colors;
const milkScheme2 = _.find(Schemes, { value: "milk2" }).colors;

import { getWidgetData } from "../services/getWidgetData";
import moment from "moment";
import { animated } from '@react-spring/web'
import TooltipPie from "./d3/TooltipPie";

const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
  let total = 0
  dataWithArc.forEach(datum => {
      total += datum.value
  })

  return (
    <svg>
      <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="central"
          className='centered-metric'
      >
        {total}
      </text>
    </svg>
  )
}

const DynamicPieChart = ({
  widget,
  width = "300px",
  height = "450px",
  dataSource = [],
  colorScheme = "red_grey",
  enableSliceLabels = false,
  innerRadius = 0,
  padAngle = 0,
  cornerRadius = 0,
  sortByValue = 0,
  enableRadialLabels = true,
  sort = "",
  tickRotation = 0,
  bottomAxis = true,
  keyIsDate = false,
  customColorSchemeChecker = false,
  customColors = [],
  widgetID,
  useCustomTooltips,
  margin,
  title,
  subTitle,
  legend,
  activeOuterRadiusOffset,
  activeInnerRadiusOffset,
  useCenteredMetric,
  useLinkArcLabels,
  useProcent
}) => {
  if (legend) {
    Object.keys(legend).forEach(key => legend[key] === undefined && delete legend[key])
  }

  let allValue = 0;

  dataSource.forEach(el => allValue += el.value)
  
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const getData = useCallback(async () => {
    setIsLoading(true);
    if (dataSource.length == 0) {
      const charts = await getWidgetData(widget.source, widget.filter);
      if (charts.status === 200) {
        const newData = charts.data.data.map(item => {
          const currentKey = item.key;
          const keyFormatted = !moment(currentKey).isValid()
            ? currentKey
            : moment(currentKey).format("DD.MM.YYYY");

          return {
            value: Number(item.data),
            id: keyIsDate ? keyFormatted : currentKey
          };
        });
        let data = newData;
        setData(data || []);
        setIsLoading(false);
      }
    } else {
      if (
        sort !== null &&
        sort !== "undefined" &&
        typeof dataSource !== "undefined"
      ) {
        switch (sort) {
          case "value":
            dataSource = _.sortBy(dataSource, ["value"]);
            break;
          case "key":
            dataSource = _.sortBy(dataSource, ["id"]);
            break;
          default:
            dataSource = dataSource;
            break;
        }
      }
      setData(dataSource || []);
      setIsLoading(false);
    }
  }, [widget]);

  useEffect(() => {
    getData();
  }, [getData]);

  const clickHandler = async () => {

  }

  const layers = ['arcs', 'arcLabels', 'arcLinkLabels', 'legends']

  if (useCenteredMetric) {
    layers.push(CenteredMetric)
  }

  const customProperties = {}

  if (!useLinkArcLabels) {
    customProperties.arcLinkLabelComponent = () => <text />
  }

  if (isLoading) return <Spinner />;

  if (!data || data.length === 0) return <EmptyWidget />;

  return (
    <>
      {title && <h3 className='diagram-title' style={{margin: 0}}>{title}</h3>}
      {subTitle && <h5 className='diagram-subtitle' style={{margin: 0}}>{subTitle}</h5>}
      <div className='diagram' style={{ height: height, width: width }}>
        <ResponsivePie
          data={data}
          colors={
            customColorSchemeChecker && customColors.length > 0
              ? customColors
              : colorScheme === "regagro"
              ? regagroScheme
              : colorScheme === "milk"
              ? milkScheme
              : colorScheme === "milk2"
              ? milkScheme2
              : { scheme: colorScheme }
          }
          tooltip={datum => (
            <TooltipPie
              enable={useCustomTooltips}
              datum={datum}
              data={data}
              widgetID={widgetID}
            ></TooltipPie>
          )}
          cornerRadius={cornerRadius}
          sortByValue={sortByValue}
          axisBottom={
            bottomAxis && {
              tickRotation: tickRotation
            }
          }
          margin={margin}
          enableRadialLabels={enableRadialLabels}
          legends={legend && [
            {
              anchor: 'top-right',
              direction: 'column',
              translateX: 0,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 60,
              itemHeight: 14,
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 14,
              symbolShape: "circle",
              ...legend
            }
          ]}
          innerRadius={innerRadius}
          enableSliceLabels={enableSliceLabels}
          padAngle={padAngle}
          animate={true}
          activeOuterRadiusOffset={activeOuterRadiusOffset}
          activeInnerRadiusOffset={activeInnerRadiusOffset}
          layers={layers}
          arcLabelsComponent={({ datum, label, style }) => {
            console.log({datum});
            return <animated.g transform={style.transform} style={{ pointerEvents: 'none' }}>
                <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="arc-label"
                >
                    {label} {useProcent ?  ` (${Math.round((label / allValue) * 100)}%)` : ''}
                </text>
            </animated.g>
          }}
          {...customProperties}
        />
      </div>
    </>
  );
};

export default DynamicPieChart;
