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
        b'a'..=b'f' => c - b'a' + 10,
        _ => 0
    }
}

pub fn u8_to_hex(n: u8) -> (char, char) {
    let higher = n >> 4;
    let lower = n & 0x0f;
    (hex(higher), hex(lower))
}

#[wasm_bindgen]
pub fn rgb_to_hex(r: u8, g: u8, b: u8) -> String {
    let mut s = String::from("#000000");
    for (idx, n) in [r, g, b].iter().enumerate() {
        let (c1, c2) = u8_to_hex(*n);
        s.insert(idx*2+1, c1);
        s.insert(idx*2+2, c2);
    }
    s
}

#[wasm_bindgen]
pub fn hex_to_rgb(hex: &str) -> u32 {
    let mut acc = 0u32;
    for c in hex.bytes().skip(1) {
        acc <<= 4;
        acc += char_to_num(c) as u32
    }
    acc
}