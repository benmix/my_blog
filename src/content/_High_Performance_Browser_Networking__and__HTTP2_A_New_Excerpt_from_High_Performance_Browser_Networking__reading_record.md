---
title_en: “High Performance Browser Networking” and “HTTP2 A New Excerpt from High Performance Browser Networking” reading record
title: 《Hight Performance Browser Networking》和《HTTP2 A New Excerpt from High Performance Browser Networking》阅读记录
date: 2023-04-07
---

> Good developers know how things work. Great developers know why things work.

### Primer on Latency and Bandwidth

![Latency_and_bandwidth](/content_images/Latency_and_bandwidth__b6ca6f62-7a5c-4ce2-a307-b25185e3f630.png)

- 时延：从源发送数据包到接收数据包的目的地的时间
  - 传播时延：消息从发送者到接收者所需的时间，这是信号传播速度的距离的函数。传播时间由信号传播的距离和介质决定。
  - 传输时延：将所有数据包的位（bit）推送到链路所需的时间，这是数据包长度和链路数据速率的函数。传输延迟由传输链路的可用数据速率决定，与客户端和服务器之间的距离无关。
  - 处理延迟：处理数据包头、检查位级错误和确定数据包目的地所需的时间。数据包到达路由器，路由器必须检查数据包头以确定出站路由并可能对数据进行其他检查会消耗时间。很多这方面的逻辑都在硬件中完成，因此延迟非常小。
  - 队列延迟：传入数据包在队列中等待的时间，直到可以处理。如果数据包的到达速率超过了路由器的处理能力，则数据包将排队在一个接收缓冲区中。数据在缓冲区内排队的时间被称作队列延迟。

  源和目的地之间的距离越远，传播所需的时间就越长。经过的中间路由器越多，每个数据包的处理和传输延迟就越高。最后，路径上的流量负载越高，我们的数据包在接收缓冲区内被延迟的可能性就越高。

- 带宽：逻辑或物理通信路径的最大吞吐量
- 可以使用 `traceroute` 或者 `tracert` 诊断网络包在在一个 ip 网络上每一跳的延迟。
- 为了提高应用程序的性能，我们需要在明确意识到可用带宽和光速的限制的情况下构建和优化我们的协议和网络代码：如减少往返，将数据移近客户端，并构建可以通过缓存、预取和各种类似技术隐藏延迟的应用程序。

### Building Blocks of TCP

