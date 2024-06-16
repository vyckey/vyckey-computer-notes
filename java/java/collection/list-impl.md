---
title: List实现
tags: [java, collection, list]
sidebar_label: List Implementation
sidebar_position: 3
---

# List实现

## ArrayList

### 源码解读

```java
public class PrintArrayListGrow {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        Field field = list.getClass().getDeclaredField("elementData");
        field.setAccessible(true);

        for (int i = 0; i <=50; i++) {
            if (i > 0) {
                list.add(i);
            }
            Object[] elementData = field.get(list);
            System.out.println("i= " + i + ", size=" + list.size() +
                 ", real_size=" + elementData.length + ", arr=" + Arrays.toString(elementData));
        }
    }
}
```

## LinkedList

## CopyOnWriteList

## 参考资料

* [JavaGuide - ArrayList 源码分析](https://javaguide.cn/java/collection/arraylist-source-code.html)
* [JavaGuide - LinkedList 源码分析](https://javaguide.cn/java/collection/linkedlist-source-code.html)