---
title: Vision Models
tags: [deeplearning, vision]
sidebar_label: Vision Models
sidebar_position: 3
---

# Vision Models

## OpenAI

相关论文：

* 《[DALL·E: Zero-Shot Text-to-Image Generation](https://arxiv.org/abs/2102.12092)》

相关代码：

[GitHub - openai/dall-e](https://github.com/openai/dall-e)

### DALL·E 3

相关论文：

* 《[Improving Image Captioning with Better Use of Captions](https://arxiv.org/abs/2006.11807)》

### Sora

相关论文：

* 《[OpenAI的Sora技术报告](https://openai.com/research/video-generation-models-as-world-simulators)》
* 《[Sora: A Review on Background, Technology, Limitations, and Opportunities of Large Vision Models](https://arxiv.org/abs/2402.17177)》

## Midjourney

### Midjourney v6

## Stability-AI

官网 [stability ai](https://stability.ai/)

### Stable Diffusion 1

Stable Diffusion 是一种潜在的文本到图像的扩散模型。由Stability AI的计算捐赠和LAION的支持，它使用了LAION-5B数据库的一个子集中的512x512张图像来进行训练潜在扩散模型。与谷歌的Imagen类似，该模型使用冻结的CLIP ViT-L/14文本编码器来根据文本提示调整模型。凭借其860M UNet和123M文本编码器，该型号相对较轻，运行在至少10GB VRAM的GPU上。

相关论文：

《[High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752)》

相关代码和模型文件：

* [CompVis/stable-diffusion](https://github.com/CompVis/stable-diffusion)
* [Huggingface - CompVis](https://huggingface.co/CompVis)

### Stable Diffusion 2

Stable Diffusion v2是指模型架构的特定配置，该配置使用具有865M UNet和OpenCLIP ViT-H/14文本编码器的下采样因子8自动编码器作为扩散模型。SD 2-v型号可产生768x768像素的输出。

相关代码和模型文件：

* [GitHub - Stability-AI/stablediffusion](https://github.com/Stability-AI/stablediffusion)
* [GitHub - AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
* [Huggingface - stabilityai](https://huggingface.co/stabilityai/)


### Stable Diffusion 3

相关介绍和论文：

* 《[Stable Diffusion 3: Research Paper](https://stability.ai/news/stable-diffusion-3-research-paper)》
* 《[Stable Diffusion 3 Paper](https://stabilityai-public-packages.s3.us-west-2.amazonaws.com/Stable+Diffusion+3+Paper.pdf)》
* 《[Scaling Rectified Flow Transformers for High-Resolution Image Synthesis](https://arxiv.org/abs/2403.03206)》

## Pika

官网 [pika](https://pika.art)

## Apple

### MM1

相关论文：

《[MM1: Methods, Analysis & Insights from Multimodal LLM Pre-training](https://arxiv.org/abs/2403.09611)》

## HPC-AI Tech

[GitHub - hpcaitech/Open-Sora](https://github.com/hpcaitech/Open-Sora)

[GitHub - hpcai-tech/Open-Sora](https://huggingface.co/hpcai-tech/Open-Sora)

# 参考资料

* [Civitai官网](https://civitai.com)