---
title: MySQL Transaction
tags: [mysql, transaction]
sidebar_label: Transaction
sidebar_position: 9
---

# MySQL Transaction

## ACID特性

* **原子性**（`Atomicity`） ： 事务是最小的执行单位，不允许分割。事务的原子性确保动作要么全部完成，要么完全不起作用；
* **一致性**（`Consistency`）： 执行事务前后，数据保持一致，例如转账业务中，无论事务是否成功，转账者和收款人的总额应该是不变的；
* **隔离性**（`Isolation`）： 并发访问数据库时，一个用户的事务不被其他事务所干扰，各并发事务之间数据库是独立的。
* **持久性**（`Durability`）： 一个事务被提交之后。它对数据库中数据的改变是持久的，即使数据库发生故障也不应该对其有任何影响。

## 事务分类

* 扁平事务
* 链事务
* 嵌套事务
* 分布式事务

## 事务隔离级别

* **读取未提交**（`READ-UNCOMMITTED`）： 最低的隔离级别，允许读取尚未提交的数据变更，可能会导致脏读、幻读或不可重复读。
* **读取已提交**（`READ-COMMITTED`）： 允许读取并发事务已经提交的数据，可以阻止脏读，但是幻读或不可重复读仍有可能发生。
* **可重复读**（`REPEATABLE-READ`）： 对同一字段的多次读取结果都是一致的，除非数据是被本身事务自己所修改，可以阻止脏读和不可重复读，但幻读仍有可能发生。
* **可串行化**（`SERIALIZABLE`）： 最高的隔离级别，完全服从`ACID`的隔离级别。所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，也就是说，该级别可以防止脏读、不可重复读以及幻读。

| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
| :--- | :---: | :---: | :---: |
| READ-UNCOMMITTED | √ | √ | √ |
| READ-COMMITTED | × | √ | √ |
| REPEATABLE-READ | × | × | √ |
| SERIALIZABLE | × | × | × |

InnoDB存储引擎默认支持的隔离级别是**REPEATABLE-READ**，但与标准SQL不同的是，InnoDB存储引擎在REPEATABLE-READ的事务隔离级别下，使用**Next-Key Lock锁算法**，**避免幻读的产生**。也就是说其通过其他方式已经达到了SERIALIZABLE的标准。

:::tip MySQL 是如何解决幻读的？
MySQL InnoDB 引擎的默认隔离级别虽然是**可重复读**，但是它很大程度上避免幻读现象（并不是完全解决了），解决的方案有两种：

* 对于**快照读**，是通过 **MVCC** 方式解决了幻读。在可重复读隔离级别下，事务执行过程中看到的数据，一直跟这个事务启动时看到的数据是一致的，即使中途有其他事务插入了一条数据，是查询不出来这条数据的，所以就很好了避免幻读问题。
* 对于**当前读**，是通过 **Next-key lock（记录锁+间隙锁）**方式解决了幻读。当执行 `select ... for update` 语句的时候，会加上 Next-key lock，如果有其他事务在 Next-key lock 锁范围内插入了一条记录，那么这个插入语句就会被阻塞，无法成功插入，所以就很好了避免幻读问题。
:::

# 参考资料