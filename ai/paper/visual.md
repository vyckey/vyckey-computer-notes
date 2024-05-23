---
title: Visual Model Paper
tags: [paper, visual]
sidebar_label: Visual Model
sidebar_position: 2
---

# Vision Transformer

《[An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale](https://arxiv.org/abs/2010.11929)》

《[Vivit: A video vision transformer](https://arxiv.org/abs/2103.15691)》

# Diffusion Model

《[Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239)》

UC伯克利分校发表于2020年，第一次使用扩散模型在图像生成任务调出了好的效果。

《[Denoising Diffusion Implicit Models](https://arxiv.org/abs/2010.02502)》

斯坦福大学发表于ICLR 2021。本文在保持DDPM训练目标不变的条件下，加速了扩散模型的采样过程。

《[High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752)》

不同于以往扩散模型直接在高维像素空间中采样的低效做法，文中先用VAE将高维的像素空间压缩为低维的潜空间，然后在低维的潜空间中进行前向扩散和逆向采样，大大提高了扩散模型在图像生成任务上的效率。2022年开始大火的Stable Diffusion，其底层的模型正是LDM。

《[Diffusion Models Beat GANs on Image Synthesis](https://arxiv.org/abs/2105.05233)》

OpenAI于2021年5月份发表。文中提出classifier guidance用于条件生成，在ImageNet的图像生成任务上的性能首次超过了基于GAN的方法。

《[GLIDE： Towards Photorealistic Image Generation and Editing with Text-Guided Diffusion Models](https://arxiv.org/abs/2112.10741)》

OpenAI于2021年12月发表。文中提出了CFG(Classifier Free Guidance，无分类器引导)可以在图像生成的多样性和保真度上取得平衡。

《[Score-Based Generative Modeling through Stochastic Differential Equations](https://arxiv.org/abs/2011.13456)》

本文由斯坦福大学的宋飏博士发表于ICLR 2021，构建了一个相当一般化的扩散模型理论框架，将DDM、SDE和ODE等诸多结果联系在一起。

《[Scalable diffusion models with transformers](https://arxiv.org/abs/2212.09748)》

这篇论文的作者是William (Bill) Peebles和谢赛宁，而Bill正是Sora的核心研发人员。这篇论文首次提出将Transformer应用于扩散模型。Sora与Stable Diffusion等现有的潜在扩散模型最大的不同之处可能就在于这一部分。在这篇论文中，介绍了一种将StableDiffusion等模型中的Unet结构替换为Transformer的模型。

# Models

# 参考资料

