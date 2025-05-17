---
title: Redis Lock
tags: [database, redis, lock]
sidebar_label: Redis Lock
sidebar_position: 6
---

# Redis锁

## 单机Redis锁

使用 `SETNX` 命令进行加锁，当返回 `1` 才表示加锁成功，设置过期时间是防止意外发生不能释放锁，永远持有锁，设置随机值 `random_value` 是为了更加准确地地释放锁。

```redis
// 当 some_key 不存在时设置 some_key 的值为 random_value，并设置 expire_seconds 的过期时间
SET {some_key} {random_value} NX PX {expire_seconds}
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

## 集群Redis锁

[Redission](https://redis.io/topics/distlock)提供了一套高可用的解决方案。Redisson 中的分布式锁自带自动续期机制（Watch Dog续期），还提供了可重入锁（Reentrant Lock）、自旋锁（Spin Lock）、公平锁（Fair Lock）、多重锁（MultiLock）、 红锁（RedLock）、 读写锁（ReadWriteLock）等多种分布式锁的实现。

## 参考资料

* [Martin Kleppmann - 如何实现分布式锁](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)
* [微信公众号 - Redis锁从面试连环炮聊到神仙打架 - why技术](https://mp.weixin.qq.com/s?__biz=Mzg3NjU3NTkwMQ==&mid=2247505097&idx=1&sn=5c03cb769c4458350f4d4a321ad51f5a&source=41#wechat_redirect)
* [掘金 - 分布式锁：RedLock 你这锁也不包熟啊！](https://juejin.cn/post/7069041255438630919)