---
title: AQS
tags: [java, concurrent, aqs]
sidebar_label: AQS
sidebar_position: 10
---

# AQS

AQS 是 `AbstractQueuedSynchronizer` 的英文缩写，在 JDK 提供的 `java.util.concurrent.locks` 包下，是实现众多同步器和锁的关键部分。

## AQS思想

AQS核心思想是，如果被请求的共享资源空闲，那么就将当前请求资源的线程设置为有效的工作线程，将共享资源设置为锁定状态；如果共享资源被占用，就需要一定的阻塞等待唤醒机制来保证锁分配。这个机制主要用的是**CLH队列**的变体实现的，将暂时获取不到锁的线程加入到队列中。

AQS中的队列是CLH（Craig、Landin and Hagersten）变种，非单向链表，而是双向队列（FIFO），AQS是通过将每条请求共享资源的线程封装成一个节点来实现锁的分配。

![](../../../static/images/java/concurrent/aqs_clh_fifo.png)

AQS使用一个 `volatile int state` 的成员变量来表示同步状态，通过内置的**FIFO队列**来完成资源获取的排队工作，通过 **CAS** 完成对状态值的修改。

# 参考资料

* [JavaGuide - AQS 详解](https://javaguide.cn/java/concurrent/aqs.html)
* [美团技术团队 - 从ReentrantLock的实现看AQS的原理及应用](https://tech.meituan.com/2019/12/05/aqs-theory-and-apply.html)
* [CSDN - 【深入AQS原理】我画了35张图就是为了让你深入 AQS  - by一枝花算不算浪漫](https://www.cnblogs.com/wang-meng/p/12816829.html)