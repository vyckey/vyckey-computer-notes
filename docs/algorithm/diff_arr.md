---
title: 差分数组
tags: [algorithm]
sidebar_label: Diff Array
sidebar_position: 40
---

# 差分数组

差分数组的主要适用场景是频繁对原始数组的某个区间的元素进行增减。

比如，给定一个数组 `nums`，然后又要求给区间 `nums[2..6]` 全部加 `1`，再给 `nums[3..9]` 全部减 `3`，再给 `nums[0..4]` 全部加 `2` ...，问题是求解最终的数组 `nums` 值，常规思路是对每个区间 `nums[i..j]` 加上 `val` ，多次循环之后即可得到结果，然而该方法的最坏时间复杂度为 $O(n^2)$ ，还有一种更优的方法，时间复杂度为 $O(n)$ ，也就是使用差分数组。

## 差分数组

假设我们有一个原始数组 `arr` ，长度为 `n` ，那么差分数组 `diff_arr` 长度也为 `n` ，其每个元素的值为 `diff_arr[i]=arr[i]-arr[i-1]` ，特别地 `diff_arr[0]=arr[0]` ，也就是相邻元素之差。

假设我们有原始数组 `arr=[a, b, c, d, e, f, g, h]` ，我们可以得出差分数组 `diff_arr` ：

```
arr     = [a,  b,  c,   d,   e,   f,   g,   h]
dff_arr = [a, b-a, c-b, d-c, e-d, f-e, g-f, h-g]
```

然后我们对差分数组 `diff_arr` 求前缀和，可以发现差分数组的前缀和就是原始数组 `arr` ：

```
dff_arr        = [a, b-a, c-b, d-c, e-d, f-e, g-f, h-g]
prefix_sum_arr = [a,  b,  c,   d,   e,   f,   g,   h]
```

接下来，我们对原始数组 `arr[2..5]` 区间加上值 `m` ，我们再看差分数组的结果，我们可以看到只需要执行 `diff_arr[2]+=m, diff_arr[6]-=m` 操作即可：

```
arr      = [a,  b,  c+m,   d+m, e+m, f+m,  g,    h]
diff_arr = [a, b-a, c-b+m, d-c, e-d, f-e, g-f-m, h-g]
```

综上，我们可以得出**差分数组的性质**：

* 对差分数组求前缀和数组即可恢复为原始数组。
* 对原始数组的区间 `[i..j]` 进行加 `m` 值，对应其差分数组的操作为对 `i` 下标加 `m` ，对 `j+1` 下标减 `m` 。
* 使用差分数组可以使得大量的区间加操作时间复杂度降为 $O(n)$ 。

## 应用实践

### 航班预定统计

题目内容见[LeetCode - 航班预定统计](https://leetcode.cn/problems/corporate-flight-bookings/)。

使用差分数组的数据结构，我们可以得出如下解：

```java showLineNumbers
public class Solution {
    public int[] corpFlightBookings(int[][] bookings, int n) {
        int[] diffArr = new int[n];
        for (int[] booking : bookings) {
            diffArr[booking[0] - 1] += booking[2];
            if (booking[1] < n) {
                diffArr[booking[1]] -= booking[2];
            }
        }
        for (int i = 1; i < n; i++) {
            diffArr[i] = diffArr[i] + diffArr[i - 1];
        }
        return diffArr;
    }
}
```

## 参考资料

* [LeetCode](https://leetcode.cn/)