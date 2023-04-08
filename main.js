import * as THREE from 'three';
import './style.css'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';

////scene
const scene = new THREE.Scene();

//sphere 
const geometry = new THREE.SphereGeometry( 3, 64, 64 ); //(radius , widthsegment , hightsegment)
const material = new THREE.MeshStandardMaterial( { 
    color: '#00ff83' ,
    roughness :0.7 ,
    // wireframe :true ,

} );
const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

////size 
const size ={
    width : window.innerWidth ,
    height : window.innerHeight,
}


////light 
const light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( 0, 10, 10 ); //(x , y ,z )postion
light.intensity =1.25   //defult=1
scene.add( light );


////Camera
const camera = new THREE.PerspectiveCamera( 45, size.width/size.height , 0.1 , 100);
camera.position.z = 20
scene.add( camera );



////renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas}); 
renderer.setSize( size.width ,size.height)
renderer.setPixelRatio(2) //make surface more smoother
renderer.render( scene ,camera )


////controls 
const controls = new OrbitControls( camera, canvas );
controls.enableDamping = true  //used to give a sense of weight to the controls
controls.enablePan = false    //disable camera panning.
controls.enableZoom = false  // disable zooming (dollying) of the camera. //zoom in   
controls.autoRotate  = true    
controls.autoRotateSpeed  = 6  //should autoRotate  = true  && update controls
 


////Resize in any width
window.addEventListener( 'resize' , () =>{
    //Update sizes
    size.width = window.innerWidth 
    size.height = window.innerHeight
    //Update Camera
    camera.updateProjectionMatrix()
    camera.aspect = size.width /size.height;
    renderer.setSize(size.width , size.height)
})

const loop =() =>{
    // update controls
    controls.update();

    renderer.render( scene ,camera)
    window.requestAnimationFrame(loop)
}
loop()

////Timeline    
 //->//gsap dont work
const TI = gsap.timeline({defaults :{duration :1} })
TI.fromTo(mesh.scale , {z:0 , x:0 , y:0} , {z:1 , x:1 , y:1})
TI.fromTo("nav" , {y :"-100%" } , {y :"0%" })
TI.fromTo(".title", {opacity :0 } , {opacity:1})


////mouse animation
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown" , () => (mouseDown = true));
window.addEventListener("mouseup" , () => (mouseDown = false));
window.addEventListener("mousemove" , (e) => {
    if(mouseDown){
    rgb = [
      Math.round((e.pageX / size.width) * 255),
      Math.round((e.pageY / size.height) * 255),
      150, // or any value you want for the blue channel
    ];
}
    console.log(rgb);
    //animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(mesh.material.color , { r:newColor.r , g:newColor.g , b:newColor.b })
     
});
