import { Line } from '@react-three/drei';

interface InterfaceLine3DProps {
  start: [number, number, number];
  end: [number, number, number];
}

export function InterfaceLine3D({ start, end }: InterfaceLine3DProps) {
  return (
    <Line
      points={[start, end]}
      color="#7ab0ff"
      lineWidth={1.5}
      dashed={false}
    />
  );
}
