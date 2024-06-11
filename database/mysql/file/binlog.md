---
title: binlog
tags: [mysql, binlog]
sidebar_label: binlog
sidebar_position: 5
---

# binlog文件

binlog 文件是 MySQL 的 Server 端用于记录数据的增删改更新等修改操作，用于实现数据库的高可用，备份恢复以及主从复制等能力。

:::danger binlog 和 redolog 文件有什么区别？
1. 适用范围不同
   * binlog 是 MySQL 的 Server 层实现的日志，所有存储引擎都可以使用。
   * redo log 是 Innodb 存储引擎实现的日志。
2. 文件格式不同
   * binlog 有 3 种格式类型，分别是 STATEMENT（默认格式）、ROW、 MIXED。
   * redo log 是物理日志，记录的是在某个数据页做了什么修改，比如对 X 表空间中的 Y 数据页 Z 偏移量的地方做了 U 更新。
3. 写入方式不同
   * binlog 是追加写，写满一个文件，就创建一个新的文件继续写，不会覆盖以前的日志，保存的是全量的日志。
   * redo log 是循环写，日志空间大小是固定，全部写满就从头开始，保存未被刷入磁盘的脏页日志。
4. 用途不同
   * binlog 用于备份恢复、主从复制。
   * redo log 用于掉电等故障恢复。
:::

:::danger 如果整个数据库的数据被删除了，能使用 redo log 文件恢复数据吗？
不可以使用 redo log 文件恢复，只能使用 binlog 文件恢复。因为 redo log 文件是循环写，是会边写边擦除日志的，只记录未被刷入磁盘的数据的物理日志，已经刷入磁盘的数据都会从 redo log 文件里擦除。而binlog 文件保存的是全量的日志。
:::

## 文件内容

binlog 文件中记录的 3 种格式：

1. **`STATEMENT`**：每一条修改数据的 SQL 都会被记录到 binlog 中，相当于记录了逻辑操作。主从复制中 slave 端再根据 SQL 语句重现。但 `STATEMENT` 有动态函数的问题，比如你用了 `uuid` 或者 `now` 这些函数，你在主库上执行的结果并不是你在从库执行的结果，这种随时在变的函数会导致复制的数据不一致。
2. **`ROW`**：记录行数据最终被修改成什么样了（不是逻辑日志），不会出现 `STATEMENT` 下动态函数的问题。但 ROW 的缺点是每行数据的变化结果都会被记录，比如执行批量 `UPDATE` 语句，更新多少行数据就会产生多少条记录，使 binlog 文件过大，而在 `STATEMENT` 格式下只会记录一个 `UPDATE` 语句而已。
3. **`MIXED`**：包含了 `STATEMENT` 和 `ROW` 模式，它会根据不同的情况自动使用 `ROW` 模式和 `STATEMENT` 模式。

### binlog 的刷盘机制

事务执行过程中，先把日志写到 binlog cache（Server 层的缓冲区），事务提交的时候，再把 binlog cache 写到 binlog 文件中。

MySQL 给每个线程分配了一个 binlog cache，其大小可使用参数 `binlog_cache_size` 控制。在事务提交的时候，执行器把 binlog cache 里的完整事务写入到 binlog 文件中，并清空 binlog cache。

虽然每个线程有自己 binlog cache，但是最终都写到同一个 binlog 文件。写 binlog 文件也不是立刻刷新到磁盘，还有操作系统提供的文件缓存，MySQL提供一个 `sync_binlog` 参数来控制数据库的 binlog 刷到磁盘上的频率：

1. 参数值为 `0` （默认），表示每次提交事务都只 `write` ，不 `fsync`，后续交由操作系统决定何时将数据持久化到磁盘。该模式性能最佳，但是容易丢数据。
2. 参数值为 `1` ，表示每次提交事务都会 `write` ，然后马上执行 `fsync` 。性能较差，但是最多丢一个事务的数据。
3. 参数值为 `N`（N>1），表示每次提交事务都 `write` ，但累积 `N` 个事务后才 `fsync` 。性能折中，丢失数据最多。

## 两阶段提交

:::tip 一条UPDATE SQL  `UPDATE t_user SET name = 'xxx' WHERE id = 1;`的执行流程
1. 执行器负责具体执行，会调用存储引擎的接口，通过主键索引树搜索获取 id = 1 这一行记录：
   * 如果 id=1 这一行所在的数据页本来就在 buffer pool 中，就直接返回给执行器更新；
   * 如果记录不在 buffer pool，将数据页从磁盘读入到 buffer pool，返回记录给执行器。
2. 执行器得到聚簇索引记录后，会看一下更新前的记录和更新后的记录是否一样：
   * 如果一样的话就不进行后续更新流程；
   * 如果不一样的话就把更新前的记录和更新后的记录都当作参数传给 InnoDB 层，让 InnoDB 真正的执行更新记录的操作；
