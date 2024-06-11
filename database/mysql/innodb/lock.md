---
title: Lock
tags: [mysql, lock]
sidebar_label: Lock
sidebar_position: 20
---

# MySQL Lock

## 全局锁

全局锁打开之后整个数据库处于只读状态，增删改都会阻塞。全局锁主要应用于全库逻辑备份，例如mysqldump备份工具。

```sql
flush tables with read lock;
unlock tables;
```

但是也不是所有的备份都要开启全局锁，比如InnoDB支持可重复读的事务隔离级别，有MVCC机制，备份期间依然可以对数据进行修改。

## 表级锁

### 表锁

表锁除了会阻塞其他线程的读写，还会限制本线程后续的读写操作，所以需要使用完成之后释放。

```sql
# 表级别的共享锁，即读锁
lock tables xxx read;

# 表级别的独占锁，即写锁
lock tables xxx write;

# 释放表锁
unlock tables;
```

### 元数据锁（MDL）

元数据锁是对表的元数据进行加锁，防止CRUD操作与修改表元数据产生并发问题。CRUD默认会加上元数据锁，直到事务提交之后才会释放。所以有可能出现某个线程申请不到MDL写锁，导致后续申请读锁的查询操作也被阻塞。

### 意向锁

意向锁有如下规则：

* 在使用 InnoDB 引擎的表里对某些记录加上「共享锁」之前，需要先在表级别加上一个「意向共享锁」。
* 在使用 InnoDB 引擎的表里对某些纪录加上「独占锁」之前，需要先在表级别加上一个「意向独占锁」。

也就是，当执行插入、更新、删除操作，需要先对表加上「意向独占锁」，然后对该记录加独占锁。

而普通的 `select` 是不会加行级锁的，普通的 `select` 语句是利用 MVCC 实现一致性读，是无锁的。

意向共享锁和意向独占锁是表级锁，不会和行级的共享锁和独占锁发生冲突，而且意向锁之间也不会发生冲突，只会和共享表锁（`lock tables ... read`）和独占表锁（`lock tables ... write`）发生冲突。

```sql
# 先在表上加上意向共享锁，然后对读取的记录加共享锁
select ... lock in share mode;

# 先在表上加上意向独占锁，然后对读取的记录加独占锁
select ... for update;
```

:::tip 意向锁的目的是为了快速判断表里是否有记录被加锁

如果没有「意向锁」，那么加「独占表锁」时，就需要遍历表里所有记录，查看是否有记录存在独占锁，这样效率会很慢。有了「意向锁」，由于在对记录加独占锁前，先会加上表级别的意向独占锁，那么在加「独占表锁」时，直接查该表是否有意向独占锁，如果有就意味着表里已经有记录被加了独占锁，这样就不用去遍历表里的记录。

所以，意向锁的目的是为了快速判断表里是否有记录被加锁。
:::

### AUTO-INC锁

表里的主键通常都会设置成自增的，这是通过对主键字段声明 `AUTO_INCREMENT` 属性实现的。

在插入数据时，会加一个表级别的 AUTO-INC 锁，然后为被 `AUTO_INCREMENT` 修饰的字段赋值递增的值，等插入语句执行完成后，才会把 AUTO-INC 锁释放掉。

**AUTO-INC锁不是再一个事务提交后才释放，而是再执行完插入语句后就会立即释放。** 当一个事务在持有 AUTO-INC 锁的过程中，其他事务的如果要向该表插入语句都会被阻塞，从而保证插入数据时，被 `AUTO_INCREMENT` 修饰的字段的值是连续递增的。

AUTO-INC 锁再对大量数据进行插入的时候，**会影响插入性能**。因此， 在 MySQL 5.1.22 版本开始，InnoDB 存储引擎提供了一种**轻量级的锁**来实现自增。在插入数据的时候，会为被 `AUTO_INCREMENT` 修饰的字段加上轻量级锁，然后给该字段赋值一个自增的值，就把这个轻量级锁释放了，而**不需要等待整个插入语句执行完后才释放锁**。

InnoDB 存储引擎提供了个 `innodb_autoinc_lock_mode` 的系统变量，是用来控制选择用 AUTO-INC 锁，还是轻量级的锁。

1. 当 `innodb_autoinc_lock_mode = 0`，就采用 AUTO-INC 锁，语句执行结束后才释放锁；
2. 当 `innodb_autoinc_lock_mode = 2`，就采用轻量级锁，申请自增主键后就释放锁，并不需要等语句执行后才释放。
3. 当 `innodb_autoinc_lock_mode = 1`：
   1. 普通 `insert` 语句，自增锁在申请之后就马上释放；
   2. 类似 `insert … select` 这样的批量插入数据的语句，自增锁还是要等语句结束后才被释放；

当 `innodb_autoinc_lock_mode = 2` 是性能最高的方式，但是当搭配 binlog 的日志格式是 statement 一起使用的时候，在「主从复制的场景」中会发生数据不一致的问题。

## 行级锁

