(function(root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define([], factory);
    }
    else if (typeof exports === 'object') {
        module.exports = factory();
    }
    else {
        root.kfn_scroll = factory();
    }
}(this, (function() {

    'use strict';
    
        var defaults = {
            wrapper: '#kfn_scroll',
            targets : '.kfn_scroll-el',
            wrapperSpeed: 0.08,
            targetSpeed: 0.02,
            targetPercentage: 0.1
        };

        var requestAnimationFrame = 
            window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            window.requestAnimationFrame = requestAnimationFrame;
        var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

        var extend = function () {

            var extended = {};
            var deep = false;
            var i = 0;
            var length = arguments.length;

            var merge = function (obj) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        extended[prop] = obj[prop];
                    }
                }
            };

            for ( ; i < length; i++ ) {
                var obj = arguments[i];
                merge(obj);
            }

            return extended;

        };

        var kfn_scroll = function(){
            this.Targets = [];
            this.TargetsLength = 0;
            this.wrapper = '';
            this.windowHeight = 0;
            this.wapperOffset = 0;
        };
        kfn_scroll.prototype = {
            isAnimate: false,
            isResize : false,
            scrollId: "",
            resizeId: "",
            init : function(options){
                this.settings = extend(defaults, options || {});
                this.wrapper = document.querySelector(this.settings.wrapper);

                if(this.wrapper==="undefined"){
                    return false;
                }
                this.targets = document.querySelectorAll(this.settings.targets);
                document.body.style.height = this.wrapper.clientHeight + 'px';

                this.windowHeight = window.clientHeight;
                this.attachEvent();
                this.apply(this.targets,this.wrapper);
                this.animate();
                this.resize();
            },
            apply : function(targets,wrapper){
                this.wrapperInit();
                
                this.targetsLength = targets.length;
                for (var i = 0; i < this.targetsLength; i++) {
                    var attr = {
                        offset : targets[i].getAttribute('data-offset'),
                        speedX : targets[i].getAttribute('data-speed-x'),
                        speedY : targets[i].getAttribute('data-speed-Y'),
                        percentage : targets[i].getAttribute('data-percentage'),
                        horizontal : targets[i].getAttribute('data-horizontal')
                    };
                    this.targetsInit(targets[i],attr);
                }
            },
            wrapperInit: function(){
                this.wrapper.style.width = '100%';
                this.wrapper.style.position = 'fixed';
            },
            targetsInit: function(elm,attr){
                
                this.Targets.push({
                    elm : elm,
                    offset : attr.offset ? attr.offset : 0,
                    horizontal : attr.horizontal ? attr.horizontal : 0,
                    top : 0,
                    left : 0,
                    speedX : attr.speedX ? attr.speedX : 1,
                    speedY : attr.speedY ? attr.speedY : 1,
                    percentage :attr.percentage ? attr.percentage : 0
                });
            },
            scroll : function(){
                var scrollTopTmp = document.documentElement.scrollTop || document.body.scrollTop;
                this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                var offsetBottom = this.scrollTop + this.windowHeight;
                this.wrapperUpdate(this.scrollTop);
                for (var i = 0; i < this.Targets.length; i++) {
                    this.targetsUpdate(this.Targets[i]);
                }
            },
            animate : function(){
                this.scroll();
                this.scrollId = requestAnimationFrame(this.animate.bind(this));
            },
            wrapperUpdate : function(){
                
                this.wapperOffset += (this.scrollTop - this.wapperOffset) * this.settings.wrapperSpeed;
                this.wrapper.style.transform = 'translate3d(' + 0 + ',' +  Math.round(-this.wapperOffset* 100) / 100 + 'px ,' + 0 + ')';
            },
            targetsUpdate : function(target){
                target.top += (this.scrollTop * Number(this.settings.targetSpeed) * Number(target.speedY) - target.top) * this.settings.targetPercentage;
                target.left += (this.scrollTop * Number(this.settings.targetSpeed) * Number(target.speedX) - target.left) * this.settings.targetPercentage;
                var targetOffsetTop = ( parseInt(target.percentage) - target.top - parseInt(target.offset) );
                var offsetY = Math.round(targetOffsetTop * -100) / 100;
                var offsetX = 0;
                if(target.horizontal){
                    var targetOffsetLeft = ( parseInt(target.percentage) - target.left - parseInt(target.offset) );
                    offsetX = Math.round(targetOffsetLeft * -100) / 100;
                }
                target.elm.style.transform = 'translate3d(' + offsetX + 'px ,' + offsetY + 'px ,' + 0 +')';
            },
            resize: function(){
                var self = this;
                self.windowHeight = (window.innerHeight || document.documentElement.clientHeight || 0);
                if( parseInt(self.wrapper.clientHeight) != parseInt(document.body.style.height)){
                    document.body.style.height = self.wrapper.clientHeight + 'px';
                }
                self.resizeId = requestAnimationFrame(self.resize.bind(self));
            },
            attachEvent : function(){
                var self = this;
                window.addEventListener('resize',(function(){
                    if(!self.isResize){
                        cancelAnimationFrame(self.resizeId);
                        cancelAnimationFrame(self.scrollId);
                        self.isResize = true;
                        setTimeout((function(){
                            self.isResize = false;
                            self.resizeId = requestAnimationFrame(self.resize.bind(self));
                            self.scrollId = requestAnimationFrame(self.animate.bind(self));
                        }),200);
                    }
                }));
                
            }
        };

        
        var kfn_scroll = new kfn_scroll();

        return kfn_scroll;
    }))
);



