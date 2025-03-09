---
title_en: 0329 Truncated division & Euclidean division
title: 0329 Truncated division & Euclidean division
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

	![red: quotient (q) and green: remainder (r) as functions of dividend (a), using truncated division](https://prod-files-secure.s3.us-west-2.amazonaws.com/84c53fa3-d037-4575-b4cf-05110cc5600a/7973fc1b-343e-44c9-bc01-d0aec90307ac/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XTB7BOV4%2F20250301%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250301T182230Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG4aCXVzLXdlc3QtMiJHMEUCIQCV%2F3Vu0%2BnRwvzUqZ%2BE%2Bq5sqLgZ47kMDHRDl7nOmplI8gIgfWjhht9%2F5H1UJrnrVGYbCyTdFyEnNwJ4y2L01yE%2Bg%2FkqiAQIp%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFaNtZUXmPoGvi9P%2ByrcA0j61rftH2lf5GKuiS8A1%2BUJ2CXL9evZPB4u8hvWAreb4uj6OEiy2oEy124fx9FTZVch%2FbDtNGsZV2kKs%2BXdWCZTNyUtSvidteeUoR43dCfNPLHJNphSwApgRkrK8lEuC5MNxKFLgsOz8r3HSE%2ByIiDk2jiSo6pQv4Plk16JPCx%2B1eXjRBB4vbjBTD9aJEq18v1rJgQZp%2FkUI5EoMk3qmAFAfHYumxhNt0W1ous7h6LXbvlQGLXr98S0xqQ2IBanCu9adfTPRce19OY8Ih5EfdrjeIhOxTAzE7AdzxuoKdh8H6onYpZUeLKFIZxG%2FvTrk9jotc4zO%2B5Mt8fI9%2BqrnLfp89Ib%2BYZxu20jdiEvmyX8P4efcS2aLQhA6d3KkizWFBFd46z3F9SDCIjWs7h%2FCDEQ48vtAqSEUlYpSTsPPuIiSOoOksj08Wfx1kW4o9wHhiu46umm9NeWeKXqAR2VbVYCbLWpPKL2okeA3i0LusmFtDmZ3DRIAyY%2Bf%2BhzsqfPNGMXTcgD9UWbGURhdWROuihUen%2BQ1XBEFS4%2FfGxeN7XeMFecHu9u8eAuwTDyyWJHpY2cbg4G9wyFE6X%2F2NRiQfib%2B83fGPUkqqX%2Fqe3lGNMIONqcmTJjPi9o3WVSMKWVjL4GOqUBDY2MHLTUtgEEsOANhHBEMkLI1F%2BhRUCI3F5rvxiM1pJyTXfOYBomLOurRfm10dctvzSEUOpvp6JVt%2Fm9GP1TSOlEi3PO7b17YK7VlNbbxdC1GbkhNXd8HjbkjAVTKQJkNYscLb2vsifUJ2ipQ0F8Cn9Nz%2F9RMMbXHBGCIDOw%2F%2BJD1Xf%2B%2F%2BSKwsY%2B6C605xrC4XI11BiTId%2BMs9f6hzZTbdCIV7Jx&X-Amz-Signature=5f9a4c2730da842b060a36c89facff40a66c9eec529d2c24b32129349afb95e3&X-Amz-SignedHeaders=host&x-id=GetObject)

- Floored division

	$$
	{\displaystyle q=\left\lfloor {\frac {a}{n}}\right\rfloor }
	$$


	$$
	{\displaystyle r=a-n\left\lfloor {\frac {a}{n}}\right\rfloor}
	$$

	- ⌊⌋ 表示 [rounding down](https://en.wikipedia.org/wiki/Rounding#Rounding_down)，向负无穷取整。

	![red: quotient (q) and green: remainder (r) as functions of dividend (a), using floored division](https://prod-files-secure.s3.us-west-2.amazonaws.com/84c53fa3-d037-4575-b4cf-05110cc5600a/7387eb21-977a-4cab-a7d1-7f3e1528f524/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666HQYZIH2%2F20250301%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250301T182231Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG4aCXVzLXdlc3QtMiJHMEUCIQDQ6Q0EYBU7YoSLOXQWhwPpi6U2eJM2ijlgt0UFIhSu7wIgP4R4%2BKlCNMqEJNtial%2BHlqa1xXbf30JFxZbe3V8r418qiAQIpv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGARnQt%2BuR87s%2BFfTircA%2FIFVqb%2F1cdSdIkhIUEjNGK5Hz9Okp%2BZoPotC6UK3KEMAoySVYvGmTENtdY5FEqzBgRcR5oqoiL72IeCcB9nh6EgitAqGJugiFxU6crr8NDW1df4IJ43OpkDcy1HGWNp5lgNuYzFCoI2SVa4Z7VImIEnm%2BMLIAYAUER9l0I70%2Fr1N1CCDtZdDIhY30e%2BIyyTOkWgr6Q8lC8Ohp0Kgx0kjLME3aHeWjv2DlxZYU%2BXjMuE5Gcv7ZzfHHGNPQuKHrnLW%2FEXsRETpHJzB%2FhImbKuFmSf88nontnbrx1i1bgMNTJ6h%2B%2F1gioYexhRq1MpuXwuadBTAZ2lsdqU%2Bux1CmGIAO%2BxLpq%2B%2FGYDqd0U7ZMzvJGk1qIYYvOYwY%2FQYg%2Bed7gMU21E2ptd06ESEObC5iCX%2BHrcGNCYM67owljeB7hBAsWkbl62S%2Fj9%2BVu9Xpz0aP%2FJ93pyVwXoshEuFgdgYvylW9mMboH0bxefDaAuSn2pFnu9qGh8QxWR0ff6PaIZ7BBHEX6U9lYK3GmV0cuEVwV95WHCfOSkf3PGcbSJCj%2BoyEA00AMOGBLB%2F9hwi2tT3y4cQ9X3wSdyldKfw4%2Fl9NbvFphlH%2BZmPPIs3nmSiZf9ApK9dt3b%2Bf%2FtKzaBqthMMNSVjL4GOqUBCpc8o4GAq5rlT8nc%2FkolnBFaFLByLN5mSsRSs1bpqIfNITlxSJxopOvGLmL1lme1zyda9%2B39F8XROqm1amqdWTa4XVhst1fM6GcpboTgBJuKovKzEfMT5GoHM0aZAZJz0hJ%2FT7nip07C%2BC9hcd6noOGZpOe1wkB3WzpIPQANEQCUZmAtcrRhG3QIV%2FAQBbxQPqlpKXSPy8SS%2BfVIH6q%2FMZ2FsPi2&X-Amz-Signature=02575bfddccbbcf46be1af154ec3b82d7dbda7968513e647b5f30092d60a2a43&X-Amz-SignedHeaders=host&x-id=GetObject)

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

		![red: quotient (q) and green: remainder (r) as functions of dividend (a), using euclidean division](https://prod-files-secure.s3.us-west-2.amazonaws.com/84c53fa3-d037-4575-b4cf-05110cc5600a/ad3eecc9-a11c-4b4a-bba0-f8ba7a3b0113/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R72Z5A23%2F20250301%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250301T182234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG4aCXVzLXdlc3QtMiJIMEYCIQDQ9hket5Nksia8ahcLc%2FDMWq4lKjSbbczBvEgji3qo8AIhAKGeO%2BtrFL7A1%2BuozK0SZpFnHHchm15Y95InShf5xE8LKogECKf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx6uJ7JayM6Gn%2BhhmQq3AMSiqjLXeTa46xeV4hqcliijwpk0HH5tlTlmQv7HTsEdOuCguMi8kwzDzK3Djj7nbZNAHywhsf0ZY0MllUfSUkkC4SgKZoJriwikJemaPmAyGOV3soYNQqPnOnfaRegCWBwfTif402U9G%2BC6qNu7GiYddZHHjzKtrRpRtZUIHr1xuaX7fCo8AE1c8B8L6FbSeOo3XFqEoTweiH9%2BcJaYpe0Pwmr2T%2BRJu0KIOtng6N7XZLf8YUwKYg5%2B6Uwkrx0EMMCRjnFyDvt8BnIeiRBO1jVjVElWERa93YwiKbLAoFJ89S8x%2FRg5SzYGsouwGXENvlWg%2B%2Fm6U5J5Yrs61R56U2bJ76OLxgnCoS%2B%2BqoJtL299VpyG5nRZGjgpnN1UusrLQ4RKBjT9yvUW7XX5AvWFzyXTGqXTQNp9GPFENMoWSF5vFrYEw5u%2BFXxp%2BGncu3%2FDgpRJ9ag5iUGK%2FVOL1t6qGhOgyecGspnqVm%2BpCRLLvLJo9YhxNtz%2FqtL2zqe945sIoSIzux555tXhKDSbHPfjORDPovguQ%2B1jKA9oyrTe6SiK2aG9jCIrYtzICYi72q%2FCjnQDqtUZ6PMBijV3Q7F6PjZP9kjIfrF9AKlVRVzS5Jj1KPix%2FdILiitXRoZozCtlYy%2BBjqkAYhu1L2hkhqGWdFhlb51hMgdOIbHX4YjNa%2FP6TGRO0dQKop8tiqOrcgBfcXdVwF5ClgH79xN7cwnWk0eNbDzWEWjlhik%2By%2BMvHYS6ZTZEGpIrYQMuecG%2Fkes%2BeXaSgBZzDTCsgYiaqR1B3nRMy3jVH0NrD%2FSEpvT9U9ORRuvQPQxDevqYfe%2FdgueMQ3Qqbd%2BmpSgCD1TZ59WM7I8z0%2FEjINLF556&X-Amz-Signature=e957932946b80e906176ca1b38995e864b484db77a9190f84ebe1744b7e85b14&X-Amz-SignedHeaders=host&x-id=GetObject)

- Rounded division

	$$
	{\displaystyle q=\operatorname {round} \left({\frac {a}{n}}\right)}
	$$


	$$
	{\displaystyle r=a-n\operatorname {round} \left({\frac {a}{n}}\right)}
	$$

	- round 表示 [rounding half to even](https://en.wikipedia.org/wiki/Rounding#Rounding_half_to_even)，四舍五入取整。

	![red: quotient (q) and green: remainder (r) as functions of dividend (a), using rounded division](https://prod-files-secure.s3.us-west-2.amazonaws.com/84c53fa3-d037-4575-b4cf-05110cc5600a/d08b6917-4851-4f97-bb63-e13db05eb7c3/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VUBIXCQH%2F20250301%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250301T182235Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG4aCXVzLXdlc3QtMiJGMEQCIFfT0Q1m6zRGs5L9drAaYc3291SH5iEpSq0QKeWRdXjoAiBIFWHY0HUeya8Nso%2FlsCKOGAw%2B6YXwRV1OhafmUXLq9iqIBAin%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMeaj727iHF2IXSt7FKtwDO%2FAgQh2B7%2BJXk6ThPZPIAcLX27IFPlgj3cfdNv6dKuxJRVD4BLicoluAWerUmRXTknzmK%2FP59pPsb%2FCmL%2FgRJ0kfFZt%2FBlJiHX4%2BJX0dpWOGaF8zbwgoMSzbYokqNbKcthvoQcByvxgq%2FdBbmwRDBj3Q5J%2Fr9mRuZLItB4hYI10XBGtF6pf6woZndE8vVhEz4lDZ6ZfG%2FyaCjENtF5d%2BB0D5sJ28S5GnxlQfbI5PdOD3%2Fg5vNdsp%2BLg8q8sqIe%2FMHzrR9Fo1GAMkMuC%2B5XFjplqgTacDLzke3%2F4BOoR%2Fqw05mqN4ZJPwnRyi9D%2FqnlE9XUhDcPS7eS%2BnGfNw75lLFOqNtIbroH8ghMR9iSvvPJ3ROqSX0jTRnYUtDlTMx5kwiWiz6X0%2FAbxVo94IdcR2SgIIsQ%2FMYeciT87eoElUm7%2F%2FfpE2cFKPQ%2F4IsDImD3zNxfYyRku8IcNZNlFttij52jDWqhosqtxM1VWTXrG55O70TiccGFSoDXkre9Ehp1FBtGzQbIj7X4ybh5qkp64s935K%2BctigOR%2BE5jzHTORyGZaNwI0TaszQ9AqcR6txEs71x0OfeHOhkfvbJ7E52jTtKte91ALhrV76s3vsNzv6voMTtDwRZiOubKFm4IwnpWMvgY6pgFV7Mcek9KzbCE%2B0L2OAgn4%2Bn7v9MRhUptVpGj67hncBGMj9iY860BKcGdJ9kU1OXZkuOuo%2F5eVfwvcs9iYDKWQUBglub%2BD%2FaZu270kIUip3ZtF4fGRCZ29pV5cVhMlVXa4kZGrsTUEBDbb0uox135I4j%2BtDWLUsGv5zocIxxjQGB4M0%2BLI1Wt4WPJw8MgLuAfWbvIMGIKg1b6k%2B6ySuQ%2B25i1W2nAI&X-Amz-Signature=888799aff71ad6306ec6078a1d01d87057cdb09eb231273854fa20624774306f&X-Amz-SignedHeaders=host&x-id=GetObject)

- Ceiled division

	$$
	{\displaystyle q=\left\lceil {\frac {a}{n}}\right\rceil }
	$$


	$$
	{\displaystyle r=a-n\left\lceil {\frac {a}{n}}\right\rceil }
	$$

	- ⌈⌉ 表示 [rounding up](https://en.wikipedia.org/wiki/Rounding#Rounding_up)，向正无穷方向取整。

		![red: quotient (q) and green: remainder (r) as functions of dividend (a), using ceiled division](https://prod-files-secure.s3.us-west-2.amazonaws.com/84c53fa3-d037-4575-b4cf-05110cc5600a/652a288e-b2b0-4cdf-8693-1a0cf8f06317/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663K7ON3LQ%2F20250301%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250301T182237Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG4aCXVzLXdlc3QtMiJIMEYCIQDQyJKtzdgKBiXX%2BX0H67KRyJrgSlLZzskeugz%2BxuXiawIhAKXjZCwaoddRGD%2ByfAuRDkqGntM2oQMrLjGNK%2B4UQXFHKogECKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzkqbFKvJ2MfM2E9V4q3ANvHwc%2BCTJtDhSqo0zd%2BGdW4Fbx7NNrRv5Y83mqzBwD0l8d7KIiltfYWm2fnThcq%2F5d2Yh2qR2DJ4yDDJPQc%2BlcRkzBhcCEb5EnpqhQbGSptfbKJYfSv4wEyySkV9A6bzkjgjgi33zV%2B%2BG9hR5VxH4P1gR2uvSnFd5tl47rwchXPzmFaFaQfJUN8gHx8Ro3aFWgz5O9tixgZys9mcZnD9O3ROswCgbgEUmmGGeBx%2BMWK2qnYbkbUQFUOHak%2Bq1pMjEvp%2B1B4qCQjcZ1mk8e9xSFC1rf%2B9tRIf0lEFdO%2BCGMCXKsiMfYiDyNw9s%2BIAGWwss56Ew12wkjfKD8uj%2F5Baf4Uw4vHCGhRSslpdha9urr3fJAWyxVUpY%2FCv8TG3gUl7Ak15VD5Tlk1cDmd%2FBXjPAh5zBuNUXHM26vNJif04qEhI5Zzthm3eCD78tKPHI%2FOqAtJjWvNQd75kAuvXTiWVirTAhyaWPp1OucYihX4VCEde6mhkEbwSxTIDtVej43h088lhkHXLsqSb4Qmq64tzDuPCjPbUQROpUTC0zHnG%2FYRj1iqCurMbKWeL%2BOHxcs5lLXRlsvYQfszWCiUad1%2BAVTdwPfYE87xFfuiqyxn7PGSju98cYs5Nx33lQ6VDDJlYy%2BBjqkAfGda7MvnDwDCmGUzGlKlpFanH65sIbnWFjTdSidgDV5BMcIe4al%2BMhUh7uDLO4cn%2Bg%2BmfyYGpLrDuw7GADliIYN2l3A0XdTXYi1h3adBL2jXTB2cK5TSQCi2gmX3g6C%2FlT9xiDBWD8j8qkEOK8OgSTnthPObmjfEG3ZYWiyToFeOmr8zJFaqTajj1Z4Ds7r%2BYZ%2BIC0oKMMjAQQdkJxuViDJwbe%2B&X-Amz-Signature=c0c7d9915b756192ecd6e0f907635b4d91c8f278b998518e33db0b63f0a64215&X-Amz-SignedHeaders=host&x-id=GetObject)


我常用的语言中：

- rust 的 `rem` 和 `div` 采用的 Truncated division 实现方案。
- rust 的 `rem_euclid` 和 `div_euclid` 采用的 Euclidean division 实现方案。
- javascript 的 `rem( % )` 和 `div ( / )`采用的 Truncated division 实现方案。

### Reference

- [wiki_modulo](https://en.wikipedia.org/w/index.php?title=Modulo&oldid=1146914850#Variants_of_the_definition)
