---
title_en: Lookahead & Lookbehind RegExp Cheat Sheet
title: Lookahead & Lookbehind RegExp Cheat Sheet
date: 2022-09-01
---

# **Examples**

Given the string `foobarbarfoo`:

```plain text
bar(?=bar)     finds the 1st bar ("bar" which has "bar" after it)
bar(?!bar)     finds the 2nd bar ("bar" which does not have "bar" after it)
(?<=foo)bar    finds the 1st bar ("bar" which has "foo" before it)
(?<!foo)bar    finds the 2nd bar ("bar" which does not have "foo" before it)
```

You can also combine them:

```plain text
(?<=foo)bar(?=bar)    finds the 1st bar ("bar" with "foo" before it and "bar" after it)
```

# **Definitions**

## Look ahead positive `(?=)`

Find expression A where expression B follows:

```plain text
A(?=B)
```

## Look ahead negative `(?!)`

Find expression A where expression B does not follow:

```plain text
A(?!B)
```

## Look behind positive `(?<=)`

Find expression A where expression B precedes:

```plain text
(?<=B)A
```

## Look behind negative `(?<!)`

Find expression A where expression B does not precede:

```plain text
(?<!B)A
```

## Atomic groups `(?>)`

An atomic group exits a group and throws away alternative patterns after the *first* matched pattern inside the group (backtracking is disabled).

- `(?>foo|foot)s` applied to `foots` will match its 1st alternative `foo`, then fail as `s` does not immediately follow, and stop as backtracking is disabled

A non-atomic group will allow backtracking; if subsequent matching ahead fails, it will backtrack and use alternative patterns until a match for the entire expression is found or all possibilities are exhausted.

- `(foo|foot)s` applied to `foots` will:
  1. match its 1st alternative `foo`, then fail as `s` does not immediately follow in `foots`, and backtrack to its 2nd alternative;
  2. match its 2nd alternative `foot`, then succeed as `s` immediately follows in `foots`, and stop.
  3. then grouped as `foot` and `s`

## Non-capturing groups `(?:)`

capturing and no single groups。

example: `foobarbarfoo`

`foo(?:bar)` applied to `foobarbarfoo` will match `foobar`

`foobar` applied to `foobarbarfoo` will match `foobar`

`foo(bar)` applied to `foobarbarfoo` will match `foobar` then grouped as `foo` and `bar`

# **Some resources**

- [http://www.regular-expressions.info/lookaround.html](http://www.regular-expressions.info/lookaround.html)
- [http://www.rexegg.com/regex-lookarounds.html](http://www.rexegg.com/regex-lookarounds.html)

# **Online testers**

- [https://regex101.com](https://regex101.com/)
