import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";

interface RadarData {
  axis: string;
  value: number;
  fullMark: number;
}

interface RadarChartProps {
  data: RadarData[];
  width?: number;
  height?: number;
  className?: string;
  animated?: boolean;
}

export const RadarChart = ({ 
  data, 
  width = 300, 
  height = 300, 
  className = "",
  animated = true 
}: RadarChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = 60;
    const radius = Math.min(width, height) / 2 - margin;
    const centerX = width / 2;
    const centerY = height / 2;

    const angleSlice = (Math.PI * 2) / data.length;

    // Create scales
    const rScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, radius]);

    // Background circles
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      svg.append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", radius * (i / levels))
        .attr("fill", "none")
        .attr("stroke", "hsl(var(--border))")
        .attr("stroke-width", 1)
        .attr("opacity", 0.3);
    }

    // Axis lines
    data.forEach((d, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      svg.append("line")
        .attr("x1", centerX)
        .attr("y1", centerY)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "hsl(var(--border))")
        .attr("stroke-width", 1)
        .attr("opacity", 0.5);

      // Axis labels
      const labelX = centerX + (radius + 20) * Math.cos(angle);
      const labelY = centerY + (radius + 20) * Math.sin(angle);

      svg.append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "hsl(var(--foreground))")
        .attr("font-size", "12px")
        .attr("font-weight", "500")
        .text(d.axis);
    });

    // Data path
    const pathGenerator = d3.line<[number, number]>()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveLinearClosed);

    const pathPoints: [number, number][] = data.map((d, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const value = rScale(d.value);
      return [
        centerX + value * Math.cos(angle),
        centerY + value * Math.sin(angle)
      ];
    });

    const path = svg.append("path")
      .datum(pathPoints)
      .attr("d", pathGenerator)
      .attr("fill", "hsl(var(--primary))")
      .attr("fill-opacity", 0.2)
      .attr("stroke", "hsl(var(--primary))")
      .attr("stroke-width", 2);

    // Data points
    data.forEach((d, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const value = rScale(d.value);
      const x = centerX + value * Math.cos(angle);
      const y = centerY + value * Math.sin(angle);

      svg.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 4)
        .attr("fill", "hsl(var(--primary))")
        .attr("stroke", "hsl(var(--background))")
        .attr("stroke-width", 2);
    });

    // Animation
    if (animated) {
      const totalLength = path.node()?.getTotalLength() || 0;
      path
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1500)
        .ease(d3.easeCubic)
        .attr("stroke-dashoffset", 0);
    }

  }, [data, width, height, animated]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
      />
    </motion.div>
  );
};