kfn_scroll.init({
    wrapper: '#kfn',
    targets : '.luxy-el',
    wrapperSpeed:  0.06
});

var a = document.querySelectorAll('img');

for (var i = 0; i < a.length; i++) {
    console.log(a[i].offsetTop)
}

function offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}
var kfn_anim = function(){
    var elements = document.querySelectorAll('.kfn_anim');
    for (var i = 0; i < elements.length; i++) {
        // if (mobileDetect) {
        //   elements[i].style.visibility = 'hidden';
        // }
        var elementData = elements[i].dataset.kfn;
        if (window.scrollY > offset(elements[i]).top - window.innerHeight) {
            elements[i].classList.add(elementData)
        }
    }
}
kfn_anim();
window.addEventListener('scroll',kfn_anim);
window.addEventListener('resize',kfn_anim);

// var hoverEffect = function(opts) {
//     var vertex = `
//         varying vec2 vUv;
//         void main() {
//           vUv = uv;
//           gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
//         }
//     `;

//     var fragment = `
//         varying vec2 vUv;

//         uniform sampler2D texture;
//         uniform sampler2D texture2;
//         uniform sampler2D disp;

//         // uniform float time;
//         // uniform float _rot;
//         uniform float dispFactor;
//         uniform float effectFactor;

//         // vec2 rotate(vec2 v, float a) {
//         //  float s = sin(a);
//         //  float c = cos(a);
//         //  mat2 m = mat2(c, -s, s, c);
//         //  return m * v;
//         // }

//         void main() {

//             vec2 uv = vUv;

//             // uv -= 0.5;
//             // vec2 rotUV = rotate(uv, _rot);
//             // uv += 0.5;

//             vec4 disp = texture2D(disp, uv);

//             vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);
//             vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);

//             vec4 _texture = texture2D(texture, distortedPosition);
//             vec4 _texture2 = texture2D(texture2, distortedPosition2);

//             vec4 finalTexture = mix(_texture, _texture2, dispFactor);

//             gl_FragColor = finalTexture;
//             // gl_FragColor = disp;
//         }
//     `;

//     var parent = opts.parent || console.warn("no parent");
//     var dispImage = opts.displacementImage || console.warn("displacement image missing");
//     var image1 = opts.image1 || console.warn("first image missing");
//     var image2 = opts.image2 || console.warn("second image missing");
//     var intensity = opts.intensity || 1;
//     var speedIn = opts.speedIn || 1.6;
//     var speedOut = opts.speedOut || 1.2;
//     var userHover = (opts.hover === undefined) ? true : opts.hover;
//     var easing = opts.easing || Expo.easeOut;

//     var mobileAndTabletcheck = function() {
//       var check = false;
//       (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
//       return check;
//     };

