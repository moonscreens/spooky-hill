vec3 dim = vec3(0.0, 0.09, 0.149);
// original vec3(1.0, 0.93, 0.43);
vec3 highlight = vec3(0.045 * 1.4, 0.09 * 1.4, 0.149 * 1.4);

vec2 scaled = vUv.xy * 7.5; //higher = smaller clouds

// add pixelated effect
float pixelation = 16.0; // lower value = more pixelated
scaled = round(scaled * pixelation);
scaled /= pixelation;

float alpha = .5 - snoise(vec3(scaled.x, scaled.y - u_time * 0.1, u_time * 0.01));

gl_FragColor.x = mix(dim.x, highlight.x, alpha);
gl_FragColor.y = mix(dim.y, highlight.y, alpha);
gl_FragColor.z = mix(dim.z, highlight.z, alpha);
gl_FragColor.a = min(1.0, alpha);