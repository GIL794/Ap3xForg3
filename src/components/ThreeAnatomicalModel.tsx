import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface MuscleRecoveryData {
  id: string;
  name: string;
  recoveryPercentage: number;
  status: 'optimal' | 'recovering' | 'fatigued';
}

interface ThreeAnatomicalModelProps {
  muscleScores: Record<string, MuscleRecoveryData>;
  selectedMuscleId: string;
  onSelectMuscle: (muscleId: string) => void;
  orientation?: 'front' | 'back';
}

export const ThreeAnatomicalModel: React.FC<ThreeAnatomicalModelProps> = ({
  muscleScores,
  selectedMuscleId,
  onSelectMuscle,
  orientation = 'front',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

  // References to keep Three.js state across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const humanoidGroupRef = useRef<THREE.Group | null>(null);
  const muscleMeshesRef = useRef<Map<string, THREE.Mesh[]>>(new Map());
  const mouseRef = useRef(new THREE.Vector2());
  const raycasterRef = useRef(new THREE.Raycaster());

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  // Get color based on recovery percentage
  const getRecoveryColor = (percentage: number, isSelected: boolean) => {
    if (isSelected) return new THREE.Color(0xfbbf24); // Roman imperial gold for selected
    if (percentage >= 90) return new THREE.Color(0x10b981); // Emerald optimal
    if (percentage >= 75) return new THREE.Color(0xf59e0b); // Amber recovering
    return new THREE.Color(0xef4444); // Crimson fatigued
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 420;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06080f, 0.08);
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 3.8);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio & Hologram Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 2.5);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);

    const rimLightBlue = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimLightBlue.position.set(-3, 2, -2);
    scene.add(rimLightBlue);

    const rimLightGold = new THREE.DirectionalLight(0xf59e0b, 1.5);
    rimLightGold.position.set(3, -1, -2);
    scene.add(rimLightGold);

    // 5. Roman Arena Holographic Ground Ring
    const groundGroup = new THREE.Group();
    const ringGeo = new THREE.RingGeometry(1.2, 1.25, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd97706, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.65;
    groundGroup.add(ringMesh);

    const innerRingGeo = new THREE.RingGeometry(0.8, 0.82, 36);
    const innerRingMesh = new THREE.Mesh(innerRingGeo, ringMat);
    innerRingMesh.rotation.x = Math.PI / 2;
    innerRingMesh.position.y = -1.65;
    groundGroup.add(innerRingMesh);

    const gridHelper = new THREE.GridHelper(3, 12, 0xd97706, 0x1e293b);
    gridHelper.position.y = -1.65;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.2;
    groundGroup.add(gridHelper);
    scene.add(groundGroup);

    // 6. Build Humanoid Anatomical Musculature
    const humanoid = new THREE.Group();
    humanoidGroupRef.current = humanoid;
    scene.add(humanoid);

    const muscleMeshMap = new Map<string, THREE.Mesh[]>();
    muscleMeshesRef.current = muscleMeshMap;

    const registerMuscleMesh = (muscleId: string, mesh: THREE.Mesh) => {
      mesh.userData = { muscleId };
      const list = muscleMeshMap.get(muscleId) || [];
      list.push(mesh);
      muscleMeshMap.set(muscleId, list);
      humanoid.add(mesh);
    };

    // Shared Base Material Creator
    const createMuscleMaterial = (muscleId: string) => {
      const score = muscleScores[muscleId]?.recoveryPercentage || 100;
      const isSelected = selectedMuscleId === muscleId;
      const col = getRecoveryColor(score, isSelected);

      return new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.35,
        metalness: 0.65,
        wireframe: isWireframe,
        emissive: col,
        emissiveIntensity: isSelected ? 0.45 : 0.15,
      });
    };

    // Non-muscle Structural Bone/Joint Material (metallic obsidian)
    const boneMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.8,
      wireframe: isWireframe,
    });

    // --- Anatomical Geometries ---

    // Head & Helmet
    const headGeo = new THREE.SphereGeometry(0.22, 24, 24);
    headGeo.scale(0.85, 1.15, 0.95);
    const headMesh = new THREE.Mesh(headGeo, boneMaterial);
    headMesh.position.set(0, 1.25, 0);
    humanoid.add(headMesh);

    // Neck / Trapezius Upper
    const neckGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.2, 16);
    const neckMesh = new THREE.Mesh(neckGeo, createMuscleMaterial('back'));
    neckMesh.position.set(0, 1.02, -0.02);
    registerMuscleMesh('back', neckMesh);

    // Chest (Pectoralis Major Left & Right)
    const chestGeo = new THREE.BoxGeometry(0.32, 0.28, 0.22);
    // Left Pec
    const pecLeft = new THREE.Mesh(chestGeo, createMuscleMaterial('chest'));
    pecLeft.position.set(-0.17, 0.76, 0.1);
    pecLeft.rotation.set(0.08, 0.15, -0.05);
    registerMuscleMesh('chest', pecLeft);

    // Right Pec
    const pecRight = new THREE.Mesh(chestGeo, createMuscleMaterial('chest'));
    pecRight.position.set(0.17, 0.76, 0.1);
    pecRight.rotation.set(0.08, -0.15, 0.05);
    registerMuscleMesh('chest', pecRight);

    // Abdominals (Rectus Abdominis 6-pack)
    const absUpperGeo = new THREE.BoxGeometry(0.3, 0.2, 0.18);
    const absUpper = new THREE.Mesh(absUpperGeo, createMuscleMaterial('core'));
    absUpper.position.set(0, 0.5, 0.08);
    registerMuscleMesh('core', absUpper);

    const absLowerGeo = new THREE.BoxGeometry(0.28, 0.22, 0.17);
    const absLower = new THREE.Mesh(absLowerGeo, createMuscleMaterial('core'));
    absLower.position.set(0, 0.28, 0.07);
    registerMuscleMesh('core', absLower);

    // Back & Latissimus Dorsi (Lats V-Taper)
    const latGeo = new THREE.ConeGeometry(0.26, 0.5, 16);
    latGeo.scale(1.2, 1, 0.6);
    const latsLeft = new THREE.Mesh(latGeo, createMuscleMaterial('back'));
    latsLeft.position.set(-0.25, 0.62, -0.06);
    latsLeft.rotation.set(Math.PI - 0.2, 0, -0.3);
    registerMuscleMesh('back', latsLeft);

    const latsRight = new THREE.Mesh(latGeo, createMuscleMaterial('back'));
    latsRight.position.set(0.25, 0.62, -0.06);
    latsRight.rotation.set(Math.PI - 0.2, 0, 0.3);
    registerMuscleMesh('back', latsRight);

    // Upper Back / Traps Center
    const trapGeo = new THREE.BoxGeometry(0.42, 0.3, 0.18);
    const trapCenter = new THREE.Mesh(trapGeo, createMuscleMaterial('back'));
    trapCenter.position.set(0, 0.78, -0.1);
    registerMuscleMesh('back', trapCenter);

    // Deltoids (Shoulders Left & Right)
    const deltGeo = new THREE.SphereGeometry(0.16, 16, 16);
    deltGeo.scale(1, 1.25, 1);
    const deltLeft = new THREE.Mesh(deltGeo, createMuscleMaterial('deltoids'));
    deltLeft.position.set(-0.46, 0.82, 0.02);
    registerMuscleMesh('deltoids', deltLeft);

    const deltRight = new THREE.Mesh(deltGeo, createMuscleMaterial('deltoids'));
    deltRight.position.set(0.46, 0.82, 0.02);
    registerMuscleMesh('deltoids', deltRight);

    // Biceps (Left & Right)
    const armUpperGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.32, 16);
    const bicepLeft = new THREE.Mesh(armUpperGeo, createMuscleMaterial('biceps'));
    bicepLeft.position.set(-0.48, 0.52, 0.04);
    registerMuscleMesh('biceps', bicepLeft);

    const bicepRight = new THREE.Mesh(armUpperGeo, createMuscleMaterial('biceps'));
    bicepRight.position.set(0.48, 0.52, 0.04);
    registerMuscleMesh('biceps', bicepRight);

    // Triceps (Left & Right Posterior)
    const tricepLeft = new THREE.Mesh(armUpperGeo, createMuscleMaterial('triceps'));
    tricepLeft.position.set(-0.48, 0.52, -0.04);
    registerMuscleMesh('triceps', tricepLeft);

    const tricepRight = new THREE.Mesh(armUpperGeo, createMuscleMaterial('triceps'));
    tricepRight.position.set(0.48, 0.52, -0.04);
    registerMuscleMesh('triceps', tricepRight);

    // Forearms (Left & Right)
    const forearmGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.36, 16);
    const forearmLeft = new THREE.Mesh(forearmGeo, createMuscleMaterial('biceps'));
    forearmLeft.position.set(-0.5, 0.16, 0.02);
    registerMuscleMesh('biceps', forearmLeft);

    const forearmRight = new THREE.Mesh(forearmGeo, createMuscleMaterial('biceps'));
    forearmRight.position.set(0.5, 0.16, 0.02);
    registerMuscleMesh('biceps', forearmRight);

    // Pelvis & Glutes
    const gluteGeo = new THREE.SphereGeometry(0.18, 16, 16);
    gluteGeo.scale(1.1, 1, 0.9);
    const gluteLeft = new THREE.Mesh(gluteGeo, createMuscleMaterial('glutes'));
    gluteLeft.position.set(-0.16, 0.02, -0.08);
    registerMuscleMesh('glutes', gluteLeft);

    const gluteRight = new THREE.Mesh(gluteGeo, createMuscleMaterial('glutes'));
    gluteRight.position.set(0.16, 0.02, -0.08);
    registerMuscleMesh('glutes', gluteRight);

    // Quadriceps (Anterior Thighs)
    const quadGeo = new THREE.CylinderGeometry(0.14, 0.11, 0.55, 16);
    const quadLeft = new THREE.Mesh(quadGeo, createMuscleMaterial('quads'));
    quadLeft.position.set(-0.2, -0.42, 0.04);
    quadLeft.rotation.z = -0.04;
    registerMuscleMesh('quads', quadLeft);

    const quadRight = new THREE.Mesh(quadGeo, createMuscleMaterial('quads'));
    quadRight.position.set(0.2, -0.42, 0.04);
    quadRight.rotation.z = 0.04;
    registerMuscleMesh('quads', quadRight);

    // Hamstrings (Posterior Thighs)
    const hamGeo = new THREE.CylinderGeometry(0.13, 0.1, 0.52, 16);
    const hamLeft = new THREE.Mesh(hamGeo, createMuscleMaterial('hamstrings'));
    hamLeft.position.set(-0.2, -0.42, -0.04);
    hamLeft.rotation.z = -0.04;
    registerMuscleMesh('hamstrings', hamLeft);

    const hamRight = new THREE.Mesh(hamGeo, createMuscleMaterial('hamstrings'));
    hamRight.position.set(0.2, -0.42, -0.04);
    hamRight.rotation.z = 0.04;
    registerMuscleMesh('hamstrings', hamRight);

    // Calves (Gastrocnemius & Soleus)
    const calfGeo = new THREE.SphereGeometry(0.11, 16, 16);
    calfGeo.scale(0.9, 1.8, 0.9);
    const calfLeft = new THREE.Mesh(calfGeo, createMuscleMaterial('calves'));
    calfLeft.position.set(-0.22, -1.02, -0.02);
    registerMuscleMesh('calves', calfLeft);

    const calfRight = new THREE.Mesh(calfGeo, createMuscleMaterial('calves'));
    calfRight.position.set(0.22, -1.02, -0.02);
    registerMuscleMesh('calves', calfRight);

    // Feet
    const footGeo = new THREE.BoxGeometry(0.12, 0.08, 0.26);
    const footLeft = new THREE.Mesh(footGeo, boneMaterial);
    footLeft.position.set(-0.22, -1.45, 0.06);
    humanoid.add(footLeft);

    const footRight = new THREE.Mesh(footGeo, boneMaterial);
    footRight.position.set(0.22, -1.45, 0.06);
    humanoid.add(footRight);

    // Set initial orientation
    if (orientation === 'back') {
      humanoid.rotation.y = Math.PI;
    }

    // 7. Mouse & Touch Interaction Handlers
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Handle Drag Rotation
      if (isDraggingRef.current && humanoidGroupRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;

        humanoidGroupRef.current.rotation.y += deltaX * 0.015;
        camera.position.y = Math.max(-0.5, Math.min(1.5, camera.position.y - deltaY * 0.008));
        camera.lookAt(0, 0, 0);

        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      } else {
        // Raycasting for Hover Detection
        raycasterRef.current.setFromCamera(mouseRef.current, camera);
        const intersects = raycasterRef.current.intersectObjects(humanoid.children, true);
        const hit = intersects.find(i => (i.object as any).userData?.muscleId);
        if (hit) {
          const muscleId = (hit.object as any).userData.muscleId;
          setHoveredMuscle(muscleId);
          renderer.domElement.style.cursor = 'pointer';
        } else {
          setHoveredMuscle(null);
          renderer.domElement.style.cursor = 'grab';
        }
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const clickY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(new THREE.Vector2(clickX, clickY), camera);
      const intersects = raycasterRef.current.intersectObjects(humanoid.children, true);
      const hit = intersects.find(i => (i.object as any).userData?.muscleId);
      if (hit) {
        const muscleId = (hit.object as any).userData.muscleId;
        onSelectMuscle(muscleId);
      }
    };

    // Touch controls for mobile devices
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDraggingRef.current && e.touches.length === 1 && humanoidGroupRef.current) {
        const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
        humanoidGroupRef.current.rotation.y += deltaX * 0.02;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('click', onClick);
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 8. Animation & Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Gentle auto-rotation when user is not manually dragging
      if (isRotating && !isDraggingRef.current && humanoidGroupRef.current) {
        humanoidGroupRef.current.rotation.y += delta * 0.45;
      }

      // Subtle floating breathing effect
      if (humanoidGroupRef.current) {
        humanoidGroupRef.current.position.y = Math.sin(elapsed * 1.5) * 0.03;
      }

      // Selected muscle pulsing glow
      muscleMeshMap.forEach((meshes, mId) => {
        const isSelected = mId === selectedMuscleId;
        const score = muscleScores[mId]?.recoveryPercentage || 100;
        const baseColor = getRecoveryColor(score, isSelected);

        meshes.forEach(m => {
          const mat = m.material as THREE.MeshStandardMaterial;
          if (mat) {
            mat.wireframe = isWireframe;
            if (isSelected) {
              const pulse = 0.4 + Math.sin(elapsed * 4) * 0.25;
              mat.emissive.set(baseColor);
              mat.emissiveIntensity = pulse;
            } else if (mId === hoveredMuscle) {
              mat.emissive.set(0xffffff);
              mat.emissiveIntensity = 0.3;
            } else {
              mat.emissive.set(baseColor);
              mat.emissiveIntensity = 0.15;
            }
          }
        });
      });

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });

    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('click', onClick);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, [orientation]);

  // Sync selected muscle and score updates with existing Three.js materials
  useEffect(() => {
    if (!muscleMeshesRef.current) return;
    muscleMeshesRef.current.forEach((meshes, mId) => {
      const isSelected = mId === selectedMuscleId;
      const score = muscleScores[mId]?.recoveryPercentage || 100;
      const col = getRecoveryColor(score, isSelected);

      meshes.forEach(m => {
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.color.copy(col);
          mat.wireframe = isWireframe;
          mat.emissive.copy(col);
          mat.emissiveIntensity = isSelected ? 0.5 : 0.15;
        }
      });
    });
  }, [selectedMuscleId, muscleScores, isWireframe]);

  const handleOrientationToggle = (dir: 'front' | 'back') => {
    if (humanoidGroupRef.current) {
      humanoidGroupRef.current.rotation.y = dir === 'front' ? 0 : Math.PI;
    }
  };

  const handleResetCamera = () => {
    if (cameraRef.current && humanoidGroupRef.current) {
      cameraRef.current.position.set(0, 0.3, 3.8);
      cameraRef.current.lookAt(0, 0, 0);
      humanoidGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[420px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#06080f] via-[#090d16] to-[#04060a] border border-amber-500/20 shadow-2xl flex flex-col items-center justify-center">
      {/* Three.js Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing select-none" />

      {/* Floating HUD Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        {/* Model Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-[11px] font-mono pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-amber-300 font-bold tracking-wider">3D WEBGL ENGINE ACTIVE</span>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
              isRotating
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle 360° Orbit Auto-Rotation"
          >
            {isRotating ? '⏸ 360° Orbit' : '▶ 360° Orbit'}
          </button>
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
              isWireframe
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Cybernetic Wireframe"
          >
            {isWireframe ? 'Holo Mesh' : 'Solid Metal'}
          </button>
        </div>
      </div>

      {/* Bottom Floating Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-slate-800 pointer-events-auto">
          <button
            onClick={() => handleOrientationToggle('front')}
            className="px-3 py-1 rounded-lg text-xs font-bold font-roman text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            Anterior
          </button>
          <button
            onClick={() => handleOrientationToggle('back')}
            className="px-3 py-1 rounded-lg text-xs font-bold font-roman text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            Posterior
          </button>
          <button
            onClick={handleResetCamera}
            className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-all"
            title="Reset Camera Angle"
          >
            ↺ Reset
          </button>
        </div>

        {/* Hover / Selected Readout */}
        <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-xs flex items-center gap-2 pointer-events-auto shadow-lg">
          <span className="text-slate-400 font-roman">Target:</span>
          <span className="text-amber-300 font-bold capitalize">
            {hoveredMuscle ? hoveredMuscle : selectedMuscleId}
          </span>
          <span className="font-mono text-emerald-400 text-[11px]">
            {muscleScores[hoveredMuscle || selectedMuscleId]?.recoveryPercentage || 100}%
          </span>
        </div>
      </div>
    </div>
  );
};
