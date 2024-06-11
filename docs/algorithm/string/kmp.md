---
title: KMP 算法
tags: [algorithm, kmp]
sidebar_label: KMP
sidebar_position: 6
---

# KMP 算法

KMP（Knuth–Morris–Pratt algorithm）算法用于字符串查找。

## 算法介绍

### 字符串前缀和后缀

假设我们有字符串 `S` ，长度为 `len` ，那么对于任意 `0<=i<len-1` `S[0..i]` 是字符串 `S` 的前缀，对于任意 `0<=j<len-1` `S[j..len-2]` 是字符串 `S` 的后缀。

举例来说，假设我们有 `S="ababa"` ，那么它的前缀有 `"a", "ab", "aba", "abab"` ，它的后缀有 `"a", "ba", "aba", "baba"` 。其前缀和后缀相同的有 `"a", "aba"` ，最大相同前后缀的是 `"aba"` ，长度为 `3` 。

### 部分匹配表

部分匹配表(Partial Match Table)的数组是实现 KMP 算法的核心数据结构，它存储的是待匹配的字符串在每个位置的**最大相同前后缀长度**。假设待匹配字符串为 `S` ，其长度为 `len` ，那么部分匹配表是一个长度为 `len` 每个元素是整型的数组 `PMT[len]`，对于 `i` 位置，其对应的值 `PMT[i]` 为子串 `S[0..i]` 的最大相同前后缀长度。

下面以字符串 `S="abababca"` 举例说明：

| char | a | b | a | b | a | b | c | a |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| value | 0 | 0 | 1 | 2 | 3 | 4 | 0 | 1 |

对于 `index=4` ，子串 `"ababa"` 的最大相同前后缀是 `"aba"` ，长度为 `3` ，其他位置的同理。

### 匹配过程

假设有我们在字符串 `s="ababababca"` 中查找目标字符串 `w="abababca"` ，我们有两个指针 `i` 和 `j` 分别指向字符串 `s` 和 `w` 待匹配的位置。下面左边是迭代了7次匹配之后的结果， `s[6]` 和 `w[6]` 两个字符不相等，发生了第一次字符不匹配。

如果按常规方法，我们会让 `i=j=1` 重新开始匹配，再次迭代对每个字符进行匹配，但是明显这样效率很低。可以注意到子串 `s[2..5]` 和 `w[0..3]` 完全一样，我们不需要再次回到 `i=j=1` 的位置，我们让 `s[2]` 和 `w[0]` 对齐，也就是右边所展示的样子，`i` 保持不变，让 `j=4` 指向前面的位置，然后再次迭代字符匹配，这样效率明显高了很多。

通过观察下面波浪线和等于号标识的子字符串，我们可以观察到， `s[2..5]` 和 `w[0..3]` 其实是 `"ababab"` 的后缀和前缀。从这个启发我们可以知道，当发生字符不匹配的时候，也就是 `s[i]!=w[j]` 的时候，我们看 `w[0..j-1]` 的最大相同前后缀长度是多少，假设为 `l` ，我们让 `j=l` 重新指向新的位置匹配即可。

```
          (i=6)                             (i=6)
            |                                 |
a b a b a b a b c a               a b a b a b a b c a
    ~ ~ ~ ~                           ~ ~ ~ ~
a b a b a b c a                       a b a b a b c a
= = = =     |                         = = = = |
            |                                 |
          (j=6)                             (j=4)
```

所以前面介绍的**部分匹配表**就大有用处，我们获取 `pmt[j-1]` 的值就可以知道子串的最大相同前后缀长度是多少。为了方便，我们可以把 `pmt` 对应的值整体往后移动一个位置，也就是 `pmt[i+1]=pmt[i]` ，上面字符串 `S="abababca"` 的 `pmt` 经过调整之后称为 `next` 数组，如下所示：

| char | a | b | a | b | a | b | c | a |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| pmt | 0 | 0 | 1 | 2 | 3 | 4 | 0 | 1 |
| next | -1 | 0 | 0 | 1 | 2 | 3 | 4 | 0 | 1 |

### next数组的构建

`next[j]` 的值就是求待匹配字符串 `w` 的长度为 `j` 的子字符串 `w[0..j-1]` 的最大相同前后缀长度。我们可以看做是在字符串 `w[1..j-1]` 中查找 `w[0..j-2]` 的过程，相当于

```
(1) next[0]=-1, next[1]=0

(2) next[2]=0
[-a b] a b a b c a
    |
   [a -b] a b a b c a

(3) next[3]=1
[-a b a] b a b c a
      |
     [a b -a] b a b c a

(4) next[4]=2
[-a b a b] a b c a
        |
     [a b a -b] a b c a

(5) next[5]=3
[-a b a b a] b c a
          |
     [a b a b -a] b c a

(6) next[6]=4
[-a b a b a b] c a
            |
     [a b a b a -b] c a

(6) next[7]=0
[-a b a b a b c] a
              |
             [a b a b a b -c] a
```

### 代码实现

```java
public class KMP {
    public static void main(String[] args) {
        String[][] testCases = new String[][]{
            {"a", "a"},
            {"a", "b"},
            {"ababababca", "abababca"},
            {"ababcd", "ababcababdababcd"}
        };
        for (String[] testCase : testCases) {
            String s = testCase[0], w = testCase[1];
            int[] next = next(w);
            int index = find(s, w, next);
            int index2 = s.indexOf(w);
            if (index != index2) {
                throw new AssertionError("find target string '" + w + "' in string '" + s + 
                "', expect is " + index2 + ", real is " + index + ".");
            }
        }
    }

    private static int[] next(String w) {
        int[] next = new int[w.length()];
        next[0] = -1;
        int i = 1, j = 0;
        while (i < w.length()) {
            if (j == -1 || w.charAt(i) == w.charAt(j)) {
                i++;
                j++;
                if (i < w.length()) {
                    next[i] = j;
                }
            } else {
                j = next[j];
            }
        }
        return next;
    }

    private static int find(String s, String w, int[] next) {
        int i = 0,  j = 0;
        while (j < w.length() && i < s.length()) {
            if (j == -1 || s.charAt(i) == w.charAt(j)) {
                ++i;
                ++j;
            } else {
                j = next[j];
            }
        }
        return j == w.length() ? i - w.length() : -1;
    }
}
```


# 参考资料

* [Wikipedia - KMP算法](https://zh.wikipedia.org/wiki/KMP%E7%AE%97%E6%B3%95)