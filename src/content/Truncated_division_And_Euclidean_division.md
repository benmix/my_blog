---
title_en: Truncated division And Euclidean division
title:  Truncated division And Euclidean division
date: 2023-03-29
---


之前一直不太理解 rust 语言中原始类型中的数值类型取模运算（mod）和除运算（division）单独提供 `rem_euclid` 和 `div_euclid` 的原因。


数学定义：


$$
{\displaystyle {\begin{aligned}&q,r\in \mathbb {Z} \\&a=nq+r\\&|r|<|n|\end{aligned}}}
$$


在编程语言中，实现除运算根据运算取整的时候采用何种策略来区分有五种实现。

- Truncated division

    $$
    {\displaystyle q=\left[{\frac {a}{n}}\right]}
    $$


    $$
    {\displaystyle r=a-n\left[{\frac {a}{n}}\right]}
    $$

    - []  表示 [rounding toward zero](https://en.wikipedia.org/wiki/Rounding#Rounding_toward_zero)，向零取整。

    ![red:_quotient_(](/content_images/red:_quotient_(__ed4d56b0-1c18-4163-9c1c-5d33c482b888.png)

- Floored division

    $$
    {\displaystyle q=\left\lfloor {\frac {a}{n}}\right\rfloor }
    $$


    $$
    {\displaystyle r=a-n\left\lfloor {\frac {a}{n}}\right\rfloor}
    $$

    - ⌊⌋ 表示 [rounding down](https://en.wikipedia.org/wiki/Rounding#Rounding_down)，向负无穷取整。

    ![red:_quotient_(](/content_images/red:_quotient_(__874e6b99-28ce-47aa-9036-4852798c86c8.png)

- [Euclidean division](https://en.wikipedia.org/wiki/Euclidean_division)

    $$
    {\displaystyle q=\operatorname {sgn}(n)\left\lfloor {\frac {a}{\left|n\right|}}\right\rfloor ={\begin{cases}\left\lfloor {\frac {a}{n}}\right\rfloor &{\text{if }}n>0\\\left\lceil {\frac {a}{n}}\right\rceil &{\text{if }}n<0\\\end{cases}}}
    $$


    $$
    {\displaystyle r=a-|n|\left\lfloor {\frac {a}{\left|n\right|}}\right\rfloor }
    $$

    - sgn 表示符号函数。
    - ⌊⌋ 表示 [rounding down](https://en.wikipedia.org/wiki/Rounding#Rounding_down)，向负无穷方向取整。
    - ⌈⌉ 表示 [rounding up](https://en.wikipedia.org/wiki/Rounding#Rounding_up)，向正无穷方向取整。

        ![red:_quotient__](/content_images/red:_quotient____751e8738-aed1-44dd-b407-3a5ff01ed57e.png)

- Rounded division

    $$
    {\displaystyle q=\operatorname {round} \left({\frac {a}{n}}\right)}
    $$


    $$
    {\displaystyle r=a-n\operatorname {round} \left({\frac {a}{n}}\right)}
    $$

    - round 表示 [rounding half to even](https://en.wikipedia.org/wiki/Rounding#Rounding_half_to_even)，四舍五入取整。

    ![red:_quotient__](/content_images/red:_quotient____fa28b16a-8d94-431d-bd7e-875958caa8e8.png)

- Ceiled division

    $$
    {\displaystyle q=\left\lceil {\frac {a}{n}}\right\rceil }
    $$


    $$
    {\displaystyle r=a-n\left\lceil {\frac {a}{n}}\right\rceil }
    $$

    - ⌈⌉ 表示 [rounding up](https://en.wikipedia.org/wiki/Rounding#Rounding_up)，向正无穷方向取整。

        ![red:_quotient__](/content_images/red:_quotient____92dc60e0-934a-40b1-960d-4e61f4ee83fd.png)


我常用的语言中：

- rust 的 `rem` 和 `div` 采用的 Truncated division 实现方案。
- rust 的 `rem_euclid` 和 `div_euclid` 采用的 Euclidean division 实现方案。
- javascript 的 `rem( % )` 和 `div ( / )`采用的 Truncated division 实现方案。

### Reference

- [wiki_modulo](https://en.wikipedia.org/w/index.php?title=Modulo&oldid=1146914850#Variants_of_the_definition)
