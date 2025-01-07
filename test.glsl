#version 300 es
#ifdef GL_ES
precision mediump float;// 设置浮点类型的默认精度
#endif
// *** 警告：不要更改上面的代码 *** //
// 关于在 Gandi IDE 中使用着色器的更多信息，请访问：https://getgandi.com/extensions/glsl-in-gandi-ide

// *** 配置 *** //
// 下面的行设置了 'time' 变量的步进值，默认为 1。
// 在通常以 60 fps 运行的浏览器中，每帧会将 'time' 递增 'step'（即 time += step）。
//#step:1

// *** 默认变量 *** //
uniform bool byp;// 绕过标志，用于启用或禁用着色器效果
in vec2 vUv;// 传递给片段着色器的纹理坐标
out vec4 fragColor;// 输出片段颜色

// 当定义以下行时，当前屏幕内容作为纹理传递给变量 'tDiffuse'。
// 注释掉或更改 'tDiffuse' 的名字将自动禁用此功能。
uniform sampler2D tDiffuse;

uniform float time;

// *** 从这里开始编写你的代码 *** //
uniform float platX;
uniform float platY;
uniform float i_width;

void main(){
    float offset=-time/30.;
    float width=(i_width==0.)?.03:i_width;
    if(!byp && texture(tDiffuse,vUv)[3]!=0.){
        vec4 outColor;
        vec4 mask_color=vec4(.31,.43,.661,1.);
        outColor=(texture(tDiffuse,vUv)+mask_color)/2.;
        if(mod(vUv.y+offset,width) >= (width/4.) && mod(vUv.y+offset,width) <= (width-width/4.)){
            outColor=(outColor*1.2);
        }else if(mod(vUv.y+offset,width) <= (width/6.) || mod(vUv.y+offset,width) >= (width-width/6.)){
            outColor=(outColor*0.8);
        }
        outColor[3]=texture(tDiffuse,vUv)[3];
        fragColor=outColor;
    }else{
        // 如果启用了绕过，使用原始纹理颜色
        fragColor=texture(tDiffuse,vUv);
    }
}