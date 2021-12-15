
import React, { useState, useEffect, useCallback } from "react";

import Spinner from "./Spinner";
import EmptyWidget from "./EmptyWidget";

import Schemes from "../../../../../editor/src/js/components/altrp-dashboards/settings/NivoColorSchemes";
const regagroScheme = _.find(Schemes, { value: "regagro" }).colors;
const milkScheme = _.find(Schemes, { value: "milk" }).colors;
const milkScheme2 = _.find(Schemes, { value: "milk2" }).colors;

import { ResponsiveBar } from "@nivo/bar";

import { getWidgetData } from "../services/getWidgetData";
import TooltipBar from "./d3/TooltipBar";

const DynamicBarChart = ({
  widget,
  height,
  width,
  dataSource = [],
  groupMode = "stacked",
  layout = "vertical",
  colorScheme = "regagro",
  reverse = false,
  enableLabel = false,
  padding = 0.1,
  innerPadding = 0,
  borderRadius = 0,
  borderWidth = 0,
  sort = "",
  enableGridX = true,
  enableGridY = true,
  customColorSchemeChecker = false,
  customColors = [],
  useCustomTooltips,
  margin,
  legend,
  markers,
  keys,
  indexBy,
  valueFormat,
  axisBottom,
  maxValue,
  minValue
}) => {
  if (legend) {
    Object.keys(legend).forEach(key => legend[key] === undefined && delete legend[key])
  }

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const getData = useCallback(async () => {
    setIsLoading(true);
    if (dataSource.length == 0) {
      const charts = await getWidgetData(widget.source, widget.filter);
      if (charts.status === 200) {
        let data = charts.data.data.map((item, index) => {
          return {
            [item.key]: Number(item.data),
            key: item.key,
            value: Number(item.data)
          };
        });
        setData(data || []);
        setIsLoading(false);
      }
    } else {
      // if (
      //   sort !== null &&
      //   typeof sort !== "undefined" &&
      //   typeof dataSource !== "undefined"
      // ) {
      //   switch (sort) {
      //     case "value":
      //       dataSource = _.sortBy(dataSource, ["value"]);
      //       break;
      //     case "key":
      //       dataSource = _.sortBy(dataSource, ["key"]);
      //       break;
      //     default:
      //       dataSource = dataSource;
      //       break;
      //   }
      // }
      setData(dataSource || []);
      setIsLoading(false);
    }
  }, [widget]);

  useEffect(() => {
    getData();
  }, [getData]);

  if (isLoading) return <Spinner />;

  if (data.length === 0) return <EmptyWidget />;

  console.log("====================================");
  console.log(colorScheme);
  console.log("====================================");

  const customProps = {}

  if (legend) {
    customProps.legends = [
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
    ]
  }
  
  return (
    <>
      <div style={{ height, width }}>
        <ResponsiveBar
          data={data}
          margin={{
            top: margin?.top || 30,
            right: margin?.right || 30,
            bottom: margin?.bottom || 30,
            left: margin?.left || 30
          }}
          keys={keys}
          indexBy={indexBy}
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
          // colorBy="index"
          layout={layout}
          // tooltip={useCustomTooltips && (datum => (
          //   <TooltipBar
          //     enable={useCustomTooltips}
          //     datum={datum}
          //   />
          // ))}
          valueFormat={valueFormat}
          enableGridX={enableGridX}
          enableGridY={enableGridY}
          enableLabel={enableLabel}
          reverse={reverse}
          groupMode={groupMode}
          padding={padding}
          innerPadding={innerPadding}
          borderRadius={borderRadius}
          borderWidth={borderWidth}
          axisBottom={axisBottom}
          markers={markers}
          maxValue={maxValue}
          minValue={minValue}
          {...customProps}
        />
      </div>
    </>
  );
};

export default DynamicBarChart;