- TCP 协议（Transmission Control Protocol）提供在不可靠信道上运行可靠网络的抽象层。
- [RFC 793—Transmission Control Protocol](https://datatracker.ietf.org/doc/html/rfc793)
- [RFC 791—Internet Protocol](https://datatracker.ietf.org/doc/html/rfc791)
- [RFC 2460—IPv6](https://datatracker.ietf.org/doc/html/rfc2460)
- [RFC 1122—Communication Layers ( link layer, IP layer, and transport layer )](https://datatracker.ietf.org/doc/html/rfc1122)
- [RFC 1123—Application and Support ( application and support protocols )](https://datatracker.ietf.org/doc/html/rfc1123)
- TCP 协议保证所有发送的字节将与收到的字节相同，并且它们将以相同的顺序到达对端，TCP 协议是为了准确传输而优化。
- TCP 和 IP 协议的相互交织的历史

  我们都熟悉 `IPv4` 和 `IPv6`，但 为啥没有 `IPv1`, `IPv2`…? `IPv4` 中的 `4` 代表 1981 年 9 月发布的 `TCP/IP` 协议第 4 版。最初的 `TCP/IP` 提案将两个协议结合起来，正是 `v4` 草案将两者正式划分为单独的 RFC。因此， `IPv4` 中的 `v4` 是其与 `TCP` 关系的遗产：以前没有独立的 `IPv1` 、 `IPv2` 或 `IPv3` 协议。当工作组于 1994 年开始研究 “下一代互联网协议” `(IPng)` 时，需要一个新的版本号，但 `v5` 已经分配给另一个外部协议：“互联网流协议” `(ST)`。这是 `IPv6` 中的 `6` 的由来。

- 三次握手

  ![Three-way_handshake](/content_images/Three-way_handshake__6a44ffe0-2d23-4e46-a139-6f847d5b69e5.png)
  - SYN

    客户端挑选一个随机序列号 `x` 并发送一个 `SYN` 包，其中还可能包括额外的 TCP 标志和配置。

  - SYN ACK

    服务端将 `x` 递增 1，挑选自己的随机序列号 `y`，附加自己的标志和配置，并返回响应 `SYN ACK`。

  - ACK

    客户端将 `x`和 `y` 都增加 1，并通过发送握手中的最后一个 `ACK` 包来完成握手。

- [TCP Fast Open](https://datatracker.ietf.org/doc/html/rfc7413): `TCPFast Open (TFO)` 是一种机制，允许在 `SYN` 包内进行数据传输。对 `SYN` 包内数据有效载荷的最大尺寸受拥塞控制和底层 IP 协议切片大小的限制，只能发送某些类型的 HTTP 请求。它通过使用 TFO cookie（一个TCP选项）来工作，这是一个存储在客户端的加密 cookie，在与服务器的初始连接时设置。如果成功，服务器甚至可以在收到三方握手的最后 `ACK` 包之前就开始向客户端发送数据，从而跳过一个往返延迟，降低了数据传输开始时的延时。

  ![Fast_Open_Handshake](/content_images/Fast_Open_Handshake__c90e8280-0f14-43f4-aa7b-89653a6ee5d8.png)

  ![Fast_Open_Options](/content_images/Fast_Open_Options__ee53b399-b941-4b83-9460-cbbd33e05f2d.png)
  - TFO 的 Cookie 要求和客户端的 IP 绑定以及时间戳（针对 NAT 网络的客户端需要），且有确切的过期时间，服务端能对随时对 Cookie 作废。
  - 使用 TFO 的客户端在首次发送 SYN 包时，会出现重复发送 SYN 包。
    - 1）如果发生丢包会再次发送 SYN 包。
    - 2）客户端瞬时重启导致再次发送 SYN 包。

    此时会导致服务端收到重复的 SYN 包，这在严格的 TCP 规则里是不允许的会产生错误。故 TFO 放宽了 TCP 的规则定义，允许发送重复的 SYN 包。

  - TFO 主要在对建立连接延迟敏感的场景下使用更有效益。如果可以，应用程序应该尽可能考虑复用 TCP 连接来传输数据来获得更好的效益提升。

- [TCP 的拥塞避免与控制 ( Congestion Avoidance and Control )](https://datatracker.ietf.org/doc/html/rfc5681)
  - TCP 拥塞控制 = 慢启动 ( slow start ) + 拥塞避免 ( congestion avoidance ) + 快速重传 ( fast retransmit ) + 快速恢复 ( fast recovery )
  - [TCP Extensions for High Performance](https://datatracker.ietf.org/doc/html/rfc7323)
  - 流控制 (Flow Control)

    ![Receive_window_size___rwnd___advertisement](/content_images/Receive_window_size___rwnd___advertisement__6d75a843-5921-4ab5-81d1-7a11bd0a9060.png)
    - Receive window ( rwnd ) size: 接收方的限制，它传达了可用的缓冲区空间的大小，以容纳传入的数据。

  - TCP 滑动窗口 ( TCP Window Scaling )
    - 允许最大接收窗口大小最高到 1 GByte。TCP Window Scaling 在三向握手期间传达，并计算一个值，该值表示在未来ACK中左移16位窗口大小字段的位数。
    - 能够使用如下命令查看和启用 TCP Window Scaling 配置：

      `sysctl net.ipv4.tcp_window_scaling`

      `sysctl -w net.ipv4.tcp_window_scaling=1`

  - 慢启动 ( Slow-Start )

    ![Congestion_control_and_congestion_avoidance](/content_images/Congestion_control_and_congestion_avoidance__234e045d-15ef-4c9d-96db-67e27b15d957.png)
    - 估计客户端和服务器之间可用容量的唯一方法是通过交换数据来测量它，而这正是慢速启动的设计目的。开始时，服务器为每个 TCP 连接初始化一个新的拥塞窗口 ( cwnd ) 变量，并将其初始值设置为一个保守的、系统指定的值 ( Linux 上为 intcwnd )( [目前的规范 intcwnd 为 10 个 Segments](https://datatracker.ietf.org/doc/html/rfc6928) )。并发送数据包，每次收到 ACK 后，为 cwnd 增加一个 Segment 的发送量。从而达到指数增长。旨在迅速收敛到网络路径的可用带宽。
    - 新 TCP 连接发送的数据量最高为 rwnd 和 cwnd 之间的最小值。
    - Maximum Segment Size (MSS) ：它指的是在单个 TCP 片段中可发送的最大有效载荷量。它受 Maximum Transmission Unit ( MTU ) 大小的限制，即可以在网络上传输的IP数据包的最大尺寸。
    - Maximum Transmission Unit ( MTU )：它指可以在网络上传输的单个 IP 片段的最大有效载荷。
    - 当MTU 被设置为标准的 1500 Byte 时，MSS 通常被设置为最大的 1460 Byte。
    - Congestion window ( cwnd ) size: 发送方的限制，即发送方在重新收到客户端的确认（ACK）之前，可以有飞行中的数据量。
    - 每个TCP连接都必须经过慢速启动阶段，我们不能立即使用链路的全部容量。

      ![Congestion_window_size_growth](/content_images/Congestion_window_size_growth__d610514f-bc5e-4b34-a4f4-a27b17559802.png)

    - 因为有慢启动的存在，故存在一定延迟才达到最大带宽。Time 为慢启动的时延。

      $$
      Time = {RTT \times \left[ \log_{2} \left( \frac{N}{inital\quad cwnd} \right) \right]}
      $$

      $$
      N = \frac{双方可接收窗口的最小值的字节数(单位Byte)}{单个TCPSegment的字节数（单位Byte)(1460Bytes)}
      $$

      减少延迟的方法：
      - 减少 `RTT`，拉近双方距离，使用边缘节点或者 CDN。
      - 增大 `inital cwnd` 到 10 segments ( RFC—6928 )。

    - 对于许多 HTTP 连接来说，它们往往是短暂的和突发的，请求在达到最大窗口大小之前终止可能是正常的。许多网络应用的性能往往受到服务器和客户端之间往返时间的限制，这一因素可能无法有效改善。慢速启动限制了可用的带宽吞吐量，这时对小型传输的性能就产生了不利影响。
    - TCP 还实现了 slow-start restart ( SSR ) 机制。该机制在连接空闲一段时间后重置拥堵窗口。其原理很简单：当连接处于空闲状态时，网络条件可能发生了变化，为了避免拥堵，窗口被重置为一个 "安全" 的默认值。 SSR 会对可能会空闲一段时间的 TCP 连接的性能产生重大影响。例如，HTTP keepalive 连接。可以使用如下命令关闭：

      `sysctl net.ipv4.tcp_slow_start_after_idle`
      `sysctl -w net.ipv4.tcp_slow_start_after_idle=0`

    - 复用 TCP 可以让后面发起的 HTTP 请求跳过 slow-start 的过程，达到更小的传输时延。

  - 拥塞避免 ( congestion avoidance ) + 快速重传 ( fast retransmit ) + 快速恢复 ( fast recovery )
    - 慢启动初始化后，逐渐增加发送中的数据量，当 `cwnd < ssthresh (slow start threshold window)`时，使用慢速启动算法；当 `cwnd ≥ ssthresh`时，使用拥塞避免算法。
    - 常见拥塞控制算法：`TCP Reno (原始实现)`、`TCP NewReno`、`TCP CUBIC（Linux上默认）`或 `Compound TCP（Windows上默认）`、`TCP BBR (Google 实现)`
    - 快速重传：
      - 对端发现有数据包丢失时，立即发送重复 ACK
      - 当发送方接收到三次重复 ACK 时，触发快速重传机制，而不需等待重传计时器超时
  - [TCP Reno 算法](https://datatracker.ietf.org/doc/html/rfc5681)（慢启动 + 拥塞避免 + 快速重传 + AIMD）：
    1. 对端发现有数据包丢失时，立即发送重复 ACK；
    2. 当接收到三次重复 ACK 时，触发快速重传机制，而不需等待重传计时器超时。同时将拥塞窗口减半；
    3. 将拥塞窗口的大小设置为原来的一半，并进行快速恢复，即将拥塞窗口中未确认的数据包重新发送；
    4. 直到接收方发送新的 ACK 信息，表示已经收到所有数据包，此时按照 TCP 的拥塞控制算法调整拥塞窗口大小。
    - [Additive Increase and Multiplicative Decrease (AIMD)](https://datatracker.ietf.org/doc/html/rfc4341)：原始的快速恢复算法，当发生丢包时，将拥塞窗口大小减半，然后在每个往返过程中以固定的数量慢慢增加窗口。然而，在许多情况下，AIMD 过于保守。
  - [TCP NewReno 算法 ](https://datatracker.ietf.org/doc/html/rfc6582)（慢启动 + 拥塞避免 + 快速重传 + PPR) ：
    - [Proportional Rate Reduction for TCP ( PPR )](https://datatracker.ietf.org/doc/html/rfc6937)：比例速率降低（PRR）是RFC 6937 规定的一种快速恢复算法，其目标是提高数据包丢失时的恢复速度。
  - [TCP CUBIC 算法](https://datatracker.ietf.org/doc/html/rfc8312)：CUBIC 针对高速长距离网络的 TCP 拥塞控制算法，其主要目标是通过实时估算网络空闲带宽和延迟，优化 TCP 窗口大小的增长速率，从而提高数据传输的吞吐量和性能。通过 CUBIC 算法，网络能够更好地适应并应对拥塞和网络流量变化，从而实现更高效的数据传输。
  - [TCP BBR 算法](https://dl.acm.org/doi/10.1145/3009824)：BBR 拥塞控制算法考虑网络传递数据的速度。对于一个给定的网络连接，它使用最近对网络传输率和往返时间的测量来建立一个明确的模型，其中包括该连接最近可用的最大带宽，以及其最近的最小往返延迟。然后，BBR使用这个模型来控制它发送数据的速度和它愿意在任何时候允许进入网络的最大数据量。
    - [draft-delivery-rate-estimation](https://datatracker.ietf.org/doc/draft-cheng-iccrg-delivery-rate-estimation/02/)
    - [draft-BBR](https://datatracker.ietf.org/doc/draft-cardwell-iccrg-bbr-congestion-control/02/)

- TCP 中内置的拥塞控制具有另一个重要的性能含义：最佳的发送和接收窗口大小必须根据往返时间和它们之间的目标数据速率而变化。

  ![Transmission_gaps_due_to_low_congestion_window_size,_If_either_the_sender_or_receiver_are_frequently_forced_to_stop_and_wait_for_ACKs_for_previous_packets,_then_this_would_create_gaps_in_the_data_flow](/content_images/Transmission_gaps_due_to_low_congestion_window_size,_If_either_the_sender_or_receiver_are_frequently_forced_to_stop_and_wait_for_ACKs_for_previous_packets,_then_this_would_create_gaps_in_the_data_flow__8f99b890-e49e-49cc-8d0d-fa61d39245b3.png)
  - Bandwidth-delay product ( BDP ): 数据链路的容量和其端到端延迟的乘积。其结果是在任何时间点上可以飞行的未被认可的最大数据量。

- TCP head-of-line (HOL) blocking: 在 TCP 连接中，如果当一个数据包发生丢失时，那么所有后续的数据包都必须保留在接收方的TCP缓冲区中，直到丢失的数据包被重新传输并到达接收方。这项工作是在 TCP 层内完成的，应用对 TCP 重传或排队的数据包缓冲区没有可见性，它必须等待完整的序列才能访问数据。 当它试图从套接字中读取数据时，它只是看到一个交付延迟。这种效应被称为 TCP head-of-line (HOL) blocking。这样做的代价是在数据包到达时间中引入不可预测的延迟变化，通常被称为抖动，这可能对应用程序的性能产生负面影响。

  ![TCP_Head-of-line_blocking](/content_images/TCP_Head-of-line_blocking__db22e359-a813-4a31-b7e8-9a06975106e9.png)

- TCP Termination
  - 终止 TCP 连接的常用方法是使用 TCP 头的 FIN 标志。这种机制允许每个主机单独释放自己的连接。

    ![unknown](/content_images/unknown__dfcb5dbc-5fb3-46ff-94a9-d8d47ed6baed.png)

  - 来自发送端的 FIN：发送端决定要关闭连接，这将导致发送端向接收端发送一个 TCP 段，其中 FIN 位被设置为 1，并进入 FIN_WAIT_1 状态。在 FIN_WAIT_1 状态下，发送端等待来自接收端的带有 ACK 的 TCP 段。
  - 来自接收端的 ACK：当接收端收到发送端的 FIN 位段时，接收端立即向发送端发送 ACK。
  - 发送端等待：当处于 FIN_WAIT_1 状态时，发送端等待来自接收端的带有 ACK 的 TCP 段。当它收到 ACK 段时，发送端进入 FIN_WAIT_2 状态。在 FIN_WAIT_2 状态下，发送端等待来自接收端的 TCP 段，FIN 位设置为 1。
  - 来自接收端的 FIN：当接收端发送 ACK 段时，接收端在一段时间后向发送端发送 FIN 段（因为接收端中的一些关闭过程需要时间）。
  - 来自发送端的 ACK：当发送端收到接收端的 FIN 位段时，发送端发送 ACK 段并进入 TIME_WAIT 状态。TIME_WAIT 状态让发送端可以有机会重传 ACK，以防 ACK 丢失。发送端在 TIME_WAIT 状态下花费的时间取决于其实现，但其典型值是 30 秒、1 分钟和 2 分钟。等待超时后，连接正式关闭，发送端的所有资源（包括端口号和缓冲区数据）被释放。

![Client_TCP_Status](/content_images/Client_TCP_Status__faf6e9a0-13e6-47a7-90be-4f6b3db932bf.png)

![Server_TCP_Status](/content_images/Server_TCP_Status__402af47c-1630-4743-bc1e-a2956cd162ab.png)

- TCP 性能清单
  - 将服务器内核升级到最新版本。
  - 确保 cwnd 大小被设置为10。
  - 禁用空闲后的慢速启动。
  - 确保窗口缩放功能被启用。
  - 消除多余的数据传输。
  - 压缩传输的数据。
  - 将服务器放在离用户较近的地方，以减少往返时间。
  - 尽可能地重复使用已建立的 TCP 连接。

### Build Blocks of UDP

- [RFC—User Datagram Protocol ( UDP )](https://datatracker.ietf.org/doc/html/rfc768)
- 数据报文：一个自足的、独立的数据实体，携带足够的信息从源头到目的地节点，而不依赖节点和传输网络之间的早期变化。
- IPv4 packet header 结构

  ![I](/content_images/I__a9618ad2-fc88-4507-b448-9b516574fadf.png)

- UDP packet header 结构

  ![UDP_header__8_bytes_](/content_images/UDP_header__8_bytes___0b6c2fd7-0410-4b86-921f-3cc68815d35a.png)
  - Source Port 和 Checksum 是 UDP packet 结构中的可选字段。
  - UDP packet 的 Checksum 可以用 IP packet 的 Checksum 字段来保证。
  - 可以将错误检测和错误更正委托给上面的应用层协议。
  - UDP datagram 不能进行切片处理，UDP 发送出去每个 datagram 都携带在单个的 IP packet 里。

- UDP 的 Non-Services：
  - 不保证的消息分发：无确认 ( ack )，重传和超时
  - 不保证的有序分发：没有数据包序号，没有重排，没有队头阻塞 ( head-of-line blocking )
  - 无连接状态：没有连接建立和无需维护状态机
  - 没有拥塞控制：没有网络反馈机制
- [Network Address Translator ( NAT )](https://datatracker.ietf.org/doc/html/rfc1631)

  ![IP_Network_Address_Translator](/content_images/IP_Network_Address_Translator__3d838e60-990d-49a4-95fa-a1277ebadb9a.png)

- Reserved Private Network Ranges of IPv4

  ![Reserved_IP_ranges](/content_images/Reserved_IP_ranges__91d7def9-d5e5-4c94-a3a5-f9f9c6eface6.png)

- NAT 为了处理 UDP 因为没有状态而无法很好维护转换列表的问题，在 routing records 上增加了 UDP 超时的计时器。超时计时器取决与 NAT 设备，通过 UDP 长时间保持会话的最佳实践之一是引入 bidirectional keepalive packets，定期重置沿途的 NAT 设备中转换列表的定时器。 不幸的是，在实践中，许多 NAT 设备将类似的超时逻辑应用于 TCP 和 UDP 会话。因此，在某些情况下，TCP也需要双向保持数据包。如果碰到 TCP 连接被丢弃，那么很有可能是中间 NAT 超时的原因。
- [NAT](https://datatracker.ietf.org/doc/html/rfc2663) Traversal ( NAT 穿透 )

  NAT 设备会对每个 UDP 数据包中的源端口和地址以及 IP 数据包中的原始 IP 地址进行重写。在存在 NAT 的情况下，内部客户端不知道其公共 IP，如果应用程序需要与专用网络之外的对等体共享，则必须首先发现其公共IP地址。然而，了解公共 IP 也不足以通过 UDP 成功传输，因为任何到达 NAT 设备公共IP的数据包也必须有一个目标端口和 NAT 表中的条目，可以将其转换为内部目标主机 IP 和端口元组。如果此条目不存在，数据包就会被丢弃。因此，NAT 设备充当简单的数据包过滤器，它无法自动确定内部路由，除非用户通过端口转发或类似机制明确配置。

- 为了解决UDP和NAT中的这种不匹配，必须使用各种穿透技术（[TURN](https://datatracker.ietf.org/doc/html/rfc5766)、[STUN](https://datatracker.ietf.org/doc/html/rfc5389)、[ICE](https://datatracker.ietf.org/doc/html/rfc5245)）在双方的UDP对等体之间建立端到端连接。
- [RFC-4787](https://datatracker.ietf.org/doc/html/rfc4787) 罗列了常见的几种 NAT 过滤类型。
  - Full-Cone [Endpoint-Independent Filtering]
    - `i_addr:i_port → e_addr:e_port → any:any ==== any:any → e_addr:e_port → i_addr:i_port`
  - Address-Restricted-Cone [Address-Dependent Filtering]
    - `i_addr:i_port → e_addr:e_port → h_addr:any ==== h_addr:any → e_addr:e_port → i_addr:i_port`
    - `i_addr:i_port → e_addr:e_port → g_addr:any ==== g_addr:any → e_addr:e_port → i_addr:i_port`
  - Port-Restricted Cone [Address and Port-Dependent Filtering]
    - `i_addr:i_port → e_addr:e_port → h_addr:h_port_1 ==== h_addr:h_port_1` `→ e_addr:e_port → i_addr:i_port`
    - `i_addr:i_port → e_addr:e_port → h_addr:h_port_2 ==== h_addr:h_port_2` `→ e_addr:e_port → i_addr:i_port`
    - `i_addr:i_port → e_addr:e_port → g_addr:g_port ==== g_addr:g_port` `→ e_addr:e_port → i_addr:i_port`
  - Symmetric [Address-Dependent Filtering
     / Address and Port-Dependent Filtering] - Address-Dependent Filtering - `i_addr:i_port` `→ e_addr:e_port_1 → h_addr:any ==== h_addr:any` `→ e_addr:e_port_1 → i_addr:i_port` - `i_addr:i_port` `→ e_addr:e_port_2 → g_addr:any ==== g_addr:any` `→ e_addr:e_port_2 → i_addr:i_port` - Address and Port-Dependent Filtering - `i_addr:i_port` `→ e_addr:e_port_1 → h_addr:h_port_1 ==== h_addr:h_port_1` `→ e_addr:e_port_1 → i_addr:i_port` - `i_addr:i_port` `→ e_addr:e_port_2 → h_addr:h_port_2 ==== h_addr:h_port_2` `→ e_addr:e_port_2 → i_addr:i_port` - `i_addr:i_port` `→ e_addr:e_port_3 → g_addr:g_port ==== g_addr:g_port` `→ e_addr:e_port_3 → i_addr:i_port`
- STUN 协议提供简单的机制查询 NAT 内部设备的端口映射。处于 NAT 内部的双端可以交换各自查询的端口映射信息，建立 P2P 通信。STUN 只能用在 Full-Cone 类型的 NAT 上。

  ![STUN_query_for_public_IP_and_port](/content_images/STUN_query_for_public_IP_and_port__4c3ca827-e375-4817-a6bb-72347b45aa00.png)

- TURN 协议提供代理层服务，转发 NAT 内部双端设备的通信数据。

  ![TURN_relay_server](/content_images/TURN_relay_server__68c4f46e-6903-40db-85fa-f38aa3271ad3.png)

- ICE 协议提供协商方法，确定双端使用 TURN 还是 STUN 协议。

  ![ICE_attempts_direct,_STUN,_and_TURN_connectivity_options](/content_images/ICE_attempts_direct,_STUN,_and_TURN_connectivity_options__ddc3bbf1-85a5-4e02-873c-25d1f001715d.png)

- [RFC-5405 ](https://datatracker.ietf.org/doc/html/rfc5405)提供了构建于 UDP 上的应用层协议需要遵循的最佳实践指南
  - 应用程序必须能容忍广泛的互联网链路条件。
  - 应用程序应控制传输速率。
  - 应用应该对所有流量进行拥堵控制。
  - 应用程序应使用与 TCP 类似的带宽。
  - 应用程序应在丢失后关闭重传计数器。
  - 应用程序不应发送超过链路 MTU 的数据包。
  - 应用程序应处理数据报丢失、重复和重新排序。
  - 应用程序应能承受长达 2 分钟的交付延迟。
  - 应用程序应启用 IPv4 UDP Checksum，并且必须启用 IPv6 Checksum。
  - 在需要时，应用程序可以使用 keep alives（最小间隔15秒）。

### Transport Layer Security ( TLS )

- TLS 协议在应用层上实现，直接被包裹在传输层协议 ( TCP 或者 UDP ) 之上。在 TLS 外的观察者，只能识别加密类型和连接端点，无法查看和修改内部的数据。

  ![Transport_Layer_Security__TLS_](/content_images/Transport_Layer_Security__TLS___471dd904-1f13-473d-887c-a383a034ce34.png)

- TLS 包含三个服务
  - 加密：一种混淆从一台计算机发送到另一台计算机的内容的机制。
  - 认证：验证所提供的识别材料有效性的机制。
  - 完整性校验：检测消息篡改和伪造的机制。
- [RFC-TLS 1.0](https://datatracker.ietf.org/doc/html/rfc2246) [RFC-TLS 1.1](https://datatracker.ietf.org/doc/html/rfc4346) [DTLS](https://datatracker.ietf.org/doc/html/rfc4347)
- [RFC-TLS 1.2](https://datatracker.ietf.org/doc/html/rfc5246) [RFC-DTLS 1.2](https://datatracker.ietf.org/doc/html/rfc6347)
- [RFC-TLS 1.3](https://datatracker.ietf.org/doc/html/rfc8446) [RFC-DTLS 1.3](https://datatracker.ietf.org/doc/html/rfc9147) [Draft-TLS 1.3](https://datatracker.ietf.org/doc/html/draft-ietf-tls-rfc8446bis-07)
- TLS Handshake

  ![TLS_handshake_protocol](/content_images/TLS_handshake_protocol__7697ec61-93d7-45bf-b7e3-0816560a75e4.png)
  - TLS在可靠的传输（TCP）上运行，首先完成TCP三方握手，这需要一个 RTT。
  - TCP连接后，客户端会以纯文本形式发送协商内容，例如它支持的加密套件和 TLS 协议版本以及其他 TLS 选项。
  - 服务器选择 TLS 协议版本进行进一步通信，从客户端提供的可选加密套件中决定使用的加密套件，附加其证书（如果需要客户端认证服务端，则需要发送证书，客户端会对证书进行校验）和其他 TLS 扩展的参数，并将响应发送回给客户端。
  - 假设双方都能够协商一个共同的版本和加密套件，并且客户端对服务器提供的证书认可，然后客户端生成一个新的对称密钥，用服务器的公钥对其进行非对称加密，并发送给服务端开始切换到加密通信。到目前为止，除了使用服务器公钥加密的新对称密钥外，所有数据都以清晰的文本交换。
  - 服务器解密客户端发送的对称密钥，通过验证 MAC 检查消息的完整性，并将使用对称密钥加密后的消息返回给客户端。
  - 客户端使用之前生成的对称密钥解密消息，验证 MAC 检查消息的完整性，如果一切顺利，则可以正常发送消息数据。

- Application Layer Protocol Negotiation ( ALPN ) 扩展

  Application Layer Protocol Negotiation ( ALPN ) 是一个 TLS 扩展，在 TLS 握手中引入了对应用程序协议协商的支持，从而消除了 HTTP 升级工作流程所需的额外往返。具体来说，这个过程如下：
  - 客户端在 ClientHello 消息中附加一个新的 ProtocolNameList 字段，其中包含受支持的应用程序协议列表。
  - 服务器检查 ProtocolNameList 字段，并返回一个 ProtocolName 字段，指示所选协议作为 ServerHello 消息的一部分。

  服务器可能只响应一个协议名称，如果它不支持客户端请求的任何协议，那么它可能会选择中止连接。因此，一旦 TLS 握手完成，就会建立安全隧道，并且客户端和服务器就将使用哪种应用程序协议达成一致，他们可以立即开始通信。

- Server Name Indication ( SNI ) 扩展

  SNI 扩展使得服务器能在同一个 IP 地址上托管多个独立的网站，每个网站都有自己的 TLS 证书。SNI 允许客户端在握手开始时指示客户端试图连接的主机名（域名）。服务器可以检查 SNI 主机名，选择适当的证书，并继续进行握手。

- TLS Session Resumption

  TLS 为了减少因为握手的额外延迟和计算成本带来的性能损耗，TLS 提供了在多个连接间共享复用协商好的对称密钥的能力。
  - Session Identifiers 扩展

    SSL 2.0 中引入了第一个会话标识符恢复机制，允许服务器在我们之前看到的完整 TLS 协商期间创建和发送 32 字节的会话标识符（会话标识信息会在服务端缓存），作为其 “ServerHello” 消息的一部分。客户端可以存储会话标识符信息，并将信息包含在后续会话的 “ClientHello” 消息中，这向服务器表明，客户端仍然记住之前握手的协商密码套件和密钥，并能够重用它们。假设客户端和服务器都能够在各自的缓存中找到共享会话ID参数，那么可以进行缩写握手。否则，需要进行全新的会话协商，这将生成一个新的会话ID。

    ![Abbreviated_TLS_handshake_protocol](/content_images/Abbreviated_TLS_handshake_protocol__ee950123-7b0b-4b6a-b910-304d944473bc.png)

  - Session Tickets 扩展
    为了解决对服务器端部署 TLS 会话缓存的担忧，引入了[“会话票证” ( RFC-5077 )](https://datatracker.ietf.org/doc/html/rfc5077) 替换机制，该机制删除了服务器保持每个客户端会话状态的要求。如果客户端表示它支持会话票证，在完整 TLS 握手的最后一次交换中，服务器可以包括一个新的会话票证记录，其中包括使用仅由服务器知道的密钥加密的所有会话数据。该会话票据由客户端存储，并可以包含在随后的会话的ClientHello 消息中的 SessionTicket 扩展中。因此，所有的会话数据都只存储在客户端，但票据仍然是安全的，因为它是用只有服务器知道的密钥加密的。这简化了部署，要求客户在每次与服务器的新连接中提供会话票，直到会话票过期。
  - Pre Shared Key 扩展

    TLS 1.3 使用了 PreSharedKey 替换了 SessionTicket 扩展和 SessionId 扩展，PreSharedKey 扩展用于协商预共享密钥的身份。初次握手完成后，服务端可以给客户端发送一个包含 PSK 密钥的 `NewSessionTicket` 消息，这个密钥来自初次握手，由初次握手的 `resumption_master_secret` 生成。然后客户端能够使用这个 PSK 密钥在将来的握手中协商实现 0-RTT 的建连。如果服务端接受该 PSK，新连接的安全上下文在密码学上就与初始连接关联在一起，从初次握手中得到的密钥就会用于装载密码状态来替代完整的握手。

- Chain of Trust and Certificate Authorities
  - 公钥加密，私钥解密。私钥签名，公钥验签。
  - A 信任 B， B 给 C 担保 → A 信任 C
  - A 持有 B 的公钥，A 使用 B 的公钥验签 C 持有的签名（B 用自己的私钥对 C 的公钥签名，并颁发给 C），验证成功，则 A 信任 C 的公钥。这样子的信任链可以持续迭代验证下去，直到完成确定整条证书链路的验证。
  - 浏览器三种证书指定：
    - 手动指定证书
      每个浏览器和操作系统都提供了一个机制，让你可以手动导入任何你信任的证书。你如何获得证书并验证其真实性，完全取决于你。
    - 证书颁发机构
      证书颁发机构（CA）是一个受信任的第三方，它受到证书主体（所有者）和依赖该证书的一方的信任。
    - 浏览器和操作系统
      每个操作系统和大多数浏览器都有一个知名的证书颁发机构的列表。因此，你也相信这个软件的供应商会提供并保持一个受信任方的名单。
  - 常见的方式是浏览器指定信任指定的 CA（根 CA），然后由 CA 来验证他们签署的每个网站，并审计和验证这些证书是否被滥用或破坏。如果任何持有该 CA 证书的网站的安全性被破坏，那么该 CA 也有责任撤销被破坏的证书。

    ![CA_signing_of_digital_certificates](/content_images/CA_signing_of_digital_certificates__f7531a8e-2ef2-4aa1-97c4-514184c7f0cc.png)

- Certificate Revocation
  证书本身包含如何检查它们是否被撤销的说明。因此，为了确保信任链不被承诺，每个对等体都可以在沿着证书链向上验证查询时，按照嵌入的指示和签名来检查每个证书的状态。- Certificate Revocation List ( CRL )

          证书吊销列表（CRL）是由 [RFC-5280](https://datatracker.ietf.org/doc/html/rfc5280) 定义的，它指定了一个简单的机制来检查每个证书的状态：每个证书颁发机构都维护并定期公布一个被撤销的证书序列号列表。任何试图验证证书的人都能够下载撤销列表，并检查其中的序列号是否存在。如果存在，那么它已经被撤销。CRL 文件本身可以定期或在每次更新时发布，并可以通过 HTTP 或任何其他文件传输协议交付。该列表也是由 CA 签署的，并且通常允许在一个指定的时间间隔内被缓存。


          在有些情况下，CRL机制可能是不够的：

          - 撤销的数量越来越多，意味着 CRL 列表只会越来越长，每个客户必须检索整个序列号的列表。
          - 没有即时通知证书废止的机制。如果 CRL 在证书废止之前就被客户端缓存了，那么 CRL 将认为废止的证书有效，直到缓存过期。
      - Online Certificate Status Protocol ( OCSP )

          为了解决 CRL 机制的一些局限性，[RFC-6960 ](https://datatracker.ietf.org/doc/html/rfc6960) 引入了在线证书状态协议（OCSP），它提供了一种对证书状态进行实时检查的机制。与包含所有被撤销的序列号的 CRL 不同，OCSP 允许验证者在验证证书链的同时，直接查询证书数据库中的问题序列号。
          因此，OCSP 机制应该消耗更少的带宽，并且能够提供实时验证。然而，执行实时 OCSP 查询的要求本身就产生了几个问题：

          - CA 必须能够处理实时查询的负载。
          - CA 必须确保服务在任何时候都是正常的，并且是全球可用的。
          - 客户端在进行导航前必须对 OCSP 请求进行封锁。
          - 实时 OCSP 请求可能会损害客户的隐私，因为 CA 知道客户正在访问哪些网站。

- TLS Record Protocol

  与 IP 或 TCP 层不同，在 TLS 会话中交换的所有数据也是使用一个定义明确的协议来构建的。TLS Record Protocol 负责识别不同类型的消息（握手，警报，或通过 “Content Type” 字段的数据），以及确保和验证每个消息的完整性。

  ![TLS_record_structure](/content_images/TLS_record_structure__62179522-0bbe-4595-9afd-a64f595a5651.png)

  发送应用数据的工作流程如下：
  - 记录协议接收应用数据。
  - 收到的数据被分成块：最大 2^14 字节，或每条记录16KB。
  - 应用数据可选性地压缩。
  - Message authentication code（MAC）或 HMAC 被添加。
  - 使用协商的密码对数据进行加密。

  一旦这些步骤完成，加密的数据就被传递到TCP层进行传输。在接收端，同样的工作流程，但以相反的方式，由对等体使用协商的密码解密数据，验证 MAC，提取并交付数据给上面的应用程序。

  TLS Record Protocol 引入了一些重要的影响，你应该注意到：
  - TLS Record 的最大尺寸是 16KB
  - 每条记录包含一个 5Bytes 的 Header，一个 MAC ( SSLv3、TLS 1.0、TLS 1.1 最多 20Bytes，TLS 1.2 最多 32Bytes ) ，如果使用 block ciphers，则需要填充。
  - 为了解密和验证记录，整个记录必须可用。

  为应用程序选择正确的记录大小，这可能是一个重要的优化。由于记录框架，小记录会产生更大的开销，而大记录必须由 TCP 层交付和重新组装，然后才能由 TLS 层处理并交付到您的应用程序。

- Optimizing for TLS
  - Computational Costs

    建立和维护加密通道为两个同行带来了额外的计算成本。具体来说，首先是 TLS 握手期间使用的不对称（公钥）加密。然后，一旦在握手中建立了共享密钥，它就被用作对称密钥来加密所有 TLS 记录。正如我们之前所指出的，与对称密钥加密相比，公钥加密在计算上更昂贵，现代硬件进行了重大改进，以帮助最大限度地降低这些成本，曾经需要的额外硬件现在可以直接在 CPU 上完成。

  - Early Termination

    ![TLS_handshake_protocol](/content_images/TLS_handshake_protocol__213edaa7-111d-4388-83fa-b73e498aeaee.png)

    ![Abbreviated_TLS_handshake_protocol](/content_images/Abbreviated_TLS_handshake_protocol__fcdbaf91-d686-454d-98e1-5580a41b34ca.png)

    首先，每个 TCP 连接都以三向握手开始，这需要对 SYN / SYN-ACK 数据包进行完整的往返。之后，TLS 握手在整个过程中最多需要两次额外的往返，或者如果可以使用 TLS 会话恢复则需要一次往返（省略了对称密钥交换的 1 个 RTT）或者零次往返（TLS 1.3 通过 EarlyData 扩展 和 PSK 扩展实现了会话恢复的时候同时带上应用数据和 PSK 的能力，省略了等待 Session 验证的步骤） 。

    最坏情况下， TCP 占 1.5 个 RTT，TLS 占 2 个 RTT，TCP + TLS 共需要 3 个 RTT，（`1 RTT of TCP` + `0.5 RTT of TCP & TLS [ ACK 和 ClientHello ]` + `1.5 RTT of TLS`）

    ![Early_termination_of_client_connections](/content_images/Early_termination_of_client_connections__2c4f147b-a2b4-4e70-ba0a-048b2016ecc5.png)

    Early termination 使用就近用户的服务为用户提供服务，减少因为距离过远导致的延迟过高的情况。主要还是使用 CDN 网络和边缘计算网络为用户提供服务。边缘服务与源站服务维护着一定的长寿命、安全的连接池，并代理与原始服务器的所有传入请求和响应。事实上，作为额外的优化层，一些 CDN 提供商为客户端和源站都提供就近节点接入，两侧的端点都接入 CDN 厂商的就近节点，靠近客户端的节点将请求中继到靠近原点的节点，然后将请求路由到原点。CDN 网络中的额外跳允许流量路由经过优化后的 CDN 主干网，这有助于进一步减少客户端和原始服务器之间的延迟。

  - Session Caching and Stateless Resumption

    SSL 2.0 中引入了 TLS 会话缓存所依赖的会话标识符，并在大多数客户端和服务器中拥有广泛的支持。在使用 Session Caching 应该仔细检查并验证配置：
    - 有多个进程或工作者的服务器应该使用一个共享会话缓存。
    - 共享会话缓存的大小应根据你的流量水平进行调整。
    - 应该提供一个会话超时期。
    - 在多服务器设置中，将相同的客户 IP 或相同的 TLS 会话 ID 路由到相同的服务器是提供良好会话缓存利用率的一种方法。
    - 当 "粘性 "负载平衡不是一个选项时，应该在不同的服务器之间使用一个共享缓存，以提供良好的会话缓存利用率。
    - 检查和监测你的 SSL/TLS 会话缓存的统计数据以获得最佳性能。

  - TLS Record Size

    通过 TLS 交付的所有应用程序数据都在 TLS Record Protocol 中传输。每条记录的最大大小为 16 KB，应该保证 TLS Record 的大小能在一个 TCP Packet 中携带完成。
    - 为 IPv4 Packet Header 分配 20Bytes，为 IPv6 Packet Header 分配 40Bytes。
    - 为 TCP Packet Header 分配 20Bytes。
    - 为 TCP Options 分配 40Bytes。

    假设初始 MTU 为 1500Bytes，那么通过 IPv4 传递的 TLS 记录就有 1420Bytes，而 IPv6 则有 1400Bytes。

  - TLS Compression

    TLS 支持对 Record 进行压缩，可以考虑禁用 TLS Compression 来优化 TLS 效率。

  - Certificate-Chain Length
    减少证书链长度，这可以加快证书校验的效率。验证信任链需要浏览器遍历该链，从网站证书开始，递归地验证父级证书，直到到达受信任的根。
  - OCSP Stapling

    对于某些浏览器来说，可以进行的一项优化是 OCSP Stapling：服务器可以将来自 CA 的 OCSP 响应纳入（装订）其证书链，允许浏览器跳过在线检查。将 OCSP 的获取转移到服务器上，允许服务器缓存已签名的 OCSP 响应，并为许多客户节省额外的请求。

- HTTP Strict Transport Security (HSTS)
  HSTS 是一种安全策略机制，允许服务器通过简单的 HTTP Header 向兼容的浏览器声明访问规则，例如 `S`_`trict-Transport-Security: max-age=31536000`_。具体来说，它指示用户代理强制操作以下规则：- 所有请求都应通过 HTTPS 发送。- 所有不安全的客户端请求应在发送请求之前在客户端上自动转换为HTTPS。- 如果出现证书错误，将显示错误信息，并且不允许用户规避警告。- max-age 指定指定的 HSTS 规则集的寿命，单位是秒（例如，max-age=31536000 等于365天的缓存寿命）。- 可选的，可以指示UA记住（"pin"）指定证书链中主机的指纹，以便将来访问，有效地限制了可以验证证书的机构的范围。
- HTTP 性能检查表
  - 从TCP获得最佳性能。
  - 将TLS库升级到最新版本，并根据它们（重新）构建服务器。
  - 启用和配置会话缓存和无状态恢复
  - 监控你的会话缓存命中率并相应地调整配置。
  - 配置离用户较近的 TLS 会话，以减少往返延迟。
  - 配置你的 TLS 记录大小，以适应一个 TCP 段。
  - 确保你的证书链不会溢出初始拥塞窗口。
  - 从你的证书链中删除不必要的证书；尽量减少深度。
  - 在你的服务器上禁用 TLS 压缩。
  - 在你的服务器上配置 SNI 支持。
  - 在你的服务器上配置 OCSP Stapling。
  - 添加 HTTP Strict Transport Security header。

### Introduction to Wireless Networks

- 略过，未读

### WIFI

- 略过，未读

### Mobile Networks

- 略过，未读

### Optimizing for Mobile Networks

- 略过，未读

### **Brief History of HTTP**

- [RFC-HTTP](https://datatracker.ietf.org/doc/rfc9110/)
- HTTP/0.9

  ```bash
  GET /about/

  (hypertext response)
  (connection closed)
  ```

  One-Line Protocol
  - Client Request
    - 单行 ASCII 码字符串，以 CRLF 结尾，只能发起 GET 请求。
  - Server Response
    - ASCII 字符串流，以 HTML 返回，当文档传输完成连接也相应结束。

- [HTTP/1.1](https://datatracker.ietf.org/doc/rfc9112/)

  ```bash
  GET /index.html HTTP/1.1
  Host: website.org
  User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4)... (snip)
  Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
  Accept-Encoding: gzip,deflate,sdch
  Accept-Language: en-US,en;q=0.8
  Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.3
  Cookie: __qca=P0-800083390... (snip)

  HTTP/1.1 200 OK
  Server: nginx/1.0.11
  Connection: keep-alive
  Content-Type: text/html; charset=utf-8
  Via: HTTP/1.1 GWA
  Date: Wed, 25 Jul 2012 20:23:35 GMT
  Expires: Wed, 25 Jul 2012 20:23:35 GMT
  Cache-Control: max-age=0, no-cache
  Transfer-Encoding: chunked
  (snip)
  (connection closed)
  ```

  - Client Request
    - 请求内容保持 ASCII 编码，支持多行请求头格式。
  - Server Response
    - 相应内容支持状态码和多行响应头，以及无限制的超文本相应内容，在每次请求完成都会关闭连接。
    - HTTP/1.0 开始支持更多支持，包括 Content Encoding, Character Set Support, Multipart Types, Authorization, Caching, Proxy 等等。
    - HTTP/1.1 开始支持 KeepAlive Connection, Chunked Encoding, ByteRange Request, Enhance Caching, Request Pipelining 等等。
  - HTTP 1.1 更改了 HTTP 协议的语义，默认使用 `Connection: keepalive` 除非使用 `Connection: close` 让连接完成每次请求后就关闭掉。

- [HTTP Caching](https://datatracker.ietf.org/doc/html/rfc9111)
  - 缓存类型：
    - `(HTTP) cache`：保存请求和响应的实现，以便在后续请求中重复使用。它可以是一个共享缓存，也可以是一个私有缓存。
    - `Shared cache`：存在于源服务器和客户端之间的缓存（例如代理，CDN）。它存储一个响应，并在多个用户中重复使用。因此，开发人员应避免在共享缓存中存储要缓存的个性化内容。
    - `Private cache`：存在于客户端的缓存。它也被称为本地缓存或浏览器缓存。它可以为单个用户存储和重复使用个性化的内容。
  - 被缓存的响应的分类：
    - `Store response`：当响应可被缓存时，将响应存储在缓存中。然而，缓存的响应并不总是按原样重复使用。
    - `Reuse response` ：为后续的请求重新使用缓存的响应。
    - `Revalidate response`：询问源服务器，存储的响应是否仍然新鲜。通常情况下，重新验证是通过一个条件请求完成的。
    - `Fresh response`：表示响应是新鲜的。这通常意味着该响应可以在后续的请求中重复使用，这取决于请求指令。
    - `Stale response`：表示该响应是一个陈旧的响应。这通常意味着该响应不能按原样重复使用。缓存存储不需要立即删除陈旧的响应，因为重新验证可以将响应从陈旧变为新鲜。
  - `Age`：响应产生后的时间。它是衡量一个响应是新鲜还是陈旧的标准，一般代理服务器需要配置该响应头，告知客户端被代理服务器缓存响应消耗了多长时间，让客户端能计算缓存过期的时间（`max-age` - `age`）。
  - 配置缓存 Response 的策略 `Cache-Control` 响应头。
    - `max-age=604800` 表示生成的响应在指定的有效时间内是新鲜的，单位为`s`。
    - `s-maxage=604800` 表示生成的响应（特指共享缓存，优先级比 `max-age` 高）在指定的有效时间内是新鲜的，单位为`s`。
    - `no-cache` 表示响应可以存储在缓存中，但在每次重用前必须与源服务器进行验证，即使缓存与源服务器断开了连接。
    - `must-revalidate`表示响应可以存储在缓存中，并且可以在新鲜时重复使用。如果响应变得陈旧，在重新使用之前必须与原服务器进行验证。`must-revalidate` 和 `max-age`一起使用。HTTP 允许缓存在与源服务器断开连接时重复使用陈旧的响应。 `must-revalidate` 是一种防止这种情况发生的方法，要么存储的响应被源服务器重新验证，要么产生504（Gateway Timeout）响应。
    - `no-store`表示任何类型的缓存（私有或共享）都不应该存储这个响应。
    - `private` 表示响应只能存储在私有缓存中（例如浏览器的本地缓存）。你应该为用户个性化的内容添加私有指令，特别是为登录后收到的响应和通过 cookies 管理的会话添加。
    - `public` 表明响应可以被存储在共享缓存中。带有 `Authorization` 头字段的请求的响应不得存储在共享缓存中；但是，`public` 指令将导致此类响应存储在共享缓存中，`s-maxage` or `must-revalidate` 也会导致此类响应存储在共享缓存中。
    - `must-understand`表示只有当缓存理解了基于状态码的缓存要求时，缓存才应该存储响应。`must-understand` 应该与 `no-store` 结合起来，作为回退行为。
    - `no-transform`表示任何中间代理（不管它是否实现了缓存）都不应该转换响应内容。
    - `immutable`表示响应在新鲜时不会被更新。
    - `stale-while-revalidate` 指令表示缓存可以重用一个陈旧的响应，同时将其重新验证到缓存中。
    - `stale-if-error`表明当上游服务器产生错误时，或者当错误在本地产生时，缓存可以重复使用一个陈旧的响应。这里，错误被认为是任何状态代码为 500、502、503 或 504 的响应。
  - 缓存协商相关的请求头
    - `If-Modified-Since`：只有当所请求的资源在给定的日期之后被最后修改时，服务器才会以200 状态发回。如果该资源在此后没有被修改，则响应为 304，没有任何正文；先前请求的`Last-Modified` 响应头包含最后修改的日期。与 `If-Unmodified-Since` 不同，`If-Modified-Since` 只能在 GET 或 HEAD 中使用。
    - `If-Unmodified-Since`：只有当资源在此 HTTP 头指定的日期之后没有被修改，服务器才会接受该请求。如果资源在指定的日期后被修改，响应将是一个 `412 Precondition Failed` 的错误。
    - `If-None-Match`：对于 GET 和 HEAD 方法，只有当它没有匹配给定的 `ETag` 时，服务器将以 200 状态返回所请求的资源。对于其他方法，只有当最终存在的资源的 `ETag` 不匹配所列举的任何值时，请求才会被处理。当与 `If-Modified-Since`结合使用时，`If-None-Match`具有优先权（如果服务器支持）。
    - `If-Match` ：如果资源与列出的 `ETag` 值之一相匹配，服务器将只返回 GET 和 HEAD 方法的请求资源，或PUT和其他非安全方法的上传资源。如果条件不匹配，则返回 `412 Precondition Failed` 响应。
  - 缓存协商相关的响应头
    - `ETag`：是一个资源的特定版本的标识符。它让缓存更有效，节省带宽，因为如果内容没有改变，网络服务器不需要重新发送完整的响应。
    - `Expires`：包含日期/时间，过了这个日期/时间，响应就被视为过期。
    - `Last-Modified`：包含一个日期和时间，原服务器认为该资源最后被修改。它被用作一个验证器，以确定该资源是否与先前存储的资源相同。它比 `ETag` 头更不准确，是一种回避机制。含有 `If-Modified-Since` 或 `If-Unmodified-Since` 头的有条件请求使用这个字段。
- [HTTP 状态管理（Set-Cookie](https://datatracker.ietf.org/doc/html/rfc6265)）
- [HTTP/2](https://datatracker.ietf.org/doc/rfc9113/)
  - HTTP/2 binary framing layer

    ![HTTP_2.0_binary_framing_layer](/content_images/HTTP_2.0_binary_framing_layer__79b11376-5d03-4068-84ff-990248b06f25.png)

  - HTTP/2 streams, messages, and frames

    ![unknown](/content_images/unknown__25cc75d5-2bb3-409c-814a-f43f9ded56c0.png)

    ![HTTP_2.0_streams,_messages,_and_frames](/content_images/HTTP_2.0_streams,_messages,_and_frames__1fc10837-0726-4946-b824-7661697e230f.png)
    - Stream: 已建立连接中的双向字节流。
    - Message: 映射到逻辑消息的完整帧序列。
    - Frame: HTTP/2 中最小的通信单元，每个单元都包含一个帧头，该帧头至少标识帧所属的流。
    - 所有通信都通过单个TCP连接执行。
    - 流是连接中的虚拟通道，承载双向消息。每个流都有一个唯一的整数标识符（1，2，...，N）。
    - 该消息是一个逻辑HTTP消息，例如请求或响应，它包含一个或多个帧。
    - 帧是最小的通信单元，它携带特定类型的数据，例如HTTP标头、有效负载等。

  - HTTP/2 Connection

    ![HTTP_2.0_request_and_response_multiplexing_within_a_shared_connection](/content_images/HTTP_2.0_request_and_response_multiplexing_within_a_shared_connection__49bf9be5-9c7d-4402-a2d0-452f1ad2db33.png)
    - 并行交错多个请求，而不阻塞任何一个
    - 并行交错多个响应，不阻塞任何一个
    - 使用单个连接并行交付多个请求和响应
    - 通过消除不必要的延迟来提供更低的页面加载时间

  - Stream Prioritization

    ![HTTP_2_stream_dependencies_and_weights](/content_images/HTTP_2_stream_dependencies_and_weights__82569e2d-437b-417c-a0a8-20ea919326a4.png)
    - 一旦 HTTP 消息可以拆分为许多单独的帧，就可以优化帧交错和交付的确切顺序，以进一步提高我们应用程序的性能。为了促进这一点，每个流都有相关的权重和依赖性。
      - 每个流可以分配 1 到 256 之间的整数权重
      - 每个流可以给另一个流一个明确的依赖关系

      流依赖性和权重的组合允许客户端构建 “优先级树” 。这表达了它更希望如何收到回复。反过来，服务器可以使用这些信息通过控制CPU、内存和其他资源的分配来确定流处理的优先级，一旦响应数据可用，就分配带宽，以确保向客户端提供最佳的高优先级响应。

    - HTTP/2 中的流依赖是通过引用另一个流的唯一标识符作为其父项来声明的；如果省略，则表示该流依赖于“根流”。声明流依赖项表示，如果可能的话，应在其依赖项之前为父流分配资源——例如，请在响应 C 之前处理并交付响应 D。通过为每个流分配权重，可以对共享相同母体的流相互确定优先级：与兄弟姐妹相比，流的相对优先级与其权重成正比——例如，资源 A 的权重为 12，B 的权重为 4；A 应获得三分之二的可用资源。
    - 流依赖性和权重表达了运输偏好，而不是要求，因此不保证特定的处理或传输订单。也就是说，客户端不能强制服务器使用流优先级按特定顺序处理流。

  - One Connection Per Origin
    - 每个源一个连接的好处：
      - 更少的 Socket 占有，内存占用空间更小，连接吞吐量更好。
      - 所有流之间一致的优先级
      - 使用单个压缩上下文，更好的压缩数据
      - 由于更少的 TCP 连接，改善了对网络拥塞的影响
      - 更短的启动时间和更快的拥塞和损失恢复
      - HTTP/2 能更高效的利用 TCP 的长连特性。
  - HTTP/2 还没解决的问题：
    - Head-of-Line Blocking 的问题。
    - 如果禁用 TCP 滑动窗口，带宽延迟的影响可能会限制连接吞吐量。
    - TCP 拥塞控制带来的吞吐量降低。
  - Flow Control

    在同一 TCP 连接上多路复用多个流引入了共享带宽资源的争用。流优先级可以帮助确定交付的相对顺序，但仅靠优先级不足以控制如何在流或多个连接之间执行资源分配。为了解决这个问题，HTTP 2.0为流和连接流控制提供了一个简单的机制：
    - 流量控制是逐跳的，而不是端到端的。也就是说，代理服务可以利用它来控制资源使用，并根据自己的标准和方法实施资源分配机制。
    - 流量控制是基于 WINDOW_UPDATE 帧：接收方公布它准备在一个流和整个连接中接收多少字节。
    - 流量控制窗口大小由 WINDOW_UPDATE 帧更新，它指定了流 ID 和窗口大小增量值。
    - 流量控制是有方向性的：接收方可以选择为每个流和整个连接设置它所需要的任何窗口大小。
    - 流量控制无法禁用。当建立 HTTP/2 连接时，客户端和服务器交换 • SETTINGS 帧，双向设置流量控制窗口大小。流量控制窗口的默认值设置为 65535 字节，但接收器可以设置一个大的最大窗口大小（2^31 − 1 字节），并在收到任何数据时通过发送 WINDOW_UPDATE 帧来维护它。

    当 HTTP/2 连接建立时，客户端和服务器交换 SETTINGS 帧，这些帧在两个方向上设置流控制窗口大小。

    由于 TCP 流量控制不能区分单个 HTTP/2 连接中的许多流，它本身是不够的。因此，才有了 HTTP/2 流量控制。HTTP/2 标准没有指定任何特定的算法、值或何时发送 WINDOW_UPDATE 帧：实现者能够选择自己的算法来匹配其用例并提供最佳性能。

    除了决定交付的相对顺序的优先级之外，流量控制还可以调节 HTTP/2 连接中每个流所消耗的资源量：接收方可以对特定的流提出较低的窗口大小，以限制数据交付的速度。

  - Server Push

    HTTP/2 除了对原始请求的响应外，服务器还可以向客户端推送额外的资源，而无需客户端明确请求每个资源。

    ![Server_initiates_new_streams__promises__for_push_resources](/content_images/Server_initiates_new_streams__promises__for_push_resources__1562a1d1-c577-4417-9db0-e2123a7c2a04.png)
    - 建立HTTP/2 连接后，客户端和服务器交换 SETTINGS 帧，这可以限制双向并发流的最大数量。因此，客户端可以通过将此值设置为零来限制推送流的数量或完全禁用服务器推送。
    - 所有服务器推送流都通过 PUSH_PROMISE 帧启动，该帧除了对原始请求的响应外，还指示服务器将描述的资源推送到客户端的意图。PUSH_PROMISE 帧仅包含 promised resource 的HTTP 响应头。
    - 客户端由权限拒绝服务端的推送。服务端推送只能在响应触发时进行推送。推送的资源会到达客户端缓存，这对客户端是透明的。
    - 实现 PUSH PROMISE 的策略：
      - 应用程序可以在其应用代码中明确地启动服务器推送。这需要与正在使用的 HTTP/2 服务器紧密耦合，但为开发者提供了完全的控制。
      - 应用程序可以通过一个额外的 HTTP 头向服务器发出信号，说明它希望推送的相关资源。这就使应用程序与 HTTP/2 服务器 API 解耦，例如寻找 X-Associated-Content 头中列出要推送的资源。
      - 服务器可以自动学习相关的资源，而不依赖应用程序。服务器可以解析文件并推断出要推送的资源，也可以分析传入的流量并做出适当的决定。例如，服务器可以根据 Referrer 头收集依赖性数据，然后自动向客户端推送关键资源。
      - 使用 HTTP/2，客户端仍然可以完全控制如何使用服务器推送。客户端可以限制同时推送的流的数量；调整初始流控制窗口，以控制首次打开流时推送的数据量；完全禁用服务器推送。这些首选项通过 HTTP/2 连接开始时的 SETTINGS 帧进行通信，并可能随时更新。
    - Server Push 的性能收益：
      - 推送的资源可以由客户端缓存
      - 推送的资源可以在不同的页面上重复使用
      - 推送的资源可以与其他资源一起多路复用
      - 推送的资源可以由服务器优先排序
      - 推送的资源可以被客户端拒绝 （通过 RST_STREAM 帧）

  - [Header Compression](https://datatracker.ietf.org/doc/html/rfc7541)

    ![Differential_coding_of_HTTP_2.0_headers](/content_images/Differential_coding_of_HTTP_2.0_headers__6c069315-e741-41b9-a756-8b951a7b47a4.png)
    - HTTP/2 使用 HPACK 压缩格式压缩请求和响应头元数据，该格式使用两种简单但强大的技术：
      - 它允许通过静态霍夫曼代码对传输的头字段进行编码，从而减少其单独的传输大小。
      - 它要求客户端和服务器都维护和更新以前看到的头字段的索引列表（即建立共享压缩上下文），然后将其用作参考来有效地编码以前传输的值
    - 霍夫曼编码允许在传输时压缩单个值，之前传输的值的索引列表允许我们通过传输索引值来编码重复值，这些索引值可用于高效查找和重建完整的头键和值。

      ![HPACK:_Header_Compression_for_HTTP_2](/content_images/HPACK:_Header_Compression_for_HTTP_2__beba5d82-4b10-4fce-97fa-af56f7b9f910.png)

    - HPACK 压缩上下文包含静态和动态表：静态表在规范中定义，并提供了所有连接都可能使用的常见 HTTP 头字段列表；动态表最初是空的，并根据特定连接中交换的值进行更新。因此，通过对以前没有见过的键值使用静态哈夫曼编码，以及对已经存在于每一方的静态或动态表中的值进行索引替换，可以减少每个请求的大小。
    - 在每个请求和响应中，HTTP/2 使用客户端和服务器上的 "头表“ 来跟踪和存储以前发送的键值对，而不是重新传输相同的数据。头表在整个 HTTP/2 连接中持续存在，并由客户端和服务器增量更新。每个新的标头键值对要么被追加到现有的表格中，要么取代表格中的一个先前值。
    - HTTP/2 中请求和响应头字段的定义保持不变，只有少数例外：所有头键都是小写，请求行现在分为单独的 `:method`、`:scheme`、`:host` 和 `:path` 键值对。
    - 在连接的整个生命周期中很少变化的常见键值对（例如，用户代理、接受标头等），只需要传输一次。事实上，如果在请求之间没有标题更改（例如，请求相同的重新来源的轮询请求），则标题开销为零字节。所有标头都会自动从之前的请求中继承。

  - HTTP2 升级
    - 在 TLS 下，可以使用 ALPN 进行升级协商。
    - 在非 TLS 下，需要先进行 HTTP/1 的握手再使用 HTTP Upgrade 机制进行协议升级。

      ```bash
      GET /page HTTP/1.1
      Host: server.example.com
      Connection: Upgrade, HTTP2-Settings
      Upgrade: HTTP/2.0
      HTTP2-Settings: (SETTINGS payload)

      HTTP/1.1 200 OK
      Content-length: 243
      Content-type: text/html

      (... HTTP 1.1 response ...)

      (or)

      HTTP/1.1 101 Switching Protocols
      Connection: Upgrade
      Upgrade: HTTP/2.0

      (... HTTP 2.0 response ...)
      ```

  - Brief Introduction to Binary Framing

    ![Common_9-byte_frame_header](/content_images/Common_9-byte_frame_header__1937179e-2d51-41ff-943c-f0fda5802e86.png)
    - 所有 HTTP/2 改进的核心是新的二进制、长度前缀框架层。二进制帧提供了更紧凑的表示，在代码中处理既更容易，也更高效。一旦建立了 HTTP/2 连接，客户端和服务器通过交换帧进行通信，这些帧是协议中最小的通信单元。所有帧都共享一个共同的 9 字节头，其中包含帧的长度、其类型、标志的位字段和 31 位流标识符。
    - 24 位 Length 字段表示允许单个帧可以携带 2^24 - 1 字节的数据。HTTP/2 标准将数据帧的默认最大有效负载大小设置为每帧 2^14 字节（~16KB），并允许客户端和服务器协商更高的值。更大并不总是更好：较小的帧尺寸可以实现有效的多路复用，并最大限度地减少线头块。
    - 8 位 Type 字段决定了帧的格式和语义。。
    - 8 位 Flags 字段允许不同的帧类型定义特定于帧的消息标志。
    - 1 位 R 字段始终设置为 0。
    - 31 位 Stream Identifier 可唯一标识单个 HTTP/2 流。
    - Frame Type：

      `DATA`：用于传输HTTP消息主体

      `HEADERS`：用于通信流的其他标头字段

      `PRIORITY`：用于分配或重新分配引用资源的优先级

      `RST_STREAM`：用于发出流异常终止的信号

      `SETTINGS`：用于向有关两个端点如何通信的配置数据发出信号

      `PUSH_PROMISE`：用于发出创建流并提供引用资源的承诺信号

      `PING` ：用于测量往返时间并执行“保活” 检查

      `GOAWAY`：用于通知对等体停止为当前连接创建流，允许服务器向客户端指示最后处理的流 ID，这消除了许多请求竞赛，并允许浏览器智能地重试或取消传输中的请求。

      `WINDOW_UPDATE`：用于在每流或每连接的基础上实现流量控制

      `CONTINUATION`：用于继续一系列头块片段

    - Initiating a New Stream

      ![HEADERS_frame_with_optional_priority_](/content_images/HEADERS_frame_with_optional_priority___381ebd8c-f317-40a8-98f7-642833985cfd.png)
      - 客户端通过发送 HEADERS 帧来启动新请求，其中包括具有新流 ID 的公共标头、可选的 31 位优先级值以及其有效负载中的一组 HTTP 标头键值对。
      - 服务器通过发送 PUSH_PROMISE 帧来启动推送流，该帧与 HEADERS 帧完全相同，只是它带有一个额外的“承诺流 ID”，而不是优先级值。
      - 由于双方都可以启动新流，流计数器是偏移的：客户端发起的流具有偶数的流 ID，服务器发起的流具有奇数的流 ID。这种偏移消除了服务器和客户端之间流 ID 中的冲突：每个都保留一个简单的计数器，并在启动新流时增加计数器。

    - Sending Application Data

      ![DATA_frame](/content_images/DATA_frame__a4bc8793-fb49-44f0-a20d-be260108602d.png)
      - 一旦创建了新流并发送了 HTTP 头，数据帧将用于发送应用程序有效负载（如果存在）。有效负载可以在多个数据帧之间拆分，最后一帧通过在帧头中切换 END_STREAM 标志来指示消息的结束。
      - 没有对有效负载执行额外的编码或压缩。编码机制的选择被推迟到应用程序或服务器——例如，纯文本、gzip 压缩或图像或视频压缩格式的选择。说到整个帧由常见的 8 字节头组成，然后是 HTTP 有效负载。
      - 从技术上讲，数据帧的长度字段允许每帧高达 2^16 - 1（65535）字节的有效载荷。然而，为了减少行头阻塞，HTTP/2 标准要求数据帧不超出每帧2^14 - 1（16383）字节。超过这个阈值的消息必须分解为多个数据帧。

- [HTTP/3](https://datatracker.ietf.org/doc/rfc9114/)

  略

### **Event Stream Protocol**

SSE 事件流作为流式 HTTP 响应交付：客户端启动常规 HTTP 请求，服务器以自定义 “_text/event-stream_” 内容类型响应，然后流式传输 UTF-8 编码的事件数据。

```bash
GET /stream HTTP/1.1
Host: example.com
Accept: text/event-stream

HTTP/1.1 200 OK
Connection: keep-alive
Content-Type: text/event-stream
Transfer-Encoding: chunked
retry: 15000

data: First message is a simple string.

data: {"message": "JSON payload"}

event: foo
data: Message of type "foo"

id: 42
event: bar
data: Multi-line message of
data: type "bar" and id "42"

id: 43
data: Last message, id "43"
```

### WebSocket

[WebSocket RFC6455](https://datatracker.ietf.org/doc/html/rfc6455)

![High-level_browser_networking_APIs,_protocols,_and_services](/content_images/High-level_browser_networking_APIs,_protocols,_and_services__44b3b787-71a2-4124-afb3-8e8b95dbc944.png)

- WebSocket 可以在客户端和服务器之间实现双向、面向消息的文本和二进制数据流。
  - 连接协商和同源策略执行
  - 与现有HTTP基础设施的互操作性
  - 面向消息的通信和高效的消息框架
  - 子协议协商和可扩展性
- Binary Framing Layer

  ![WebSocket_frame:_2–14_bytes_+_payload](/content_images/WebSocket_frame:_2–14_bytes_+_payload__d0da0e38-69b4-472e-8a10-434016d9e1ec.png)
  - Frame：最小的通信单元，每个单元都包含一个可变长度的帧头和一个可能携带全部或部分应用程序消息的有效负载。
    - 每个帧（FIN）的第一个位表示该帧是否是消息的最终片段。一条消息可能只由一帧组成。
    - 操作码（4位）表示传输帧的类型：用于传输应用程序数据的文本（1）或二进制（2）或控制帧，如连接关闭（8）、ping（9）和pong（10），用于连接活度检查。
    - 掩码位指示有效负载是否被掩码（仅适用于从客户端发送到服务器的消息）。
    - 有效负载长度表示为可变长度字段：
      - 如果0-125，那么这就是有效载荷长度。
      - 如果是126，则接下来 2 个字节表示 16 位无符号整数的帧长度。
      - 如果是 127，则接下来 8 个字节表示 64 位无符号整数的帧长度。
    - 掩码位包含用于屏蔽有效负载的 32 位值。
    - 如果客户端和服务器在建立连接时协商了扩展，则有效负载包含应用程序数据和自定义扩展数据。
  - 所有客户端启动的帧的有效负载都使用帧头中指定的值进行屏蔽：这可以防止客户端上执行的恶意脚本对可能不理解 WebSocket 协议的中介执行[缓存中毒攻击](http://w2spconf.com/2011/papers/websocket.pdf)。
  - Message：映射到逻辑应用程序消息的完整帧序列。

- WebSocket Upgrade
  - WebSocket 协议提供了许多强大的功能：面向消息的通信、自己的二进制框架层、子协议协商、可选协议外部紧张关系等。因此，在交换任何消息之前，客户端和服务器必须协商适当的参数来建立连接。
  - WebSocket Upgrade 复用 HTTP Upgrade 机制并扩展了自定义的 WebSocket Headers。
    - `Sec-WebSocket-Version`

      由客户端发送，以指示其想要使用的 WebSocket 协议的版本（RFC6455为“13”）。如果服务器不支持客户端版本，那么它必须回复支持的版本列表。

    - `Sec-WebSocket-Key`

      客户端发送的自动生成密钥，作为对服务器的“挑战”，以证明服务器支持请求的协议版本。

    - `Sec-WebSocket-Accept`

      包含 Sec-WebSocket-Key 的签名值的服务器响应，证明它理解请求的协议版本。

    - `Sec-WebSocket-Protocol`

      用于协商应用程序子协议：客户端通告支持的协议列表；服务器必须使用单个协议名称进行回复。

    - `Sec-WebSocket-Extensions`

      用于协商用于此连接的 WebSocket 扩展：客户端广告显示支持的扩展，服务器通过返回相同的标头来确认一个或多个扩展。

    ```bash
    GET /socket HTTP/1.1
    Host: thirdparty.com
    Origin: http://example.com
    Connection: Upgrade
    Upgrade: websocket
    Sec-WebSocket-Version: 13
    Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
    Sec-WebSocket-Protocol: appProtocol, appProtocol-v2
    Sec-WebSocket-Extensions: x-webkit-deflate-message, x-custom-extension

    HTTP/1.1 101 Switching Protocols
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
    Sec-WebSocket-Protocol: appProtocol-v2
    Sec-WebSocket-Extensions: x-custom-extension
    ```

- WebSocket 性能优化清单
  - 使用安全的WebSocket（WSS over TLS）进行可靠的部署。
  - 密切关注 polyfill 性能（如有必要）。
  - 利用子协议协商来确定应用程序协议。
  - 优化二进制有效载荷以最小化传输大小。
  - 考虑压缩 UTF-8 内容，以最小化传输大小。
  - 为收到的二进制有效负载设置正确的二进制类型。
  - 监控客户端上的缓冲数据量。
  - 拆分大型应用程序消息，以避免行头阻塞。
  - 在适用的情况下利用其他运输工具。

### WebRTC

- [WebRTC](https://webrtc.org/)

  ![WebRTC_protocol_stack](/content_images/WebRTC_protocol_stack__19fe6d45-073e-4cd0-9df4-17d0c6aa71b7.png)
  - ICE: Interactive Connectivity Establishment ([RFC 8845](https://datatracker.ietf.org/doc/html/rfc8445) [RFC 8839](https://datatracker.ietf.org/doc/html/rfc8839) [RFC 8863](https://datatracker.ietf.org/doc/rfc8863/))
    - [STUN: Session Traversal Utilities for NAT (RFC 8489)](https://datatracker.ietf.org/doc/html/rfc8489)
    - [TURN: Traversal Using Relays around NAT (RFC 8656)](https://datatracker.ietf.org/doc/html/rfc8656)
  - [SDP: Session Description Protocol (RFC 8866)](https://datatracker.ietf.org/doc/html/rfc8866)
  - [DTLS: Datagram Transport Layer Security (RFC 9147)](https://datatracker.ietf.org/doc/html/rfc9147)
  - [SCTP: Stream Control Transport Protocol (RFC 9260)](https://datatracker.ietf.org/doc/html/rfc9260)
  - [SRTP: Secure Real-Time Transport Protocol (RFC 3711)](https://datatracker.ietf.org/doc/html/rfc3711)

- ICE、STUN 和 TURN 对于通过 UDP 建立和维护 p2p 连接是必要的。DTLS 用于保护 p2p 之间的所有数据传输；加密是 WebRTC 的强制性功能。最后，SCTP 和 SRTP 是应用层协议，用于多路复用不同的流，提供拥塞和流量控制，并在 UDP 之上提供部分可靠的交付和其他附加服务。SDP 是一种用于协商对等连接参数的数据格式。 SDP 不存在于 WebRTC 网络协议栈中的任何一层。
- [Audio and Video Engines](https://w3c.github.io/webrtc-pc/)

  ![WebRTC_audio_and_video_engines](/content_images/WebRTC_audio_and_video_engines__94cd6011-0424-4e48-b2fc-928c265516b1.png)

- [Acquiring Audio and Video with getUserMedia
  ](https://www.w3.org/TR/mediacapture-streams/)[WebRTC stats](https://w3c.github.io/webrtc-stats/)

      ![MediaStream_carries_one_or_more_synchronized_tracks](/content_images/MediaStream_carries_one_or_more_synchronized_tracks__63ae77b5-88ab-44de-94cd-a46b1c6696d1.png)

- RTCPeerConnection API

  ![RTCPeerConnection_API](/content_images/RTCPeerConnection_API__3e46bd46-c43c-4c4c-a44f-4336d90b23fc.png)
  - RTCPeerConnection 管理着穿越 NAT 的整个 ICE 工作流程。
  - RTCPeerConnection 在对等体之间发送自动（STUN）保活信号。
  - RTCPeerConnection 保持对本地流的跟踪。
  - RTCPeerConnection 保持对远程流的跟踪。
  - RTCPeerConnection 根据需要触发自动的流重新协商。
  - RTCPeerConnection 提供必要的 API 来发起连接，接受响应，允许我们查询连接的当前状态，等等。

- DataChannel API
  - DataChannel API 能够在对等体之间交换任意的应用数据，具有可定制的底层传输的交付属性。每个 DataChannel 都可以被配置为提供以下功能：
    - 可靠的或部分可靠地发送消息
    - 有序的或部分有序地发送消息
  - 我们也可以通过指定最大的重传次数或设置重传的时间限制，将通道配置为 "部分可靠"。
- WebRTC 内置的 ICE 协议执行必要的路由和连接检查。在此之后，需要进行通知的交付（信号）和初始会话协商，这些常常使用信令协议（ SIP ）进行协商，传输协议常常使用 WebSocket 。
- 常见信令协议
  - Session Initiation Protocol (SIP)：应用程序级信令协议，广泛用于 IP 网络上的 IP 语音（VoIP）和视频会议。
  - Jingle: XMPP 协议的信令扩展，用于 IP 语音的会话控制和 IP 网络视频会议。
  - ISDN User Part (ISUP): 全球许多公共交换电话网络用于设置电话的信令协议。
- Session Description Protocol (SDP)

  WebRTC 使用会话描述协议（SDP）来描述对等连接的参数。SDP 本身不提供任何媒体；相反，它用于描述“会话配置文件”，该配置文件代表连接的属性列表：要交换的媒体类型（音频、视频和应用程序数据）、网络传输、IP 端口信息、使用的编解码器及其设置、带宽信息和其他元数据。

  ```bash
  (... snip ...)
      m=audio 1 RTP/SAVPF 111 ...
      a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level
      a=candidate:1862263974 1 udp 2113937151 192.168.1.73 60834 typ host ...
      a=mid:audio
      a=rtpmap:111 opus/48000/2
      a=fmtp:111 minptime=10
      (... snip ...)
  ```

  ![Offer_answer_SDP_exchange_between_peers](/content_images/Offer_answer_SDP_exchange_between_peers__6166d0d6-f7e3-4691-afb1-9f6283287941.png)

- Interactive Connectivity Establishment (ICE)
  ICE 协商后，且完成 SDP 信息交换（ 此时交换的 SDP 信息中包含 ICE 协商的 candidates）后，便可开始确认 p2p 连接。- ICE 代理向操作系统查询本地 IP 地址。- 如果配置，ICE 代理会查询外部 STUN 服务器以检索对端的公共 IP 和端口元组。- 如果配置，ICE 代理将附加 TURN 服务器作为最后的候选。如果点对点连接失败，数据将通过指定的中介间中继。

      ```javascript
      var ice = {
        iceServers: [
          { url: "stun:stun.l.google.com:19302" },
          { url: "turn:user@turnserver.com", credential: "pass" },
        ],
      };
      var signalingChannel = new SignalingChannel();
      var pc = new RTCPeerConnection(ice);

      navigator.getUserMedia({ audio: true }, gotStream, logError);

      function gotStream(stream) {
        pc.addstream(stream);

        pc.createOffer(function (offer) {

          pc.setLocalDescription(offer);
        });
      }

      pc.onicecandidate = function (evt) {
        if (evt.target.iceGatheringState == "complete") {
          pc.createOffer(function (offer) {
            console.log("Offer with ICE candidates: " + offer.sdp);

            signalingChannel.send(offer.sdp);
          });
        }
      };
      ```

      - 应用本地会话描述：启动 ICE 收集过程。
      - 订阅 ICE 活动，并收听 ICE 收集完成情况。
      - 重新生成 SDP offer（现在与已发现的 ICE candidates 一起）。

- Incremental Provisioning (Trickle ICE)
  我们没有等待 ICE 收集过程完成，而是依靠信令通道向另一个对等体提供增量更新，这有助于加速该过程。先发送 offer 或 answer，待 ICE 完成 candidate 收集完后再发送 candidate。

      ```javascript
      var ice = {
        iceServers: [
          { url: "stun:stun.l.google.com:19302" },
          { url: "turn:user@turnserver.com", credential: "pass" },
        ],
      };

      var pc = new RTCPeerConnection(ice);

      navigator.getUserMedia({ audio: true }, gotStream, logError);

      function gotStream(stream) {
        pc.addstream(stream);

        pc.createOffer(function (offer) {
          pc.setLocalDescription(offer);

          signalingChannel.send(offer.sdp);
        });
      }

      pc.onicecandidate = function (evt) {
        if (evt.candidate) {
          signalingChannel.send(evt.candidate);
        }
      };

      signalingChannel.onmessage = function (msg) {
        if (msg.candidate) {
          pc.addIceCandidate(msg.candidate);
        }
      };
      ```

      - 发送 SDP offer，而不发送 ICE candidate
      - 当本地 ICE 代理发现可用的 ICE candidate 时，发送该 candidate
      - 注册远程 ICE candidate 并开始连接检查

- Tracking ICE Gathering and Connectivity Status

  ```javascript
  var ice = {
    iceServers: [
      { url: "stun:stun.l.google.com:19302" },
      { url: "turn:user@turnserver.com", credential: "pass" },
    ],
  };
  var pc = new RTCPeerConnection(ice);

  logStatus("ICE gathering state: " + pc.iceGatheringState);

  pc.onicecandidate = function (evt) {
    logStatus("ICE gathering state change: " + evt.target.iceGatheringState);
  };

  logStatus("ICE connection state: " + pc.iceConnectionState);

  pc.oniceconnectionstatechange = function (evt) {
    logStatus("ICE connection state change: " + evt.target.iceConnectionState);
  };
  ```

  - iceGatheringState
    - `new: 该对象刚刚创建，还没有发生联网。`
    - `gathering: ICE 代理正在收集本地 candidates。`
    - `complete: ICE 代理已经完成了收集过程。`
  - iceConnectionState
    - `new: ICE 代理正在收集候选人和/或等待远程候选人的提供。`
    - `checking: ICE 代理在至少一个组件上收到了远程 candidates，并正在检查 candidates ，但尚未找到连接。除了检查外，它可能仍在收集。`
    - `connected: ICE 代理已经为所有组件找到了可用的连接，但仍在检查其他 candidates，看看是否有更好的连接。它可能仍然在收集。`
    - `completed: ICE 代理已完成收集和检查，并找到了所有组件的连接。`
    - `failed: ICE 代理已完成对所有 candidates 检查，但未能找到至少一个组件的连接。可能已经找到了一些组件的连接。`
    - `disconnected: 一个或多个组件的有效性检查失败。这比失败更激进，在一个不稳定的网络上可能会间歇性地触发（并在不采取行动的情况下自行解决）。`
    - `closed: ICE 代理已关闭，不再响应 STUN 请求。`

      ![ICE_agent_connectivity_states_and_transitions](/content_images/ICE_agent_connectivity_states_and_transitions__4ae0036c-c78a-43b7-9a04-8f3b3c1825c1.png)

- Requesting to a WebRTC connection

  ```javascript
  <video id="local_video" autoplay></video>
  <video id="remote_video" autoplay></video>
  <script>
  	var ice = {
  	  iceServers: [
  	    { url: "stun:stunserver.com:12345" },
  	    { url: "turn:user@turnserver.com", credential: "pass" },
  	  ],
  	};
  	var signalingChannel = new SignalingChannel();
  	var pc = new RTCPeerConnection(ice);

  	navigator.getUserMedia({ audio: true, video: true }, gotStream, logError);

  	function gotStream(evt) {
  	  pc.addstream(evt.stream);

  	  var local_video = document.getElementById("local_video");

  	  local_video.src = window.URL.createObjectURL(evt.stream);

  	  pc.createOffer(function (offer) {
  	    pc.setLocalDescription(offer);
  	    signalingChannel.send(offer.sdp);
  	  });
  	}

  	pc.onicecandidate = function (evt) {
  	  if (evt.candidate) {
  	    signalingChannel.send(evt.candidate);
  	  }
  	};

  	signalingChannel.onmessage = function (msg) {
  	  if (msg.candidate) {
  	    pc.addIceCandidate(msg.candidate);
  	  }
  	};

  	pc.onaddstream = function (evt) {
  	  var remote_video = document.getElementById("remote_video");
  	  remote_video.src = window.URL.createObjectURL(evt.stream);
  	};

  	function logError() { ... }
  </script>
  ```

- Responding to a WebRTC connection

  ```javascript
  <video id="local_video" autoplay></video>
  <video id="remote_video" autoplay></video>
  <script>
    var signalingChannel = new SignalingChannel();
    var pc = null;
    var ice = {
      iceServers: [
        { url: "stun:stunserver.com:12345" },
        { url: "turn:user@turnserver.com", credential: "pass" },
      ],
    };

  	signalingChannel.onmessage = function (msg) {
      if (msg.offer) {
        pc = new RTCPeerConnection(ice);
        pc.setRemoteDescription(msg.offer);
        navigator.getUserMedia({ audio: true, video: true }, gotStream, logError);
      } else if (msg.candidate) {
        pc.addIceCandidate(msg.candidate);
      }
    };

  	function gotStream(evt) {
      pc.addstream(evt.stream);
      var local_video = document.getElementById("local_video");
      local_video.src = window.URL.createObjectURL(evt.stream);
      pc.createAnswer(function (answer) {
        pc.setLocalDescription(answer);
        signalingChannel.send(answer.sdp);
      });
    }

  	pc.onicecandidate = function (evt) {
      if (evt.candidate) {
        signalingChannel.send(evt.candidate);
      }
    };

  	pc.onaddstream = function (evt) {
      var remote_video = document.getElementById("remote_video");
      remote_video.src = window.URL.createObjectURL(evt.stream);
    };

  	function logError() { ... }
  </script>
  ```

- Delivering Media and Application Data
  - Datagram Transport Layer Security (DTLS)：协商加密密钥和加密媒体数据和加密应用数据。
  - Secure Real-Time Transport (SRTP) ：传输音频和视频流数据。
  - Stream Control Transport Protocol (SCTP) ：传输应用数据。
- DTLS 被刻意设计为尽可能与 TLS 相似。事实上，DTLS 是 TLS，但修改次数很少，以使其与 UDP 提供的数据报传输兼容。具体来说，DTLS 解决了以下问题：
  1. TLS 需要可靠的、有序的、不受碎片影响的握手记录的传递来协商隧道。
  2. 如果记录在多个数据包中被分割，TLS 的完整性检查可能会失败。
  3. 如果记录的处理不符合顺序，TLS 的完整性检查可能会失败。

  ![DTLS_handshake_records_carry_sequence_and_fragment_offsets](/content_images/DTLS_handshake_records_carry_sequence_and_fragment_offsets__c0e383b8-eab0-4066-a898-cf38a58b213d.png)

  DTLS 扩展了基本的 TLS 记录协议，为每个握手记录增加了一个明确的片段偏移和序列号。这解决了按顺序交付的要求，并允许大的记录被分割成不同的数据包，并由另一个对等体重新组装起来。DTLS 握手记录是按照 TLS 协议规定的确切顺序传输的，任何其他顺序都是错误的。最后，DTLS 也必须处理数据包丢失的问题：如果在预期的时间间隔内没有收到回复，双方都使用简单的计时器来重传握手记录。记录序列号、偏移量和重传计时器的组合使 DTLS 能够通过 UDP 进行握手。为了完成这个过程，两个网络对等体都产生了自签名的证书，然后遵循常规的 TLS 握手协议。因此，没有证书链需要验证。DTLS提供加密和完整性，但将身份验证推迟到应用程序。

  最后，在握手要求得到满足的情况下，DTLS 增加了两条重要规则，以考虑常规记录可能出现的碎片化和乱序处理：
  - DTLS 记录必须适合于一个 UDP 网络数据包。
  - 必须使用块状密码对记录数据进行加密。

  一个普通的 TLS 记录的大小可以达到 16KB。TCP 处理碎片和重新组合，但 UDP 不提供这种服务。因此，为了保留 UDP 协议的失序和尽力的语义，每个携带应用数据的 DTLS 记录必须适合于一个 UDP 包。同样地，stream ciphers 也是不允许的，因为它们隐含地依赖于记录数据的无序传递。

- Delivering Media with SRTP and SRTCP
  - Secure Real-time Transport Protocol (SRTP)：用于通过 IP 网络交付实时数据（如音频和视频）的标准化格式的安全配置文件。

    ![SRTP_header__12_bytes_+_payload_and_optional_fields_](/content_images/SRTP_header__12_bytes_+_payload_and_optional_fields___8839a499-b55c-4d64-80b4-c620b27638d0.png)
    - 每个 SRTP 数据包都带有一个自动递增的序列号，这使得接收方能够检测并核算媒体数据的失序交付。
    - 每个 SRTP 数据包都带有一个时间戳，它代表媒体有效载荷的第一个字节的采样时间。这个时间戳用于同步不同的媒体流--例如，音频和视频轨道。
    - 每个 SRTP 数据包都有一个 SSRC 标识符，这是一个唯一的流 ID，用于将每个数据包与单个媒体流联系起来。
    - 每个 SRTP 数据包可以包含其他可选的元数据。
    - 每个 SRTP 数据包都携带一个加密的媒体有效载荷和一个验证标签，用于验证所传送数据包的完整性。
    - SRTP 数据包提供了媒体引擎所需的所有基本信息，以便实时播放流。然而，控制单个 SRTP 数据包如何交付的责任落在了 SRTCP 协议上，该协议为每个媒体流实现了一个单独的带外反馈通道。SRTCP 跟踪发送和丢失的字节和数据包的数量、最后收到的序列号、每个 SRTP 数据包的到达间抖动，以及其他 SRTP 统计数据。然后，周期性地，两个对等体交换这些数据，并使用这些数据来调整每个数据流的发送速率、编码质量和其他参数。

  - Secure Real-time Control Transport Protocol (SRTCP)：控制协议的安全配置文件，用于交付 SRTP 流的发送方和接收方的统计数据和控制信息。

- Delivering application data with SCTP
  - DataChannel 依赖于流控制传输协议（SCTP），它运行在对等体之间建立的 DTLS 隧道之上。
  - DTLS 的使用已经满足了应用数据都在记录的有效载荷中进行了加密，保密性和完整性得到了保证。UDP 提供了不可靠的、无序的数据报传送。SCTP 提供了类似 TCP 的可靠传送、信道复用、优先级支持、消息分片等等。

    ![Comparing_TCP_vs._UDP_vs._SCTP](/content_images/Comparing_TCP_vs._UDP_vs._SCTP__428c4987-7f86-4592-b48b-f2f169d576d6.png)

  - SCTP 是一个传输协议，类似于 TCP 和 UDP，它可以直接运行在 IP 协议之上。然而，在WebRTC 的情况下，SCTP 是通过一个安全的 DTLS 隧道，而 DTLS 本身是在 UDP 之上运行的。
  - 两个端点之间的单一 SCTP 关联可以携带多个独立的数据流，每个数据流通过传输应用消息进行通信。反过来，每个消息可能被分割成一个或多个块（最小的 SCTP 包），在 SCTP 数据包中传递，然后在另一端被重新组合起来。

    ![SCTP_header_and_data_chunk](/content_images/SCTP_header_and_data_chunk__c98d9410-39ca-4392-b5fb-b7bc0192b18f.png)

    一个 SCTP 数据包由一个普通的报头和一个或多个控制或数据块组成。头部携带 12 个字节的数据，用于识别源端口和目的端口，随机生成的当前 SCTP 关联的验证标签，以及整个数据包的校验和。在报头之后，数据包携带一个或多个控制或数据块；前面的图显示了一个带有单个数据块的 SCTP 数据包：

    所有的数据块都有一个0×0的数据类型。
    - unordered（U）位表示这是否是一个无序的数据块。
    - B 和E 位用来表示一个分成多个块的消息的开始和结束：
      - B=1，E=0 表示一个消息的第一个片段；
      - B=0，E=0 表示一个中间片段；
      - B=0，E=1 表示最后一个片段；
      - B=1，E=1 表示一个没有片段的消息。
    - Length 表示数据块的大小，包括头，即 16 字节的数据块头，加上有效载荷数据的大小。
    - Transmission sequence number（TSN）是一个 32 位数字，由 SCTP 内部使用，用于确认数据包的接收和检测重复交付。
    - Stream identifier 表示该数据块所属的流。
    - Stream sequence number 是相关流的自动递增的消息号码。碎片化的消息携带相同的序列号。
    - Payload protocol identifier（PPID）是一个由应用程序填写的自定义字段，用于传达有关传输块的额外元数据。

  - DataChannel 使用 SCTP 头中的 PPID 字段来通信传输的数据类型：UTF-8 为 0×51，binary 为 0×52。
  - SCTP 为每个数据块增加了 28 字节的开销： 12 个字节为公共头，16 个字节为数据块头，后面是应用有效载荷。

- DataChannel API

  ```javascript
  function handleChannel(chan) {
    chan.onerror = function (error) {...};
    chan.onclose = function () {...};
    chan.onopen = function (evt) {
      chan.send("DataChannel connection established. Hello peer!");
    };
    chan.onmessage = function (msg) {
      if (msg.data instanceof Blob) {
        processBlob(msg.data);
      } else {
        processText(msg.data);
      }
    };
  }
  var signalingChannel = new SignalingChannel();

  var pc = new RTCPeerConnection(iceConfig);

  var dc = pc.createDataChannel("namedChannel", { reliable: false });
  ...
  handleChannel(dc);
  pc.onDataChannel = handleChannel;
  ```

  RTCPeerConnection 可以通过设置明确的约束来禁用音频和视频传输来建立仅限数据的点对点连接。

  ```javascript
  var signalingChannel = new SignalingChannel();
      var pc = new RTCPeerConnection(iceConfig);
      var dc = pc.createDataChannel("namedChannel", {reliable: false});
      var mediaConstraints = {
        mandatory: {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: false
        }
  };
      pc.createOffer(function(offer) { ... }, null, mediaConstraints);
  ...

  // DataChannel 的 SDP offer
  (... snip ...)
   m=application 1 DTLS/SCTP 5000
   c=IN IP4 0.0.0.0
   a=mid:data
   a=fmtp:5000 protocol=webrtc-datachannel; streams=10
   (... snip ...)
  ```

  WebRTC 在发送任何应用程序数据之前，启动连接的时候会发送 DATA_CHANNEL_OPEN 消息来初始化 DataChannel。

  ![DATA_CHANNEL_OPEN_message_initiates_new_channel](/content_images/DATA_CHANNEL_OPEN_message_initiates_new_channel__9c996033-3531-493c-a436-a12bab14ae21.png)

  一旦 DataChannel 确立，两个对等体可以开始交换应用数据。每个已建立的 DataChannel 都作为一个独立的 SCTP 流被交付：DataChannel 在同一个 SCTP 连接上被复用，这避免了不同 DataChannel 之间的队头阻塞，并允许在同一个 SCTP 连接上同时交付多个信道。

- 性能检查表
  - 信令服务
    - 使用低延迟的传输。
    - 提供足够的容量。
    - 一旦建立连接，考虑使用 DataChannel 传输信令。
  - 防火墙和 NAT
    - 在启动 RTCPeerConnection 时提供一个 STUN 服务器。
    - 尽可能使用涓流式 ICE —— 更多的信令传输次数，但设置更快。
    - 提供一个 TURN 服务器，用于转发失败的点对点连接。
    - 预计并为 TURN 服务器提供足够的容量。
  - 数据分配
    - 考虑使用超级节点或专用中介来进行大型的多方通信。
    - 考虑在转发到其他对等体之前，在中间体上优化接收的数据。
  - 数据效率
    - 为语音和视频流指定适当的媒体约束。
    - 优化通过 DataChannel 发送的二进制数据。
    - 考虑压缩通过 DataChannel 发送的 UTF-8 内容。
    - 监测 DataChannel 上的缓冲数据量，并适应网络链接条件的变化。
  - 交付和可靠性
    - 使用失序传输以避免队头阻塞。
    - 如果使用顺序递送，尽量减少消息的大小以减少队头阻塞的影响。
    - 发送小的消息（< 1150 字节），以减少数据包丢失对零散的应用消息的影响。
    - 为部分可靠的交付设置适当的重传计数和超时。正确的 "设置" 取决于消息的大小、应用数据的类型和对等体之间的延迟。
