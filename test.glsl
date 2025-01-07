
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
uniform texture tDiffuse;

// 取消注释，可以启用计时器， 如果启动了计时器，上面设置的 step 才会生效。 此示例项目不需要使用计时器
//uniform float time;

// *** 从这里开始编写你的代码 *** //
// 马赛克效果中每个瓦片的大小的外部输入
// uniform float tileSize;
// 每个瓦片中纹理样本数的外部输入
// uniform float textureSamplesCount;

void main(){
    if(!byp){
        vec4 outColor;
        outColor=vec4(texture(tDiffuse,vUv)[2])
        fragColor=outColor
    }else{
        // 如果启用了绕过，使用原始纹理颜色
        fragColor=texture(tDiffuse,vUv);
    }
}