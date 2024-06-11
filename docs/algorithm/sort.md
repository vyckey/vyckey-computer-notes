---
title: Sort
tags: [sort]
sidebar_label: Sort
sidebar_position: 1
---

# Sort

## 快速排序

```java
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

## 归并排序

## 冒泡排序

## 桶排序