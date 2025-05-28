import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { mockPieData as data } from "../data/mockData";

const PieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsivePie
      data={data}
      theme={{
        background: "transparent",
        tooltip: {
          container: {
            background: "#1e1e2f",
            color: "#ffffff",
            fontSize: 14,
            borderRadius: "8px",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.45)",
            padding: "12px 15px",
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
            fontSize: 14,
            fontWeight: 600,
          },
        },
      }}
      margin={{ top: 40, right: 110, bottom: 90, left: 110 }}
      innerRadius={0.5}
      padAngle={1.5}
      cornerRadius={6}
      activeOuterRadiusOffset={12}
      borderWidth={2}
      borderColor={{ from: "color", modifiers: [["darker", 0.6]] }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={true}
      arcLabelsRadiusOffset={0.6}
      arcLabelsSkipAngle={12}
      arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          translateY: 60,
          itemWidth: 180,
          itemHeight: 22,
          itemTextColor: colors.grey[200],
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: colors.greenAccent[400],
              },
            },
          ],
        },
      ]}
      motionConfig="gentle"
    />
  );
};

export default PieChart;
