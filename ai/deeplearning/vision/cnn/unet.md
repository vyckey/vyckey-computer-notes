---
title: U-Net
tags: [deeplearning, unet]
sidebar_label: U-Net
sidebar_position: 10
---

# U-net

U-Net模型是一种语义分割的深度学习网络结构，由Olaf Ronneberger、Philipp Fischer和Thomas Brox于2015年提出，主要应用于生物医学图像的分割。U-Net模型的名字来源于其网络结构的形状，类似于英文字母“U”，它由左半边的压缩通道（Contracting Path）和右半边扩展通道（Expansive Path）组成。

在压缩通道，U-Net采用典型的卷积神经网络结构，通过重复的卷积层和最大池化层提取特征。每次进行池化操作后，特征图的维度会翻倍。而在扩展通道，首先通过反卷积操作使特征图的维度减半，然后与压缩通道中对应裁剪得到的特征图进行拼接，形成一个更大维度的特征图。随后，再通过卷积层进行特征提取，并重复这一结构。最后，在输出层，使用卷积层将特征图映射成最终的输出图。

U-Net模型的一个显著特点是其能够利用较少的训练样本得到较为准确的分割结果。这主要得益于其编码器-解码器结构以及特征图的拼接操作，使得模型能够充分提取和利用图像中的上下文信息。

# 参考资料

* Arxiv论文《[U-Net: Convolutional Networks for Biomedical Image Segmentation](https://arxiv.org/abs/1505.04597)》