---
title: LoRA
tags: []
sidebar_label: LoRA
sidebar_position: 10
---

# LoRA

## 相关资料

相关论文：

* 《[LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)》
* 《[FedPara: Low-Rank Hadamard Product for Communication-Efficient Federated Learning](https://arxiv.org/abs/2108.06098)》

相关代码：

* [GitHub - microsoft/LoRA](https://github.com/microsoft/LoRA)
* [GitHub - KohakuBlueleaf/LyCORIS](https://github.com/KohakuBlueleaf/LyCORIS)

## 相关理论

![LoRA架构](../../../static/images/deeplearning/more/lora.png)

$$
\begin{align}
{W}`=W_0+\Delta{W}=W_0+AB^T \qquad\text{其中}A\in\mathbb{R}^{n\times{d}},B\in\mathbb{N}^{d\times m},d\ll m
\end{align}
$$

LoRA的实现流程如下：

1. 在原始预训练语言模型（PLM）旁边增加一个旁路，做一个降维再升维的操作，来模拟所谓的内在秩。
2. 训练的时候固定PLM的参数，只训练降维矩阵 $A$ 与升维矩阵 $B$ 。
3. 模型的输入输出维度不变，输出时将 $BA$ 与PLM的参数叠加。
4. 用随机高斯分布初始化 $A$ ，用 $0$ 矩阵初始化 $B$ ，保证训练的开始此旁路矩阵依然是 $0$ 矩阵。

# 参考资料

* [深入浅出完整解析LoRA(Low-Rank Adaptation)模型核心基础知识 - Rocky Ding的文章 - 知乎](https://zhuanlan.zhihu.com/p/639229126)