3. 开启事务， InnoDB 层更新记录前，首先要记录相应的 undo log，因为这是更新操作，需要把被更新的列的旧值记下来，也就是要生成一条 undo log，undo log 会写入 Buffer Pool 中的 Undo 页面，不过在内存修改该 Undo 页面后，需要记录对应的 redo log。
4. InnoDB 层开始更新记录，会先更新内存（同时标记为脏页），然后将记录写到 redo log 里面，这个时候更新就算完成了。为了减少磁盘I/O，不会立即将脏页写入磁盘，后续由后台线程选择一个合适的时机将脏页写入到磁盘。这就是 WAL 技术，MySQL 的写操作并不是立刻写到磁盘上，而是先写 redo 日志，然后在合适的时间再将修改的行数据写到磁盘上。
5. 至此，一条记录更新完了。
6. 在一条更新语句执行完成后，然后开始记录该语句对应的 binlog，此时记录的 binlog 会被保存到 binlog cache，并没有刷新到硬盘上的 binlog 文件，在事务提交时才会统一将该事务运行过程中的所有 binlog 刷新到硬盘。
7. 事务提交。
:::

从上面的样例流程可以看出，事务提交后，redo log 和 binlog 都要持久化到磁盘，但是这两个是独立的逻辑，可能出现**半成功的状态**，这样就造成两份日志之间的逻辑不一致。

MySQL 为了避免出现两份日志之间的逻辑不一致的问题，使用了**两阶段提交**来解决，两阶段提交其实是**分布式事务一致性协议**，它可以保证多个逻辑操作要不全部成功，要不全部失败，不会出现半成功的状态。

两阶段提交把单个事务的提交拆分成了 2 个阶段，分别是**准备（Prepare）阶段**和**提交（Commit）阶段**，使用了内部 XA 事务来做协调，过程如下：

1. **Prepare 阶段**：将 XID（内部 XA 事务的 ID） 写入到 redo log，同时将 redo log 对应的事务状态设置为 prepare，然后将 redo log 持久化到磁盘（`innodb_flush_log_at_trx_commit = 1`）；
2. **Commit 阶段**：把 XID 写入到 binlog，然后将 binlog 持久化到磁盘（`sync_binlog = 1`），接着调用引擎的提交事务接口，将 redo log 状态设置为 commit，此时该状态并不需要持久化到磁盘，只需要 write 到文件系统的 page cache 中就够了，因为只要 binlog 写磁盘成功，就算 redo log 的状态还是 prepare 也没有关系，一样会被认为事务已经执行成功。

![](../../../static/images/database/mysql/mysql_two_phase_commit.webp)

如上流程如果出现异常情况，处理如下：

* 如果 binlog 中没有当前内部 XA 事务的 XID，说明 redolog 完成刷盘，但是 binlog 还没有刷盘，则回滚事务。
* 如果 binlog 中有当前内部 XA 事务的 XID，说明 redolog 和 binlog 都已经完成了刷盘，则提交事务。

所以，对于处于 prepare 阶段的 redo log，即可以提交事务，也可以回滚事务，这取决于是否能在 binlog 中查找到与 redo log 相同的 XID，如果有就提交事务，如果没有就回滚事务。这样就可以保证 redo log 和 binlog 这两份日志的一致性了。

### 两阶段提交的问题

两阶段提交虽然保证了两个日志文件的数据一致性，但是性能很差，主要体现在两个方面：

* **磁盘 I/O 次数高**：对于 `sync_binlog = 1` 和 `innodb_flush_log_at_trx_commit = 1` 配置，每个事务提交都会进行两次 fsync（刷盘），一次是 redo log 刷盘，另一次是 binlog 刷盘。
* **锁竞争激烈**：两阶段提交虽然能够保证单事务两个日志的内容一致，但在多事务的情况下，却不能保证两者的提交顺序一致，因此，在两阶段提交的流程基础上，还需要加一个锁来保证提交的原子性，从而保证多事务的情况下，两个日志的提交顺序一致。

MySQL 引入了 binlog **组提交（group commit）机制**，当有多个事务提交的时候，会将多个 binlog 刷盘操作合并成一个，从而减少磁盘 I/O 的次数。引入了组提交机制后，prepare 阶段不变，只针对 commit 阶段，将 commit 阶段拆分为三个过程：

1. **flush 阶段**：多个事务按进入的顺序将 binlog 从 cache 写入文件（不刷盘）；
2. **sync 阶段**：对 binlog 文件做 fsync 操作（多个事务的 binlog 合并一次刷盘）；
3. **commit 阶段**：各个事务按顺序做 InnoDB commit 操作。

上面的每个阶段都有一个队列，每个阶段有锁进行保护，因此保证了事务写入的顺序，第一个进入队列的事务会成为 leader，leader领导所在队列的所有事务，全权负责整队的操作，完成后通知队内其他事务操作结束。

:::tip 一条UPDATE SQL执行后续的补充
1. 事务提交（对于两阶段提交）：
   * prepare 阶段：将 redo log 对应的事务状态设置为 prepare，然后将 redo log 刷新到硬盘；
   * commit 阶段：将 binlog 刷新到磁盘，接着调用引擎的提交事务接口，将 redo log 状态设置为 commit（将事务设置为 commit 状态后，刷入到磁盘 redo log 文件）。
2. 至此，一条更新语句执行完成。
:::

# 参考资料

* [小林coding - MySQL 日志：undo log、redo log、binlog 有什么用？](https://xiaolincoding.com/mysql/log/how_update.html)