**InnoDB 引擎是支持行级锁的，而 MyISAM 引擎并不支持行级锁。**

**共享锁（S锁）满足读读共享，读写互斥。独占锁（X锁）满足写写互斥、读写互斥。**

|   | 共享锁 | 独占锁 |
| --- | --- | --- |
| 共享锁 | 兼容√ | 不兼容× |
| 独占锁 | 不兼容×  | 不兼容× |

普通的 `select` 语句采用快照读的方式，所以不会对记录加锁。要加锁可以采取如下共享锁和独占锁的方式。

```sql
begin;
# 对读取的记录加共享锁
select ... lock in share mode;
commit;

begin;
# 对读取的记录加独占锁
select ... for update;
commit;
```

上面这两条语句必须在一个事务中，因为当事务提交了，锁就会被释放，所以在使用这两条语句的时候，要加上 `begin`、`start transaction` 或者 `set autocommit = 0`。

而对于增删改的SQL，都会加行级锁，具体就是独占锁。

```sql
# 对操作的记录加独占锁(X型锁)
update table .... where ...;

# 对操作的记录加独占锁(X型锁)
delete from table where ...;
```

行级锁的类型主要有三类：

1. **Record Lock**，记录锁，也就是仅仅把一条记录锁上；
2. **Gap Lock**，间隙锁，锁定一个范围，但是不包含记录本身；
3. **Next-Key Lock**：Record Lock + Gap Lock 的组合，锁定一个范围，并且锁定记录本身。

### Record Lock

Record Lock 称为记录锁，锁住的是一条记录。而且记录锁是有 S 锁和 X 锁之分的：

* 当一个事务对一条记录加了 S 型记录锁后，其他事务也可以继续对该记录加 S 型记录锁（S 型与 S 锁兼容），但是不可以对该记录加 X 型记录锁（S 型与 X 锁不兼容）;
* 当一个事务对一条记录加了 X 型记录锁后，其他事务既不可以对该记录加 S 型记录锁（S 型与 X 锁不兼容），也不可以对该记录加 X 型记录锁（X 型与 X 锁不兼容）。

### Gap Lock

Gap Lock 称为间隙锁，锁住的是一个范围区间。只存在于可重复读隔离级别，目的是为了解决**可重复读隔离级别下幻读的现象**。

间隙锁虽然存在 X 型间隙锁和 S 型间隙锁，但是**间隙锁之间是兼容的**，即**两个事务可以同时持有包含共同间隙范围的间隙锁**，并不存在互斥关系，因为间隙锁的目的是防止插入幻影记录而提出的。

### Next-Key Lock

Next-Key Lock 是 **Record Lock + Gap Lock 的组合**，锁定一个范围，并且锁定记录本身。如果一个事务获取了 X 型的 Next-key lock，那么另外一个事务在获取相同范围的 X 型的 Next-key lock 时，是会被阻塞的。

### 插入意向锁

一个事务在插入一条记录的时候，需要判断插入位置是否已被其他事务加了间隙锁（next-key lock 也包含间隙锁）。

如果有的话，插入操作就会发生阻塞，直到拥有间隙锁的那个事务提交为止（释放间隙锁的时刻），在此期间会生成一个**插入意向锁**，表明有事务想在某个区间插入新记录，但是现在处于等待状态。

插入意向锁是一种特殊的间隙锁，但不同于间隙锁的是，该锁只用于并发插入操作。如果说间隙锁锁住的是一个区间，那么「插入意向锁」锁住的就是一个点。

**尽管插入意向锁也属于间隙锁，但两个事务却不能在同一时间内，一个拥有间隙锁，另一个拥有该间隙区间内的插入意向锁（如果插入意向锁不在间隙锁区间内则是可以的）。所以，插入意向锁和间隙锁之间是冲突的。**

## 行级锁的选择

加锁的对象是索引，加锁的基本单位是 Next-key lock，它是由记录锁和间隙锁组合而成的，**Next-key lock 是前开后闭区间，而间隙锁是前开后开区间**。

**Next-key lock 在一些场景下会退化成记录锁或间隙锁，在能使用记录锁或者间隙锁就能避免幻读现象的场景下， Next-key lock 就会退化成记录锁或间隙锁。**

在 MySQL 中我们可以通过执行 `SELECT * FROM performance_schema.data_locks\G;` 对锁的情况进行分析。

### 唯一索引等值查询

1. 当查询的记录「存在」时，该记录的索引中的 Next-key lock 会退化成「记录锁」。
2. 当查询的记录「不存在」时，该记录的索引中的 Next-key lock 会退化成「间隙锁」。而锁的范围一般是该索引按排序的上一条和下一条区间。

### 唯一索引范围查询

