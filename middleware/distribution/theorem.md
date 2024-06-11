---
title: CAP & BASE
tags: [distribution, cap, base]
sidebar_label: CAP & BASE
sidebar_position: 1
---

# CAP & BASE

## CAP

CAP 理论/定理open in new window起源于 2000 年，由加州大学伯克利分校的 Eric Brewer 教授在分布式计算原理研讨会（PODC）上提出，因此 CAP 定理又被称作 布鲁尔定理（Brewer’s theorem）2 年后，麻省理工学院的 Seth Gilbert 和 Nancy Lynch 发表了布鲁尔猜想的证明，CAP 理论正式成为分布式领域的定理。

在理论计算机科学中，CAP 定理指出对于一个分布式系统（指互相连接并共享数据的节点集合）来说，当涉及读写操作时，**只能同时满足以下三者中的两个，另外一个只能被牺牲掉**：

* **一致性（`Consistency`）**: 写操作之后无论访问哪个节点都能取得相同的数据。
* **可用性（`Availability`）**: 非故障的节点在合理的时间内返回合理的响应（不是错误或者超时的响应）。
* **分区容错性（`Partition Tolerance`）**: 分布式系统出现网络分区的时候，仍然能够对外提供服务。

:::tip 如何理解 CAP 三选二的限制？
当发生网络分区的时候，如果我们要继续服务，那么强一致性和可用性只能二选一。也就是说当网络分区之后 P 是前提，决定了 P 之后才有 C 和 A 的选择。也就是说分区容错性（Partition tolerance）我们是必须要实现的。也就是说，CAP 理论中分区容错性 P 是一定要满足的，在此基础上，只能满足可用性 A 或者一致性 C。

因此，**分布式系统理论上不可能选择 CA 架构，只能选择 CP 或者 AP 架构。** 比如 ZooKeeper、HBase 就是 CP 架构，Cassandra、Eureka 就是 AP 架构，Nacos 不仅支持 CP 架构也支持 AP 架构。
:::

:::tip 为什么不存在CA架构？
若系统出现网络分区，系统中的某个节点在进行写操作。为了保证 C， 必须要禁止其他节点的读写操作，这就和 A 发生冲突了。如果为了保证 A，其他节点的读写操作正常的话，那就和 C 发生冲突了。

需要补充说明是，如果网络分区正常的话（系统在绝大部分时候所处的状态），也就说不需要保证 P 的时候，C 和 A 能够同时保证。
:::

## BASE

[BASE 理论](https://dl.acm.org/doi/10.1145/1394127.1394128) 起源于 2008 年， 由 eBay 的架构师 Dan Pritchett 在 ACM 上发表。

BASE 是 **基本可用（`Basically Available`）**、**软状态（`Soft-state`）** 和 **最终一致性（`Eventually Consistent`）** 三个英文短语的缩写。

* **基本可用（`Basically Available`）**：指分布式系统在出现不可预知故障的时候，允许损失部分可用性，比如响应时间、部分功能不可用等。但是，这绝不等价于系统不可用。
* **软状态（`Soft-state`）**：指允许系统中的数据存在中间状态，并认为该状态的存在不会影响系统的整体可用性。
* **最终一致性（`Eventually Consistent`）**：指系统中所有的数据副本，在经过一段时间的同步后，最终能够达到一个一致的状态。

BASE 理论本质上是对 CAP 的延伸和补充，是对 CAP 中一致性 C 和可用性 A 权衡的结果。更具体地说，是对 CAP 中 AP 方案的一个补充，降低了对系统的要求。即使无法做到强一致性，但每个应用都可以根据自身业务特点，采用适当的方式来使系统达到最终一致性。因此，AP 方案只是在系统发生分区的时候放弃一致性，而不是永远放弃一致性。在分区故障恢复后，系统应该达到最终一致性。

最终一致性实现的可能方式：

* 读时修复 : 在读取数据时，检测数据的不一致，进行修复。比如 Cassandra 的 Read Repair 实现，具体来说，在向 Cassandra 系统查询数据的时候，如果检测到不同节点的副本数据不一致，系统就自动修复数据。
* 写时修复 : 在写入数据，检测数据的不一致时，进行修复。比如 Cassandra 的 Hinted Handoff 实现。具体来说，Cassandra 集群的节点之间远程写数据的时候，如果写失败 就将数据缓存下来，然后定时重传，修复数据的不一致性。
* 异步修复 : 这个是最常用的方式，通过定时对账检测副本数据的一致性，并修复。


### 两阶段提交（2PC）

两阶段提交的一些缺点：

1. 性能不高：在资源准备就绪之后，资源管理器中的资源就一直处于阻塞，直到提交完成之后，才进行资源释放。
2. 依然存在不一致情况：比如在第二阶段中，假设协调者发出了事务 Commit 的通知，但是因为网络问题该通知仅被一部分参与者所收到并执行了 Commit 操作，其余的参与者则因为没有收到通知一直处于阻塞状态，这时候就产生了数据的不一致性。

### 补偿事务（TCC）

### 本地消息表

### MQ事务消息

# 参考资料

* [Wikipedia - CAP定理](https://zh.wikipedia.org/wiki/CAP%E5%AE%9A%E7%90%86)
* [JavaGuide - CAP & BASE理论详解](https://javaguide.cn/distributed-system/protocol/cap-and-base-theorem.html)
* [掘金 - 神一样的CAP理论被应用在何方](https://juejin.cn/post/6844903936718012430)
* [Martin Kleppmann - Please stop calling databases CP or AP](https://martin.kleppmann.com/2015/05/11/please-stop-calling-databases-cp-or-ap.html)