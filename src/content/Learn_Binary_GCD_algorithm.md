---
slug: learn-binary-gcd-algorithm
chinese_name: Learn Binary GCD algorithm
english_name: "Learn Binary GCD algorithm"
tags:
  - learning
  - blog
duration: 2023-03-28
public_date: 2023-03-28
base: "_posts.database.base"
---
今天在工作群里看同事闲聊，有个同事吐槽为啥项目里面也要自己实现 Greatest Common Divisor 算法来求解最大公约数。我开始也奇怪，GCD 不应该是标准库标配的吗。瞄了一眼代码….

等等，为啥代码还有位运算操作？代码咋变长了？GCD 不是就几行代码吗？这咋和我见过的辗转相除法不太一样。

于是我搜了一下，原来同事写的 GCD 算法叫 [Binary GCD Algorithm](https://en.wikipedia.org/wiki/Binary_GCD_algorithm)，我孤陋寡闻了。我真菜。

### Euclidean_algorithm

我先回顾一下 🐶，常见的 GCD 算法应该是 [Euclidean_algorithm](https://en.wikipedia.org/wiki/Euclidean_algorithm)

```rust
fn gcd_euclid(a: u32, b: u32) -> u32 {
    // euclidean division equation: a = b · q + r
    let (mut a, mut b) = if a > b { (a, b) } else { (b, a) };

    while b != 0 {
        std::mem::swap(&mut a, &mut b);
        b %= a;
    }

    a
}
```

**Time Complexity：**[**O(n^2)**](https://en.wikipedia.org/wiki/Euclidean_algorithm?oldid=1143426146#:~:text=%20in%20a%20model%20of%20computation%20suitable%20for%20computation%20with%20larger%20numbers,%20the%20computational%20expense%20of%20a%20single%20remainder%20comp)

算法步骤：

我们知道， `gcd(a, b) = gcd(b, r)`，因为 euclidean division equation: `a = b * q + r`

- 交换 `a` 和 `b` 确保 `a` > `b`
- 进入循环
    - 如果 `b = 0` 则 `gcd(a, b) = a`，  即 `gcd(a, 0) = a`, 此时我们可以结束循环。
    - 交换 `a` 和 `b`， `temp = a`， `a = b`， `b = temp`
    - 计算 ` b % a = r` ，`b = r` 

### Binary GCD Algorithm

[Binary GCD Algorithm ](https://en.wikipedia.org/wiki/Binary_GCD_algorithm) 通过位运算和减法运算来避免除法运算，从而提升运算效率。虽然复杂度没变化，但整体运算速度能提效 [60%](https://en.wikipedia.org/wiki/Binary_GCD_algorithm?oldid=1146995971#:~:text=This%20is%20the%20same%20as%20for%20the%20Euclidean%20algorithm,%20though%20a%20more%20precise%20analysis%20by%20Akhavi%20and%20Vall%C3%A9e%20proved%20that%20binary%20GCD%20uses%20about%2060%25%20fewer%20bit%20operations&oldid=1146995971)。

前置知识：

- `gcd(0, b) = b`，`gcd(a, 0) = a`
- `gcd(``*2a*``, ``*2b*``) = 2 * gcd(a, b)`
- `gcd(``*2a*``, b) = gcd(a, b)` ， `b % 2 != 0` ，即 `2` 不是公约数 
`gcd(a, ``*2b*``) = gcd(a, b)`， `a % 2 != 0`
- `gcd(a, b) = gcd(|a − b|, min(a, b))`， `b % 2 != 0` && `a % 2 != 0`

```rust
fn gcd_binary(mut u: u32, mut v: u32) -> u32 {
    
		// Base cases: gcd(n, 0) = gcd(0, n) = n
		if u == 0 {
        return v;
    }
    if v == 0 {
        return u;
    }
		
		// gcd(2^i * u, 2^j * v) = 2^k * gcd(u, v) with u, v odd and k = min(i, j)
    // 2^k is the greatest power of two that divides both u and v
    
		// shift = min(u.trailing_zeros(), v.trailing_zeros())
		let shift = (u | v).trailing_zeros();
   
		// u -> odd or v -> odd
		// gcd(2^i * u, 2^j * v) = 2^k * gcd(u, v) with u, v odd and k = min(i, j)
		u >>= shift;
    v >>= shift;
   
		// u -> odd
	  // maybe u is odd, no changed
	  // maybe v is odd, gcd(2^i * u, v) = gcd(u, v) (v is odd)
		u >>= u.trailing_zeros();

    loop {
			  // v -> odd, gcd(u, 2^j * v) = gcd(u, v) (u is known to be odd)
        v >>= v.trailing_zeros();

        if u > v {
            mem::swap(&mut u, &mut v);
        }

			  // gcd(u, v) = gcd(|v-u|, min(u, v))
        v -= u;

				// gcd(u, 0) = u
        if v == 0 {
            break;
        }
    }
		
		// gcd(2^i * u, 2^j * v) = 2^k * gcd(u, v) with u, v odd and k = min(i, j)
    u << shift
}
```

**Time Complexity：**[**O(n^2)**](https://en.wikipedia.org/wiki/Binary_GCD_algorithm?oldid=1146995971#:~:text=%20the%20asymptotic%20complexity%20of%20this%20algorithm%20is%20O(n2))

### Reference 

- [euclidean_algorithm](https://en.wikipedia.org/wiki/Euclidean_algorithm)
- [binary_gcd_algorithm](https://en.wikipedia.org/wiki/Binary_GCD_algorithm)
- [code_of_binary_gcd_algorithm](https://github.com/frewsxcv/rust-gcd/blob/df6ba81825b2cb4f1e328f2283fb0fda8f8bda27/src/lib.rs#LL32)   https://github.com/frewsxcv/rust-gcd 
- [code_of_binary_gcd_algorithm](https://github.com/uutils/coreutils/blob/71228f98e10da77e35a8c5efd6b3ac1c08c7672c/src/uu/factor/src/numeric/gcd.rs#L14)   https://github.com/uutils/coreutils
