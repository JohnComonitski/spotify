
import React, { useEffect, useRef } from 'react'
import { useRecoilState } from "recoil";
import { featuresState  } from "../atoms/featuresAtom";

const Canvas = props => {
    const divRef = useRef()
    const canvasRef = useRef(null)
    const features = useRecoilState(featuresState);
    var ctx;
    var particleArray = []; 
    var c1;
    var c2;
    var c3;
    var c4;

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    
    useEffect(() => {
        //Colors
        if(features[0]?.energy !== undefined){
            const color1 = () => {
                const r = Math.floor(features[0].acousticness * 255);
                const g = Math.floor(features[0].liveness * 255);
                const b = Math.floor(features[0].danceability * 255);
                return { r, g, b };
            };
            const color2 = () => {
                const r = Math.floor(features[0].energy * 255);
                const g = Math.floor(features[0].instrumentalness * 255);
                const b = Math.floor(features[0].valence * 255);
                return { r, g, b };
            };
            const color3 = () => {
                var r = Math.floor(features[0].acousticness * 255);
                r = r + 50;
                if(r < 0){
                    r = 0
                }
                var g = Math.floor(features[0].liveness * 255);
                g = g + 50;
                if(g < 0){
                    g = 0
                }
                var b = Math.floor(features[0].danceability * 255);
                b = b + 50;
                if(b < 0){
                    b = 0
                }
                return { r, g, b };
            };       
            const color4 = () => {
                var r = Math.floor(features[0].energy * 255);
                r = r + 50;
                if(r < 0){
                    r = 0
                }
                var g = Math.floor(features[0].instrumentalness * 255);
                g = g + 50;
                if(g < 0){
                    g = 0
                }
                var b = Math.floor(features[0].valence * 255);
                b = b + 50;
                if(b < 0){
                    b = 0
                }
                return { r, g, b };
            };
            //Center
            c1 = color1()
            //Outer
            c2 = color2()
            //Lines
            c3 = color3()
            //Dots
            c4 = color4()
            canvasRef.current.style.background = `radial-gradient(${rgbToHex(c1.r, c1.g, c1.b)}, ${rgbToHex(c2.r, c2.g, c2.b)})`
            
            ctx = canvasRef.current.getContext('2d');
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
    
            init();
            animate();
    
            window.addEventListener('resize',
                function(){
                    if(canvasRef.current!== null){
                        canvasRef.current.width = innerWidth;
                        canvasRef.current.height = innerHeight;
                        init()
                    }
                }
            )

            //Clean up particles
            return () => {
                if(canvasRef.current === null){
                    for(var i = 0;  i < particleArray.length; i++){
                        console.log(delete particleArray[i])
                    }
                }
                
            }
        }
    }, [features])

    function init(){
        particleArray = []
        let numberOfParticles = (canvasRef.current.height * canvasRef.current.width) / 9000;
        for(let i = 0; i < numberOfParticles; i++){
            let size = (Math.random() * 5) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2)
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2)
            var speed = features[0].tempo / 120
            let directionX = (Math.random() * 5 * speed) - 2.5
            let directionY = (Math.random() * 5 * speed) - 2.5
            let color = rgbToHex(c4.r, c4.g, c4.b)
            particleArray.push(new Particle(x, y, directionX, directionY, size, color))
        }
    }

    function animate(){
        if(canvasRef.current !== null){
            requestAnimationFrame(animate);
            ctx.clearRect(0,0, innerWidth, innerHeight);
        
            for( let i = 0; i< particleArray.length; i++){
                particleArray[i].update();
            }
            connect()
        }
    }

    class Particle {
        constructor (x, y, directionX, directionY, size, color){
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = `rgba(${c4.r}, ${c4.g}, ${c4.b}, 1)`;
        }
    
        draw(){
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false)
            ctx.fillStyle = rgbToHex(c4.r, c4.g, c4.b)
            ctx.fill();
        }
    
        update(){
            if(canvasRef !== null){
                //Check if in canvas
                if(this.x > canvasRef.current.width || this.x < 0){
                    this.directionX = -this.directionX;
                }
                if(this.y > canvasRef.current.width || this.y < 0){
                    this.directionY = -this.directionY;
                }
                
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }
    }

    function connect(){
        let opactityValue = 1;
        for (let a = 0; a <particleArray.length; a++){
            for (let b = 0; b <particleArray.length; b++){
                let distance = ((particleArray[a].x - particleArray[b].x)
                * (particleArray[a].x - particleArray[b].x))
                + ((particleArray[a].y - particleArray[b].y)
                * (particleArray[a].y - particleArray[b].y))

                if (distance < (canvasRef.current.width/7 * canvasRef.current.height/7)){
                    opactityValue = 1 - (distance/20000)
                    ctx.strokeStyle = `rgba(${c3.r}, ${c3.g}, ${c3.b}, 1)`
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particleArray[a].x, particleArray[a].y)
                    ctx.lineTo(particleArray[b].x, particleArray[b].y)
                    ctx.stroke();
                }
            }
        }
    }
    
    return (
        <div ref={divRef} className='w-full h-full' style={{"position": "fixed", "overflow": "hidden", "margin": "0", "padding": "0"}}>
            <canvas className="overflow-y-hidden" ref={canvasRef} {...props}/>
        </div>
    )
}






export default Canvas