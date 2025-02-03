import { useGLTF } from "@react-three/drei";

function TShirt({ color }) {
  const { scene } = useGLTF("/tshirt.glb");

  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(color);
    }
  });

  return <primitive object={scene} scale={2} position={[0, 0, 0]} />;
}

export default TShirt;
