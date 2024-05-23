---
title: Diffusion
tags: [diffusion]
sidebar_label: Diffusion
sidebar_position: 13
---

# Diffusion

## 相关资料

### DDPM

《[Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239)》

本文是DDPM的奠基之作，是本领域最经典的论文之一。其实扩散模型并不是一个新的概念，这篇论文第一个给出了严谨的数学推导，可以复现的代码，完善了整个推理过程。后面diffusion models相关的论文基本都继承了前向加噪-反向降噪-训练这样的体系。

代码实现：

* 官方TensorFlow实现 [GitHub - hojonathanho/diffusion: Denoising Diffusion Probabilistic Models](https://github.com/hojonathanho/diffusion)
* OpenAI基于PyTorch实现的DDPM+ [GitHub - openai/improved-diffusion: Release for Improved Denoising Diffusion Probabilistic Models](https://github.com/openai/improved-diffusion)
* [GitHub - lucidrains/denoising-diffusion-pytorch: Implementation of Denoising Diffusion Probabilistic Model in Pytorch](https://github.com/lucidrains/denoising-diffusion-pytorch)

### DDIM

《[Denoising Diffusion Implicit Models](https://arxiv.org/abs/2010.02502)》

作者使用简单的重参数化和混合学习目标来学习反向过程方差，该目标将VLB与DDPM的简化目标相结合。在混合目标下，所提出模型获得的对数似然比通过直接优化对数似然获得的对数似然更好，并发现后一个目标在训练期间具有更多的梯度噪声。最关键的是，原先的DDPM需要长达1000steps的推理步骤，而DDIM改善了反向扩散过程中的噪声水平，改变了xt递推公式，在更少的推理步骤(如100步)上取得了更好的结果。这项成果堪称革命性的，后面的大部分diffusion models论文(特别是运算量高的)都采用这一改进技术。

代码实现：

* [GitHub - ermongroup/ddim](https://github.com/ermongroup/ddim)

### 打败GAN

《[Diffusion Models Beat GANs on Image Synthesis](https://arxiv.org/abs/2105.05233)》

其实前面diffusion models也只是在生成领域小火了一把，并没有引起太多人的关注。主要原因有两点：一是扩散模型并没有太多数学理论上的创新；二是在生成指标上不如GANs。而这篇论文的出现把diffusion models的推向了第一波高潮！有三个值得学习的地方：Unet基础上有了很多改进的小trick，classifier-guidance的引入，规范化的代码guided-diffusion。

代码实现：

* [GitHub - openai/guided-diffusion](https://github.com/openai/guided-diffusion)

### GLIDE

《[GLIDE: Towards Photorealistic Image Generation and Editing with Text-Guided Diffusion Models](https://arxiv.org/abs/2112.10741)》

经典的三篇text-to-image的论文：DALLE 2、Imagen、GLIDE。在上半年各领风骚，让text-to-image方向成为diffusion中最受关注的领域。这三篇论文最先推荐的GLIDE的原因是它最先放出完成代码和预训练模型。预训练模型很重要！因为text-to-image领域都是大模型，不放出模型的话，我们这些非大组(指能分到40块显卡以上的)研究者根本无法在这基础上自己做迁移学习。GLIDE的核心跨模态引导公式来自《Diffusion Models Beat GANs on Image Synthesis》中的分类器引导，不同的是，这篇文章并没有给出严谨的证明过程。但是实验结果表明确实取得了很好的效果，后面的研究者从中获得启示，把其他的多模态信息按照这种方法注入，也取得了非常惊艳的结果。

代码实现：

* [GitHub - openai/glide-text2im](https://github.com/openai/glide-text2im/tree/main/glide_text2im)

### Stable Diffusion 原型

《[High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752)》

这篇论文发表在cvpr 2022上，当时就受到了很多研究者们的关注，但是谁也没想到，一年后以latent diffusion models会孵化出stable diffusion这样彻底火出圈的作品。这篇论文有两个关键点值得关注：一是用encoder-decoder放缩到latent域上操作，又回到了生成领域最经典的结构，在latent域(即z)上操作，这种方法在vae上也算常用。二是cross-attention的结构，这种方法早在2020年的论文handwriting diffusion上就用过，但是当时并没有引起广泛的注意。在这之后cross-attention成为多模态的一种常用方法，成为新的常用条件扩散模型。

代码实现：

* [GitHub - CompVis/latent-diffusion](https://github.com/CompVis/latent-diffusion)

### DiT

《[Scalable Diffusion Models with Transformers](https://arxiv.org/abs/2212.09748)》

Diffusion和Transformer的结合体，替换了Unet。

代码实现：

* [GitHub - facebookresearch/DiT](https://github.com/facebookresearch/DiT)

## Diffusion Model

可参考 [Lilian Weng - What are Diffusion Models](https://lilianweng.github.io/posts/2021-07-11-diffusion-models/#forward-diffusion-process) 和 [由浅入深了解Diffusion Model - ewrfcas的文章 - 知乎](https://zhuanlan.zhihu.com/p/525106459) 文章。

![不同生成模型的对比](../../../../static/images/deeplearning/vision/vision_model_compare.png)
<center>不同生成模型的对比</center>


# 参考资料

* [Lilian Weng - What are Diffusion Models?](https://lilianweng.github.io/posts/2021-07-11-diffusion-models/#forward-diffusion-process)
* [由浅入深了解Diffusion Model - ewrfcas的文章 - 知乎](https://zhuanlan.zhihu.com/p/525106459)
* [怎么理解今年 CV 比较火的扩散模型（DDPM）？ - 小小将的回答 - 知乎](https://www.zhihu.com/question/545764550/answer/2670611518)
* [如何通俗理解扩散模型？ - HeptaAI的文章 - 知乎](https://zhuanlan.zhihu.com/p/563543020)
* [Diffusion Models从入门到放弃：必读的10篇经典论文 - 沉迷单车的文章 - 知乎](https://zhuanlan.zhihu.com/p/595866176)
* [十分钟读懂Diffusion：图解Diffusion扩散模型 - 绝密伏击的文章 - 知乎](https://zhuanlan.zhihu.com/p/599887666)
