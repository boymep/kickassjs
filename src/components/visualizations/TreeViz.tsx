import { Box, Typography, useTheme } from '@mui/material';

interface TreeNode {
  id: number;
  label: string;
  x: number;
  y: number;
  role: 'root' | 'internal' | 'leaf';
  children: number[];
}

const nodes: TreeNode[] = [
  { id: 1, label: '1', x: 200, y: 40,  role: 'root',     children: [2, 3, 4] },
  { id: 2, label: '2', x: 80,  y: 130, role: 'internal', children: [5, 6] },
  { id: 3, label: '3', x: 200, y: 130, role: 'leaf',     children: [] },
  { id: 4, label: '4', x: 320, y: 130, role: 'internal', children: [7] },
  { id: 5, label: '5', x: 40,  y: 220, role: 'leaf',     children: [] },
  { id: 6, label: '6', x: 120, y: 220, role: 'leaf',     children: [] },
  { id: 7, label: '7', x: 320, y: 220, role: 'leaf',     children: [] },
];

const nodeById = new Map(nodes.map((n) => [n.id, n]));

const NODE_R = 22;
const SVG_W = 400;
const SVG_H = 260;

export default function TreeViz() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const PALETTE = {
    edge: isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.20)',
    rootFill: isDark ? 'rgba(10,132,255,0.20)' : 'rgba(10,132,255,0.14)',
    rootStroke: '#0a84ff',
    internalFill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    internalStroke: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.30)',
    leafFill: isDark ? 'rgba(52,199,89,0.18)' : 'rgba(52,199,89,0.14)',
    leafStroke: '#34c759',
    text: isDark ? '#f2f2f7' : '#1c1c1e',
  };

  const styleFor = (role: TreeNode['role']) => {
    switch (role) {
      case 'root':
        return { fill: PALETTE.rootFill, stroke: PALETTE.rootStroke };
      case 'leaf':
        return { fill: PALETTE.leafFill, stroke: PALETTE.leafStroke };
      default:
        return { fill: PALETTE.internalFill, stroke: PALETTE.internalStroke };
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        backgroundColor: (t) =>
          t.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Структура дерева: корень, внутренние узлы и листья.
      </Typography>

      <Box sx={{ overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
        <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`}>
          {/* Edges */}
          {nodes.map((node) =>
            node.children.map((childId) => {
              const child = nodeById.get(childId)!;
              return (
                <line
                  key={`${node.id}-${childId}`}
                  x1={node.x}
                  y1={node.y}
                  x2={child.x}
                  y2={child.y}
                  stroke={PALETTE.edge}
                  strokeWidth={1.5}
                />
              );
            }),
          )}
          {/* Nodes */}
          {nodes.map((node) => {
            const s = styleFor(node.role);
            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_R}
                  fill={s.fill}
                  stroke={s.stroke}
                  strokeWidth={2}
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fontSize={15}
                  fontWeight={600}
                  fill={PALETTE.text}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </Box>

      {/* Legend */}
      <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <LegendItem color={PALETTE.rootStroke} bg={PALETTE.rootFill} label="корень" />
        <LegendItem color={PALETTE.internalStroke} bg={PALETTE.internalFill} label="внутренний узел" />
        <LegendItem color={PALETTE.leafStroke} bg={PALETTE.leafFill} label="лист" />
      </Box>
    </Box>
  );
}

function LegendItem({ color, bg, label }: { color: string; bg: string; label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          bgcolor: bg,
          border: 1.5,
          borderColor: color,
        }}
      />
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
