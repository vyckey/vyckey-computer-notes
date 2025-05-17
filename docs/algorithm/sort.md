---
title: Sort
tags: [sort]
sidebar_label: Sort
sidebar_position: 10
---

# 排序

## 排序算法

### 冒泡排序

排序思想：两两元素比较，大的通过交换位置放后面，每轮完成最大元素在最右边，多轮处理直到有序。

### 选择排序

排序思想：每次选取最大的元素放到最右边（或最小元素放左边），多轮处理直到有序。

### 插入排序

排序思想：每次处理一个元素，往前插入前面的有序子序列，直到遍历处理完所有元素。

### 希尔排序

### 快速排序

排序思想：选择一个元素作为pivot，比pivot小的放左边，大于等于pivot的放右边，递归处理左右两边的子序列。

```java title="QuickSort.java" showLineNumbers
public class QuickSort {
    public static void main(String[] args) {
        int[] arr = new int[]{4, 3, 2, 4, 5, 4, 7, 1, 2, 8, 0};
        quickSort(arr);
        System.out.println(Arrays.toString(arr));
    }

    public static void quickSort(int[] arr) {
        quickSort(arr, 0, arr.length);
    }

    private static void quickSort(int[] arr, int start, int end) {
        if (start + 1 >= end) {
            return;
        }
        int mid = partition(arr, start, end);
        quickSort(arr, start, mid);
        quickSort(arr, mid + 1, end);
    }

    private static int partition(int[] arr, int start, int end) {
        int pivot = arr[start];
        int index = start + 1; //下一个小元素存放位置
        for (int i = index; i < end; i++) {
            if (arr[i] < pivot) {
                swap(arr, index, i);
                index++;
            }
        }
        index--;
        swap(arr, start, index);
        return index;
    }

    private static int partition2(int[] arr, int start, int end) {
        int pivot = arr[start];
        int i = start + 1, j = end - 1;
        while (i < j) {
            while (i < j && arr[i] < pivot) {
                i++;
            }
            while (i < j && arr[j] >= pivot) {
                j--;
            }
            swap(arr, i, j);
        }
        if (arr[i] >= pivot) {
            i--;
        }
        swap(arr, start, i);
        return i;
    }

    private static void swap(int[] arr, int i, int j) {
        if (i != j) {
            int tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
    }
}
```

### 归并排序

排序思想：对序列进行一分为二成两个子序列，对两个子序列递归处理，当两个子序列有序时，对两个有序子序列进行合并。

### 桶排序

排序思想：元素的值范围较小，且元素值比较连续，对值相同的元素进行计数，最后按桶元素值和计数值进行一次排放。

### 计数排序

排序思想：类似于桶排序，不过桶的值不太连续，可以采用哈希表存储每个元素的个数，最后按桶元素值和计数值进行一次排放。

### 基数排序

排序思想：对元素按位进行分桶排序，依次处理低位到高位，最终序列有序。

## 参考资料

* [JavaGuide - 十大经典排序算法](https://javaguide.cn/cs-basics/algorithms/10-classical-sorting-algorithms.html)