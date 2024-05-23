---
title: Triton
tags: [triton, nvidia]
sidebar_label: Triton
sidebar_position: 3
---

# 介绍

> Triton Inference Server provides a cloud and edge inferencing solution optimized for both CPUs and GPUs. Triton supports an HTTP/REST and GRPC protocol that allows remote clients to request inferencing for any model being managed by the server. For edge deployments, Triton is available as a shared library with a C API that allows the full functionality of Triton to be included directly in an application. 

# HTTP/GRPC 协议

[HTTP/REST and GRPC Protocol](https://github.com/triton-inference-server/server/blob/main/docs/protocol/README.md)

Triton uses the [KServe community standard inference protocols](https://github.com/kserve/kserve/tree/master/docs/predict-api/v2)
plus several extensions that are defined in the following documents:

- [Binary tensor data extension](https://github.com/triton-inference-server/server/tree/main/docs/protocol/extension_binary_data.md)
- [Classification extension](https://github.com/triton-inference-server/server/tree/main/docs/protocol/extension_classification.md)
- [Schedule policy extension](https://github.com/triton-inference-server/server/tree/main/docs/protocol/extension_schedule_policy.md)
- [Sequence extension](https://github.com/triton-inference-server/server/tree/main/docs/protocol/extension_sequence.md)
- [Shared-memory extension](https://github.com/triton-inference-server/server/tree/main/docs/protocol/extension_shared_memory.md)
- [Model configuration extension](https://github.com/triton-inference-server/server/tree/main/docs/protocol/extension_model_configuration.md)
- [Model repository extension](https://github.com/triton-inference-server/server/tree/main/docs/protocol/extension_model_repository.md)
- [Statistics extension](https://github.com/triton-inference-server/server/tree/main/docs/protocol/extension_statistics.md)
- [Trace extension](https://github.com/triton-inference-server/server/tree/main/docs/protocol/extension_trace.md)
- [Logging extension](https://github.com/triton-inference-server/server/tree/main/docs/protocol/extension_logging.md)
- [Parameters extension](https://github.com/triton-inference-server/server/tree/main/docs/protocol/extension_parameters.md)

For the GRPC protocol, the [protobuf specification](https://github.com/triton-inference-server/common/blob/main/protobuf/grpc_service.proto) is also available. In addition, you can find the GRPC health checking protocol protobuf specification [here](https://github.com/triton-inference-server/common/blob/main/protobuf/health.proto).

# 参考资料

* [Nvidia官网 - Triton Inference Server Docs](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/getting_started/quickstart.html)
* [Nvidia官网 - Triton Inference Server](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/tritonserver)
* [GitHub - triton-inference-server/server](https://github.com/triton-inference-server/server)
* [GitHub - triton-inference-server/tutorial](https://github.com/triton-inference-server/tutorials)
