---
title: MySQL Index
tags: [mysql, index]
sidebar_label: Index
sidebar_position: 6
---

# MySQL Index

## 索引类型

我们可以按照四个角度来分类索引。

1. 按「数据结构」分类：**B+tree索引**、**Hash索引**、**Full-text索引**。
2. 按「物理存储」分类：**聚簇索引（主键索引）**、**二级索引（辅助索引）**。
3. 按「字段特性」分类：**主键索引**、**唯一索引**、**普通索引**、**前缀索引**。
4. 按「字段个数」分类：**单列索引**、**联合索引**。

### B-Tree 索引

### 哈希索引

### 全文索引

### 空间数据索引

## Innodb索引

### 前缀索引

### 联合索引

### 聚簇索引

一级索引（主键）

二级索引

### 覆盖索引

## 索引性能

### count 不同用法的性能

`count` 用于统计符合查询条件的记录中非 `NULL` 记录的数量，不同的用法有不同的性能，总来来说**性能排序是 `count(*)=count(1)>count(主键字段)>count(非主键字段)`** 。

在 MySQL 的实现上，`count` 会尽量先去索引上进行统计，因为索引的叶子节点数据量小。`count(expr)` 中的表达式值如果来源于存储引擎，会由存储引擎一条一条返回给Server端进行统计，所以也就决定了少传数据甚至不传数据的速度会更快，性能更高。

# 参考资料

* 《MySQL技术内幕 - InnoDB存储引擎》
* [小林coding - 索引常见面试题](https://xiaolincoding.com/mysql/index/index_interview.html)