mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(message: &str) {
    alert(message);
}

fn hex(n: u8) -> char {
    match n {
        0x0..=0x9 => b'0' + n,
        0xa..=0xf => b'a' + (n - 10),
        _ => b'0'
    }.into()
}

fn char_to_num(c: u8) -> u8 {
    match c {
        b'0'..=b'9' => c - b'0',
        _ => b'0'
    }
}

//fn hex_str_to_num(s: &str) -> usize {
//    let bytes = s.as_bytes();
//
//}

pub fn u8_to_hex(n: u8) -> (char, char) {
    let higher = n >> 4;
    let lower = n & 0x0f;
    (hex(higher), hex(lower))
}

#[wasm_bindgen]
pub fn rgb_to_hex(r: u8, g: u8, b: u8) -> String {
    let mut s = String::with_capacity(7);
    s.push_str("#");
    for n in &[r, g, b] {
        let (c1, c2) = u8_to_hex(*n);
        s.push(c1);
        s.push(c2);
    }
    s
}

#[wasm_bindgen]
pub struct Vec4 {
    pub a: f32,
    pub b: f32,
    pub c: f32,
    pub d: f32,
}

#[wasm_bindgen]
pub fn hex_to_rgb1(hex: &str) -> Vec4 {
    Vec4{
        a: 1f32,
        b: 1f32,
        c: 1f32,
        d: 1f32,
    }
}

// export function hexToRgb1(out: vec4, hex: string): vec4 {
//    const bigint = parseInt(hex.slice(1, hex.length), 16);
//    const r = (bigint >> 16) & 255;
//    const g = (bigint >> 8) & 255;
//    const b = bigint & 255;
//
//    out[0] = r / 256;
//    out[1] = g / 256;
//    out[2] = b / 256;
//    out[3] = 1.;
//    return out;
//}
//
//export function rgbToHex(r, g, b) {
//    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
//}