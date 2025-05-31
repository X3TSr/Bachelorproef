import { ResponsiveBar } from '@nivo/bar'


const getColor = (bar) => {
    const green = getComputedStyle(document.getElementById('root')).getPropertyValue('--color-green');
    const red = getComputedStyle(document.getElementById('root')).getPropertyValue('--color-red');

    const val = bar.data[bar.id];
    return val < 0 ? red : green;
};

// Custom layer to display labels with background at the base (zero line) of each bar
const CustomZeroLabels = ({ bars }) => {
    const fontSize = 12;   // Size of the label text
    const fontFamily = getComputedStyle(document.getElementById('root')).getPropertyValue('--font-subheading').split(' ').slice(2).join(' ');
    const paddingX = 4;    // Horizontal padding inside the background rectangle
    const paddingY = 2;    // Vertical padding inside the background rectangle

    return (
        <>
            {bars.map(bar => {
                const label = bar.data.data.year.toString(); // Extract the year label
                const x = bar.x + bar.width / 2;             // Center label horizontally on the bar
                const y = bar.data.value > 0
                    ? bar.y + bar.height                    // Place label at bottom of positive bar
                    : bar.y;                                // Place label at top of negative bar

                // Estimate width of text background rectangle based on label length
                const textWidth = label.length * fontSize * 0.6;
                const textHeight = fontSize;

                return (
                    <g key={bar.key + bar.indexValue}>
                        {/* Background rectangle behind the label */}
                        <rect
                            x={x - textWidth / 2 - paddingX}     // Centered horizontally
                            y={y - textHeight / 2 - paddingY}    // Centered vertically
                            width={textWidth + paddingX * 2}     // Width + horizontal padding
                            height={textHeight + paddingY * 2}   // Height + vertical padding
                            fill="#f0f0f0"                       // Light background color
                            opacity={0.4}                        // Slight transparency
                            rx={4}                               // Rounded corners
                        />

                        {/* Text label (the year) */}
                        <text
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill="#333"
                            fontSize={fontSize}
                            fontFamily={fontFamily}
                        >
                            {label}
                        </text>
                    </g>
                );
            })}
        </>
    );
};

const CustomRoundedBars = ({ bars }) => {
    // Utility to create an SVG path with different border radius for each corner
    const getRoundedPath = (x, y, width, height, radii) => {
        const { tl, tr, br, bl } = radii;

        // Construct an SVG path string for a rounded rectangle
        // M: Move to top-left corner + radius
        // H: Horizontal line to top-right before curve
        // Q: Top-right corner curve
        // V: Vertical line down before bottom-right curve
        // Q: Bottom-right corner curve
        // H: Horizontal line to bottom-left before curve
        // Q: Bottom-left corner curve
        // V: Vertical line up before top-left curve
        // Q: Top-left corner curve
        // Z: Close path
        return `
            M${x + tl},${y}
            H${x + width - tr}
            Q${x + width},${y} ${x + width},${y + tr}
            V${y + height - br}
            Q${x + width},${y + height} ${x + width - br},${y + height}
            H${x + bl}
            Q${x},${y + height} ${x},${y + height - bl}
            V${y + tl}
            Q${x},${y} ${x + tl},${y}
            Z
        `;
    };

    return (
        <g>
            {bars.map(bar => {
                // Determine if the bar represents a positive or negative value
                const isPositive = bar.data.value >= 0;

                // Set border radius depending on value:
                // Positive: rounded top corners
                // Negative: rounded bottom corners
                const radii = isPositive
                    ? { tl: 10, tr: 10, br: 0, bl: 0 }
                    : { tl: 0, tr: 0, br: 10, bl: 10 };

                return (
                    <path
                        key={bar.key}
                        d={getRoundedPath(bar.x, bar.y, bar.width, bar.height, radii)} // Generate the path
                        fill={bar.color} // Use Nivo's assigned color
                    />
                );
            })}
        </g>
    );
};

const CustomBarGraph = ({ inputData, inputKeys, numberOfYears = 0 }) => {
    return (
        <ResponsiveBar
            data={inputData.slice((numberOfYears * -1), -1)}
            keys={inputKeys}
            indexBy="year"
            margin={{ top: 30, right: 60, bottom: 30, left: 60 }}
            padding={.3}
            valueScale={{ type: 'linear', nice: true, min: 'auto', max: 'auto' }}
            valueFormat={value => `€${value}`}
            colors={getColor}
            motionConfig="wobbly"
            gridYValues={[0]}
            axisTop={null}
            axisRight={null}
            axisBottom={null}
            axisLeft={null}
            labelSkipWidth={999}
            labelSkipHeight={999}
            layers={['grid', 'axes', CustomRoundedBars, CustomZeroLabels, 'markers', 'legends']}
        />
    );
};

export default CustomBarGraph;