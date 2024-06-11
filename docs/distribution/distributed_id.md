---
title: Distributed ID
tags: [distribution, id]
sidebar_label: Distributed ID
sidebar_position: 5
---

# Distributed Lock

## 实现方案

### 数据库ID段

### Redis自增ID

```
> incr key
(integer) 2048
```

### MongoDB的ObjectId

```
+-------------------+--------------------+--------------------+------------------+
| timestamp(4bytes) | machine_id(4bytes) | process_id(2bytes) | sequence(3bytes) |
+-------------------+--------------------+--------------------+------------------+
```

### Snowflake算法

```
+------------+-------------------+----------------------+------------------+------------------+
| sign(1bit) | timestamp(48bits) | datacenter_id(5bits) | worker_id(5bits) | sequence(13bits) |
+------------+-------------------+----------------------+------------------+------------------+
```

* sign(1bit)：符号位（标识正负），始终为 `0`，代表生成的 ID 为正数。
* timestamp (41 bits)：用来表示时间戳，单位是毫秒，可以支撑 $2^41$ 毫秒（约 69 年）。
* datacenter id + worker id (10 bits)：一般来说，前 `5` 位表示机房 ID，后 `5` 位表示机器 ID。这样就可以区分不同集群/机房的节点。
* sequence (12 bits)：表示序列号，序列号为自增值，代表单台机器每毫秒能够产生的最大序列号数($2^12=4096$)，也就是说单台机器每毫秒最多可以生成 `4096` 个唯一序列号。

### UUID

# 参考资料
