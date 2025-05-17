---
title: Distributed Lock
tags: [distribution, lock]
sidebar_label: Distributed Lock
sidebar_position: 6
---

# Distributed Lock

## MySQL

使用 MySQL 的唯一索引约束机制，可以实现分布式的加锁和解锁功能，但是对于带有过期时间的处理并不能很好地解决。

```sql
# 插入成功即可代表获得锁
insert into t_distributed_lock values(${lock_key}, ...);

# 删除成功即可代表释放锁
delete t_distributed_lock where lock_key=${lock_key};
```

## Redis

### 实现原理

使用 `SETNX` 命令进行加锁：

```redis
// 当 some_key 不存在时设置 some_key 的值为 random_value，并设置 expire_seconds 的过期时间
SET {some_key} {random_value} NX PX {expire_seconds}
```

使用 Lua 脚本执行**原子操作**删除锁：
```
// 释放锁时，先比较锁对应的 value 值是否相等，避免锁的误释放
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del",KEYS[1])
else
    return 0
end
```

更多Redis锁细节详见 [Redis锁](../../database/redis/redis_lock)。

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

## 参考资料

* [JavaGuide - 分布式锁的实现方案总结](https://javaguide.cn/distributed-system/distributed-lock-implementations.html)