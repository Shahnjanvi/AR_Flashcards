const THREE = window.MINDAR.IMAGE.THREE;
import { loadAudio } from "./libs/loader.js";  
import { loadGLTF } from "./libs/loader.js";  

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './rst.mind', 
      maxTrack: 3,  
    });

    const { renderer, scene, camera } = mindarThree;

   
    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(light);

  
    const rat = await loadGLTF("./rat/scene.gltf");
    rat.scene.scale.set(0.5, 0.5, 0.5);

    const ratMixer = new THREE.AnimationMixer(rat.scene);
    const ratAction = ratMixer.clipAction(rat.animations[0]);
    ratAction.play();

    const scooter = await loadGLTF("./scooter/scene.gltf");
    scooter.scene.scale.set(0.2, 0.2, 0.2);

    const scooterMixer = new THREE.AnimationMixer(scooter.scene);
    const scooterAction = scooterMixer.clipAction(scooter.animations[0]);
    scooterAction.play();

    const train = await loadGLTF("./train/scene.gltf");
    train.scene.scale.set(0.3, 0.3, 0.3);
    train.scene.position.set(0, -0.1, 0);

    const trainMixer = new THREE.AnimationMixer(train.scene);
    const trainAction = trainMixer.clipAction(train.animations[0]);
    trainAction.play();

   
    const ratAclip = await loadAudio("./Sounds[RST]/Rat.mp3");
    const ratListener = new THREE.AudioListener();
    const ratAudio = new THREE.PositionalAudio(ratListener);

    const scooterAclip = await loadAudio("./Sounds[RST]/Scooter.mp3");
    const scooterListener = new THREE.AudioListener();
    const scooterAudio = new THREE.PositionalAudio(scooterListener);

    const trainAclip = await loadAudio("./Sounds[RST]/Train.mp3");
    const trainListener = new THREE.AudioListener();
    const trainAudio = new THREE.PositionalAudio(trainListener);

   
    const ratAnchor = mindarThree.addAnchor(0);
    ratAnchor.group.add(rat.scene);
    camera.add(ratListener);
    ratAudio.setRefDistance(100);
    ratAudio.setBuffer(ratAclip);
    ratAudio.setLoop(true);
    ratAnchor.group.add(ratAudio);
    ratAnchor.onTargetFound = () => {
      ratAudio.play();
    };
    ratAnchor.onTargetLost = () => {
      ratAudio.pause();
    };

    const scooterAnchor = mindarThree.addAnchor(1);
    scooterAnchor.group.add(scooter.scene);
    camera.add(scooterListener);
    scooterAudio.setRefDistance(100);
    scooterAudio.setBuffer(scooterAclip);
    scooterAudio.setLoop(true);
    scooterAnchor.group.add(scooterAudio);
    scooterAnchor.onTargetFound = () => {
      scooterAudio.play();
    };
    scooterAnchor.onTargetLost = () => {
      scooterAudio.pause();
    };

    const trainAnchor = mindarThree.addAnchor(2);
    trainAnchor.group.add(train.scene);
    camera.add(trainListener);
    trainAudio.setRefDistance(100);
    trainAudio.setBuffer(trainAclip);
    trainAudio.setLoop(true);
    trainAnchor.group.add(trainAudio);
    trainAnchor.onTargetFound = () => {
      trainAudio.play();
    };
    trainAnchor.onTargetLost = () => {
      trainAudio.pause();
    };

    const clock = new THREE.Clock(); 

    await mindarThree.start();

    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta(); 
      ratMixer.update(delta);       
      scooterMixer.update(delta);     
      trainMixer.update(delta);        
      train.scene.rotation.set(0, train.scene.rotation.y + delta, 0); 
      renderer.render(scene, camera); 
    });
  };

  start();
});


