---
title: Distributed Lock
tags: [distribution, lock]
sidebar_label: Distributed Lock
sidebar_position: 6
---

# Distributed Lock

## Redis

### 实现原理

使用 `SETNX` 命令进行加锁，当返回 `1` 才表示加锁成功，设置过期时间是防止意外发生不能释放锁，永远持有锁，设置随机值 `random_value` 是为了更加准确地地释放锁。

```redis
// 当some_key不存在时设置some_key的值为random_value，并设置3000的过期时间
SET some_key random_value NX PX 3000
```

使用 Lua 脚本执行**原子操作**删除锁对应的 `key` ，判断 `random_value` 是尽可能确保是确实释放锁的时候删除（双重检查），而不是被其他处理逻辑误删除。
```
// 释放锁时，先比较锁对应的 value 值是否相等，避免锁的误释放
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del",KEYS[1])
else
    return 0
end
```

上述方式已经能实现一个比较可靠的分布式锁了，但是还存在一些问题：

* 锁过期：为了防止锁在极端情况下不能释放，加了过期时间，但是如果逻辑占用时间较长，存在不能对锁续期的问题。
* Redis单点：Redis单点存在问题，不能保证分布式锁的高可用。

[Redission](https://redis.io/topics/distlock)提供了一套高可用的解决方案。Redisson 中的分布式锁自带自动续期机制（Watch Dog续期），还提供了可重入锁（Reentrant Lock）、自旋锁（Spin Lock）、公平锁（Fair Lock）、多重锁（MultiLock）、 红锁（RedLock）、 读写锁（ReadWriteLock）等多种分布式锁的实现。

## Zookeeper

ZooKeeper 分布式锁是基于 **临时顺序节点** 和 **Watcher（事件监听器）** 实现的。临时节点是为了保障客户端在异常情况下没有释放锁导致死锁问题，顺序节点是便于事件监听，实现更好的加锁性能。

获取锁流程：

1. 首先我们要有一个持久节点 `/locks` ，客户端获取锁就是在 `locks` 下创建临时顺序节点。
2. 假设客户端 `1` 创建了 `/locks/lock1` 节点，创建成功之后，会判断  `lock1` 是否是 `/locks` 下最小的子节点。
3. 如果 `lock1` 是最小的子节点，则获取锁成功。否则，获取锁失败。
4. 如果获取锁失败，则说明有其他的客户端已经成功获取锁。客户端 `1` 并不会不停地循环去尝试加锁，而是在前一个节点比如 `/locks/lock0` 上注册一个事件监听器。这个监听器的作用是当前一个节点释放锁之后通知客户端 `1`（避免无效自旋），这样客户端 `1` 就加锁成功了。

释放锁流程：

1. 成功获取锁的客户端在执行完业务流程之后，会将对应的子节点删除。
2. 成功获取锁的客户端在出现故障之后，对应的子节点由于是临时顺序节点，也会被自动删除，避免了锁无法被释放。
3. 我们前面说的事件监听器其实监听的就是这个子节点删除事件，子节点删除就意味着锁被释放。

实际项目中，推荐使用 **Curator** 来实现 ZooKeeper 分布式锁。Curator 是 Netflix 公司开源的一套 ZooKeeper Java 客户端框架，相比于 ZooKeeper 自带的客户端 zookeeper 来说，Curator 的封装更加完善，各种 API 都可以比较方便地使用。

Curator主要实现了下面四种锁：
1. `InterProcessMutex`：分布式可重入排它锁。
2. `InterProcessSemaphoreMutex`：分布式不可重入排它锁。
3. `InterProcessReadWriteLock`：分布式读写锁。
4. `InterProcessMultiLock`：将多个锁作为单个实体管理的容器，获取锁的时候获取所有锁，释放锁也会释放所有锁资源（忽略释放失败的锁）。

## 总结

Redis 实现分布式锁性能较高（优先选择 Redission 实现的分布式锁），ZooKeeper 实现分布式锁可靠性更高（优先选择 Curator 框架实现的分布式锁）。

# 参考资料

* [Martin Kleppmann - 如何实现分布式锁](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)
* [微信公众号 - Redis锁从面试连环炮聊到神仙打架 - why技术](https://mp.weixin.qq.com/s?__biz=Mzg3NjU3NTkwMQ==&mid=2247505097&idx=1&sn=5c03cb769c4458350f4d4a321ad51f5a&source=41#wechat_redirect)
* [JavaGuide - 分布式锁的实现方案总结](https://javaguide.cn/distributed-system/distributed-lock-implementations.html)