1. 对于「大于等于」的范围查询，因为存在等值查询的条件，那么如果等值查询的记录是存在于表中，那么**该条记录的索引中的 Next-key 锁会退化成记录锁**，大于部分索引的锁保持 Next-key 不变。
2. 对于「小于」的范围查询，不管条件值的记录不在表中，扫描到终止范围查询的记录时，**该记录的索引的 Next-key 锁会退化成间隙锁**，其他扫描到的记录，都是在这些记录的索引上加 Next-key 锁。
3. 对于「小于等于」的范围查询
   1. 当条件值的记录不在表中，扫描到终止范围查询的记录时，**该记录的索引的 Next-key 锁会退化成间隙锁**，其他扫描到的记录，都是在这些记录的索引上加 Next-key 锁。
   2. 当条件值的记录在表中，扫描到终止范围查询的记录时，**该记录的索引 Next-key 锁不会退化成间隙锁**。其他扫描到的记录，都是在这些记录的索引上加 Next-key 锁。

### 非唯一索引等值查询

当我们用非唯一索引进行等值查询的时候，因为存在两个索引，一个是主键索引，一个是非唯一索引（二级索引），所以在加锁时，**同时会对这两个索引都加锁，但是对主键索引加锁的时候，只有满足查询条件的记录才会对它们的主键索引加锁。**

针对非唯一索引等值查询时，查询的记录存不存在，加锁的规则也会不同：

1. 当查询的记录「存在」时，由于不是唯一索引，所以肯定存在索引值相同的记录，于是非唯一索引等值查询的过程是一个扫描的过程，直到扫描到第一个不符合条件的二级索引记录就停止扫描，然后在扫描的过程中，对扫描到的二级索引记录加的是 next-key 锁，而对于第一个不符合条件的二级索引记录，该二级索引的 next-key 锁会退化成间隙锁。同时，**在符合查询条件的记录的主键索引上加记录锁**。
2. 当查询的记录「不存在」时，扫描到第一条不符合条件的二级索引记录，该二级索引的 next-key 锁会退化成间隙锁。因为不存在满足查询条件的记录，所以**不会对主键索引加锁**。

### 非唯一索引范围查询

**非唯一索引进行范围查询时，索引的 Next-key lock 不会有退化为间隙锁和记录锁的情况。**

### 没有加索引的查询

如果锁定读查询语句，没有使用索引列作为查询条件，或者查询语句没有走索引查询，导致扫描是全表扫描。那么，每一条记录的索引上都会加 next-key 锁，这样就**相当于锁住的全表**，这时如果其他事务对该表进行增、删、改操作的时候，都会被阻塞。

不只是锁定读查询语句不加索引才会导致这种情况，`UPDATE` 和 `DELETE` 语句如果查询条件不加索引，那么由于扫描的方式是全表扫描，于是就会对每一条记录的索引上都会加 next-key 锁，这样就相当于锁住的全表。

所以在生产环境中，对于没加索引的当前读和修改删除操作很容易导致表被锁住而发生事故！需要注意的是这里的表锁指的是几乎所有行都被锁了并且间隙锁锁了整个区间。

## MySQL死锁

下面有个死锁的例子，假设我们使用InnoDB存储引擎，并使用可重复读级别的事务等级。我们有个表 `t_order` ，表中假设有 `1001-1006` `order_sn` 编号的数据存在，下面是死锁的样例图：

```sql
CREATE TABLE `t_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_no` int DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_order` (`order_no`) USING BTREE
) ENGINE=InnoDB ;
```

![](../../../static/images/database/mysql/mysql_deadlock_example1.webp)

上图有两事务，一个事务要插入订单 1007 ，另外一个事务要插入订单 1008，因为需要对订单做幂等性校验，所以两个事务先要查询该订单是否存在，不存在才插入记录。

两个事务都陷入了等待状态（前提没有打开死锁检测），也就是发生了死锁，都在相互等待对方释放锁。事务A和B的 `SELECT` 语句都使用了同区间的间隙锁，间隙锁不冲突，两者都能获取到，接着 `INSERT` 的时候再次请求锁，也就是插入意向锁，插入意向锁和间隙锁之间是冲突的，这时候死锁的四个条件都满足了。

### 如何避免死锁

死锁的四个必要条件：互斥、占有且等待、非抢占、循环等待。只要系统发生死锁，这些条件必然成立，但是只要破坏任意一个条件就死锁就不会成立。

在数据库层面，有两种策略通过打破循环等待条件来解除死锁状态：

1. **设置事务等待锁的超时时间**：当一个事务的等待时间超过该值后，就对这个事务进行回滚，于是锁就释放了，另一个事务就可以继续执行了。在 InnoDB 中，参数 `innodb_lock_wait_timeout` 是用来设置超时时间的，默认值时 `50` 秒。
2. **开启主动死锁检测**：主动死锁检测在发现死锁后，主动回滚死锁链条中的某一个事务，让其他事务得以继续执行。将参数 `innodb_deadlock_detect` 设置为 `on`，表示开启这个逻辑，默认就开启。

# 参考资料

* [小林coding - MySQL有哪些锁？](https://xiaolincoding.com/mysql/lock/mysql_lock.html)
* [小林coding - MySQL是怎么加锁的？](https://xiaolincoding.com/mysql/lock/how_to_lock.html)