//     var scene = new THREE.Scene();
//     var camera = new THREE.OrthographicCamera(
//         parent.offsetWidth / -2,
//         parent.offsetWidth / 2,
//         parent.offsetHeight / 2,
//         parent.offsetHeight / -2,
//         1,
//         1000
//     );

//     camera.position.z = 1;

//     var renderer = new THREE.WebGLRenderer({
//         antialias: false,
//         // alpha: true
//     });

//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setClearColor(0xffffff, 0.0);
//     renderer.setSize(parent.offsetWidth, parent.offsetHeight);
//     parent.appendChild(renderer.domElement);

//     // var addToGPU = function(t) {
//     //     renderer.setTexture2D(t, 0);
//     // };

//     var loader = new THREE.TextureLoader();
//     loader.crossOrigin = "";
//     var texture1 = loader.load(image1);
//     var texture2 = loader.load(image2);

//     var disp = loader.load(dispImage);
//     disp.wrapS = disp.wrapT = THREE.RepeatWrapping;

//     texture1.magFilter = texture2.magFilter = THREE.LinearFilter;
//     texture1.minFilter = texture2.minFilter = THREE.LinearFilter;

//     texture1.anisotropy = renderer.getMaxAnisotropy();
//     texture2.anisotropy = renderer.getMaxAnisotropy();

//     var mat = new THREE.ShaderMaterial({
//         uniforms: {
//             effectFactor: { type: "f", value: intensity },
//             dispFactor: { type: "f", value: 0.0 },
//             texture: { type: "t", value: texture1 },
//             texture2: { type: "t", value: texture2 },
//             disp: { type: "t", value: disp }
//         },

//         vertexShader: vertex,
//         fragmentShader: fragment,
//         transparent: true,
//         opacity: 1.0
//     });

//     var geometry = new THREE.PlaneBufferGeometry(
//         parent.offsetWidth,
//         parent.offsetHeight,
//         1
//     );
//     var object = new THREE.Mesh(geometry, mat);
//     scene.add(object);

//     var addEvents = function(){
//         var evtIn = "mouseenter";
//         var evtOut = "mouseleave";
//         if (mobileAndTabletcheck()) {
//             evtIn = "touchstart";
//             evtOut = "touchend";
//         }
//         parent.addEventListener(evtIn, function(e) {
//             TweenMax.to(mat.uniforms.dispFactor, speedIn, {
//                 value: 1,
//                 ease: easing
//             });
//         });

//         parent.addEventListener(evtOut, function(e) {
//             TweenMax.to(mat.uniforms.dispFactor, speedOut, {
//                 value: 0,
//                 ease: easing
//             });
//         });
//     };

//     if (userHover) {
//         addEvents();
//     }

//     window.addEventListener("resize", function(e) {
//         renderer.setSize(parent.offsetWidth, parent.offsetHeight);
//     });


//     this.next = function(){
//         TweenMax.to(mat.uniforms.dispFactor, speedIn, {
//             value: 1,
//             ease: easing
//         });
//     }

//     this.previous = function(){
//         TweenMax.to(mat.uniforms.dispFactor, speedOut, {
//             value: 0,
//             ease: easing
//         });
//     };

//     var animate = function() {
//         requestAnimationFrame(animate);

//         renderer.render(scene, camera);
//     };
//     animate();
// };



// var something = new hoverEffect ({
// 	parent: document.querySelector('.container'),
// 	intensity1 : 1,
// 	intensity2 : 1,
// 	angle : Math.PI / 4,
// 	easing: Expo.easeInOut,
// 	speedIn: 2,
// 	speedOut: 2,
// 	image1: 'http://picsum.photos/3600/1904',
// 	image2: 'http://picsum.photos/3600/1912',
// 	displacementImage: 'images/displacement/4.png'
// });

// document.querySelector('.container').addEventListener('mouseover',function(){

// })




// // document.querySelector('.a').addEventListener('click', function(e){
// // 	e.preventDefault();
// // 	document.querySelector('.container').style.pointerEvents = 'all';
// // 	var _this = document.querySelector('.container');
// // 	setTimeout(function(){
// // 		_this.style.pointerEvents = 'none';
// // 	}, 900);
// // })