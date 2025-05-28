import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { mockBarData as data } from "../data/mockData";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsiveBar
      data={data}
      keys={["Legitimate", "Fraudulent", "Suspicious"]}
      indexBy="transaction_type"
      margin={{ top: 50, right: 130, bottom: 70, left: 80 }}
      padding={0.35}
      innerPadding={4}
      groupMode="grouped"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={({ id }) =>
        id === "Fraudulent"
          ? "#e53935"
          : id === "Suspicious"
          ? "#fdd835"
          : "#43a047"
      }
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
              fontSize: 12,
              fontWeight: 500,
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
            fontSize: 13,
          },
        },
        tooltip: {
          container: {
            background: "#2d2d3a",
            color: "#fff",
            fontSize: 14,
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
            padding: "10px 14px",
          },
        },
      }}
      borderRadius={4}
      borderColor={{ from: "color", modifiers: [["darker", 1.2]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickRotation: 0,
        tickPadding: 5,
        legend: isDashboard ? undefined : "Transaction Type",
        legendPosition: "middle",
        legendOffset: 48,
      }}
      axisLeft={{
        tickPadding: 5,
        legend: isDashboard ? undefined : "Number of Transactions",
        legendPosition: "middle",
        legendOffset: -60,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          itemWidth: 100,
          itemHeight: 22,
          itemDirection: "left-to-right",
          symbolSize: 18,
          symbolShape: "circle",
          itemTextColor: colors.grey[100],
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#fff",
              },
            },
          ],
        },
      ]}
      motionConfig="wobbly"
      role="application"
      barAriaLabel={(e) =>
        `${e.id} transactions: ${e.formattedValue} in ${e.indexValue}`
      }
    />
  );
};

export default BarChart;
