---
title: Program
tags: [java, concurrent]
sidebar_label: Program
sidebar_position: 10
---

# 多线程编程

## 生产者消费者模式

问题：设计一个生产者-消费者模式的程序，要求容量大小固定。请实现下面的接口：

```java showLineNumbers
public abstract class ProducerConsumer<T> {
    protected final int capacity;

    protected ProducerConsumer(int capacity) {
        this.capacity = capacity;
    }

    public abstract void produce(Supplier<T> supplier) throws InterruptedException;

    public abstract void consume(Consumer<T> consumer) throws InterruptedException;
}
```

测试程序如下：

```java showLineNumbers
public class ProducerConsumerTest {
    private static final ExecutorService THREAD_POOL = Executors.newScheduledThreadPool(4);
    private final AtomicInteger integer = new AtomicInteger(1);
    
    @Test
    public void test() throws InterruptedException, ExecutionException {
        int capacity = 10;
        ProducerConsumer<Integer> producerConsumer = new ProducerConsumer1<>(capacity);
        List<Runnable> tasks = Arrays.asList(newProducer(
            producerConsumer, "1"), newProducer(producerConsumer, "2"),
            newConsumer(producerConsumer, "1"), newConsumer(producerConsumer, "2"), newConsumer(producerConsumer, "3")
        );
        startThreadsInOrder(tasks).get();
    }

    private Runnable newProducer(ProducerConsumer<Integer> producerConsumer, String name) {
        return asRunnable(() -> producerConsumer.produce(() -> {
            System.out.println("producer " + name + ": produce data " + integer.get());
            return integer.getAndIncrement();
        }));
    }

    private Runnable newConsumer(ProducerConsumer<Integer> producerConsumer, String name) {
        return asRunnable(() -> producerConsumer.consume(i -> {
            System.out.println("consumer" + name + ": consume data " + i);
        }));
    }

    private static CompletableFuture<Void> startThreadsInOrder(List<Runnable> tasks) {
        CompletableFuture<Void>[] futures = new CompletableFuture[tasks.size()];
        for (int i = 0; i < tasks.size(); i++) {
            final Runnable task = tasks.get(i);
            CompletableFuture<Void> future = CompletableFuture.runAsync(task, THREAD_POOL);
            futures[i] = future;
        }
        return CompletableFuture.allOf(futures);
    }

    private static Runnable asRunnable(Executable executable) {
        return () -> {
            try {
                executable.execute();
            } catch (Exception e) {
                Thread.currentThread().interrupt();
            }
        };
    }

    @FunctionalInterface
    public interface Executable {
        void execute() throws Exception;
    }
}
```

### 使用 `wait()` 和 `notifyAll()`

```java showLineNumbers
public class ProducerConsumerImpl<T> extends ProducerConsumer<T> {
    private final Object lock = new Object();
    private final Queue<T> queue = new LinkedList<>();
    private volatile int size = 0;

    public ProducerConsumerImpl(int capacity) {
        super(capacity);
    }

    @Override
    public void produce(Supplier<T> supplier) throws InterruptedException {
        while (true) {
            Thread.sleep(1000);
            synchronized (lock) {
                while (size >= capacity) {
                    lock.wait();
                }
                queue.offer(supplier.get());
                ++size;
                lock.notifyAll();
            }
        }
    }

    @Override
    public void consume(Consumer<T> consumer) throws InterruptedException {
        while (true) {
            Thread.sleep(1200);
            synchronized (lock) {
                while (size <= 0) {
                    lock.wait();
                }
                consumer.accept(queue.poll());
                --size;
                lock.notifyAll();
            }
        }
    }
}
```

输出结果：
```
consumer2: consume data 4
producer 1: produce data 5
producer 2: produce data 6
consumer1: consume data 5
consumer2: consume data 6
producer 1: produce data 7
producer 2: produce data 8
consumer2: consume data 7
consumer1: consume data 8
producer 1: produce data 9
producer 2: produce data 10
consumer2: consume data 9
consumer1: consume data 10
producer 1: produce data 11
producer 2: produce data 12
```

### 使用 `BlockingQueue` 实现

```java showLineNumbers
public class ProducerConsumerImpl<T> extends ProducerConsumer<T> {
    private final BlockingQueue<T> queue;

    public ProducerConsumerImpl(int capacity) {
        super(capacity);
        this.queue = new ArrayBlockingQueue<>(capacity);
    }

    @Override
    public void produce(Supplier<T> supplier) throws InterruptedException {
        while (true) {
            Thread.sleep(1000);
            queue.put(supplier.get());
        }
    }

    @Override
    public void consume(Consumer<T> consumer) throws InterruptedException {
        while (true) {
            Thread.sleep(1200);
            consumer.accept(queue.take());
        }
    }
}
```

### 使用 `Semaphore` 实现

```java showLineNumbers
public class ProducerConsumerImpl<T> extends ProducerConsumer<T> {
    private final Semaphore mutex;
    private final Semaphore size;
    private final Semaphore empty;
    private final Queue<T> queue = new LinkedList<>();

    public ProducerConsumerImpl(int capacity) {
        super(capacity);
        this.mutex = new Semaphore(1);
        this.size = new Semaphore(capacity);
        this.empty = new Semaphore(0);
    }

    @Override
    public void produce(Supplier<T> supplier) throws InterruptedException {
        while (true) {
            Thread.sleep(1000);
            try {
                mutex.acquire();
                size.acquire();
                queue.offer(supplier.get());
            } finally {
                empty.release();
                mutex.release();
            }
        }
    }

    @Override
    public void consume(Consumer<T> consumer) throws InterruptedException {
        while (true) {
            Thread.sleep(1200);
            try {
                mutex.acquire();
                empty.acquire();
                consumer.accept(queue.poll());
            } finally {
                size.release();
                mutex.release();
            }
        }
    }
}
```

## 两线程交替打印

问题：两个线程共同引用一个 `FooBar` 类实例，实现两个线程交替按顺序打印 `"foo"` 和 `"bar"` ，打印 `n` 次。

```java showLineNumbers
class FooBar {
  public void foo() {
    for (int i = 0; i < n; i++) {
      print("foo");
    }
  }

  public void bar() {
    for (int i = 0; i < n; i++) {
      print("bar");
    }
  }
}
```

测试代码如下：

```java showLineNumbers
public class FooBarTest {
    private static final ExecutorService THREAD_POOL = Executors.newScheduledThreadPool(4);

    @Test
    public void test() throws InterruptedException, ExecutionException {
        int n = 10;
        List<String> list = new Vector<>();
        FooBar fooBar = new FooBar(n);
        List<Runnable> tasks = Arrays.asList(
            asRunnable(() -> fooBar.foo(() -> {System.out.println("foo");list.add("foo"); })),
            asRunnable(() -> fooBar.bar(() -> {System.out.println("bar");list.add("bar"); }))
        );
        startThreadsInOrder(tasks).get();

        List<String> expect = new ArrayList<>(n << 1);
        for (int i = 0; i < n; i++) {
            expect.add("foo");
            expect.add("bar");
        }
        Assert.assertEquals(expect, list);
    }

    private static CompletableFuture<Void> startThreadsInOrder(List<Runnable> tasks) {
        CompletableFuture<Void>[] futures = new CompletableFuture[tasks.size()];
        for (int i = 0; i < tasks.size(); i++) {
            final Runnable task = tasks.get(i);
            CompletableFuture<Void> future = CompletableFuture.runAsync(task, THREAD_POOL);
            futures[i] = future;
        }
        return CompletableFuture.allOf(futures);
    }

    private static Runnable asRunnable(Executable executable) {
        return () -> {
            try {
                executable.execute();
            } catch (Exception e) {
                e.printStackTrace();
            }
        };
    }

    @FunctionalInterface
    public interface Executable {
        void execute() throws Exception;
    }
}
```

### 使用 `wait()` 和 `notify()`

```java showLineNumbers
class FooBar {
    private final Object lock = new Object();
    private volatile boolean first = true;
    private final int n;

    public FooBar(int n) {
        this.n = n;
    }

    public void foo(Runnable printFoo) throws InterruptedException {
        for (int i = 0; i < n; i++) {
            synchronized(lock) {
                while (!first) {
                    lock.wait();
                }
                printFoo.run();
                first = false;
                lock.notify();
            }
        }
    }

    public void bar(Runnable printBar) throws InterruptedException {
        for (int i = 0; i < n; i++) {
            synchronized(lock) {
                while (first) {
                    lock.wait();
                }
                printBar.run();
                first = true;
                lock.notify();
            }
        }
    }
}
```

### 使用 `Thread#yield` 让出CPU

```java showLineNumbers
class FooBar {
    private volatile boolean first = true;
    private int n;

    public FooBar(int n) {
        this.n = n;
    }

    public void foo(Runnable printFoo) throws InterruptedException {
        for (int i = 0; i < n;) {
            if (first) {
                printFoo.run();
                i++;
                first = false;
            } else {
                Thread.yield();
            }
        }
    }

    public void bar(Runnable printBar) throws InterruptedException {
        for (int i = 0; i < n;) {
            if (!first) {
                printBar.run();
                i++;
                first = true;
            } else {
                Thread.yield();
            }
        }
    }
}
```

### 使用 `Semaphore`

```java showLineNumbers
class FooBar {
    private final Semaphore foo = new Semaphore(1);
    private final Semaphore bar = new Semaphore(0);
    private int n;

    public FooBar(int n) {
        this.n = n;
    }

    public void foo(Runnable printFoo) throws InterruptedException {
        for (int i = 0; i < n; i++) {
            foo.acquire();
            printFoo.run();
            bar.release();
        }
    }

    public void bar(Runnable printBar) throws InterruptedException {
        for (int i = 0; i < n; i++) {
            bar.acquire();
            printBar.run();
            foo.release();
        }
    }
}
```

### 使用 `CyclicBarrier`

```java showLineNumbers
class FooBar {
    private final CyclicBarrier cyclicBarrier = new CyclicBarrier(2);
    private volatile boolean first = true;
    private int n;

    public FooBar(int n) {
        this.n = n;
    }

    public void foo(Runnable printFoo) throws InterruptedException {
        for (int i = 0; i < n; i++) {
            while (!first);
            printFoo.run();
            first = false;
            try {
                cyclicBarrier.await();
            } catch (BrokenBarrierException e) {
                e.printStackTrace();
            }
        }
    }

    public void bar(Runnable printBar) throws InterruptedException {
        for (int i = 0; i < n; i++) {
            try {
                cyclicBarrier.await();
            } catch (BrokenBarrierException e) {
                e.printStackTrace();
            }
            printBar.run();
            first = true;
        }
    }
}
```

### 使用 `BlockingQueue`

```java showLineNumbers
class FooBar {
    private final BlockingQueue<Integer> fooQueue = new LinkedBlockingDeque<>(1);
    private final BlockingQueue<Integer> barQueue = new LinkedBlockingDeque<>(1);
    private int n;

    public FooBar(int n) {
        this.n = n;
    }

    public void foo(Runnable printFoo) throws InterruptedException {
        fooQueue.offer(0);
        for (int i = 0; i < n; i++) {
            fooQueue.take();
            printFoo.run();
            barQueue.offer(i);
        }
    }

    public void bar(Runnable printBar) throws InterruptedException {
        for (int i = 0; i < n; i++) {
            barQueue.take();
            printBar.run();
            fooQueue.offer(i);
        }
    }
}
```

### 使用 `ReentrantLock`

```java showLineNumbers
class FooBar {
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition condition = lock.newCondition();
    private volatile boolean first = true;
    private int n;

    public FooBar(int n) {
        this.n = n;
    }

    public void foo(Runnable printFoo) throws InterruptedException {
        for (int i = 0; i < n; i++) {
            try {
                lock.lock();
                while (!first) {
                    condition.await();
                }
                printFoo.run();
                first = false;
                condition.signal();
            } finally {
                lock.unlock();
            }
        }
    }

    public void bar(Runnable printBar) throws InterruptedException {
        for (int i = 0; i < n; i++) {
            try {
                lock.lock();
                while (first) {
                    condition.await();
                }
                printBar.run();
                first = true;
                condition.signal();
            } finally {
                lock.unlock();
            }
        }
    }
}
```

## 赛跑比赛

问题：使用多线程模拟学生一起比赛跑步的过程，指令员鸣枪之后学习同时开始赛跑。

### CountDownLatch

`CountDownLatch` 初始化为学生数量的线程，鸣枪后，每个学生就是一条线程，来完成各自的任务，当第一个学生跑完全程后，`CountDownLatch` 就会减一，直到所有的学生完成后，`CountDownLatch` 会变为 `0` ，接下来再一起宣布跑步成绩。

```java showLineNumbers
public class StudentRunRace {
    private final int studentCount;
    private final CountDownLatch stopLatch;
    private final CountDownLatch runLatch;

    StudentRunRace(int studentCount) {
        this.studentCount = studentCount;
        this.stopLatch = new CountDownLatch(1);
        this.runLatch = new CountDownLatch(studentCount);
    }

    private void waitSignal() throws Exception {
        System.out.println("选手" + Thread.currentThread().getName() + "正在等待裁判发布口令");
        stopLatch.await();
        System.out.println("选手" + Thread.currentThread().getName() + "已接受裁判口令");
        Thread.sleep((long) (Math.random() * 10000));
        System.out.println("选手" + Thread.currentThread().getName() + "到达终点");
        runLatch.countDown();
    }

    private void waitStop() throws Exception {
        Thread.sleep((long) (Math.random() * 10000));
        System.out.println("裁判" + Thread.currentThread().getName() + "即将发布口令");
        stopLatch.countDown();
        System.out.println("裁判" + Thread.currentThread().getName() + "已发送口令，正在等待所有选手到达终点");
        runLatch.await();
        System.out.println("所有选手都到达终点");
        System.out.println("裁判" + Thread.currentThread().getName() + "汇总成绩排名");
    }

    public void startRace() {
        ExecutorService service = Executors.newCachedThreadPool();
        for (int i = 0; i < studentCount; i++) {
            service.execute(() -> {
                try {
                    waitSignal();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }
        try {
            waitStop();
        } catch (Exception e) {
            e.printStackTrace();
        }
        service.shutdown();
    }

    public static void main(String[] args) {
        StudentRunRace studentRunRace = new StudentRunRace(10);
        studentRunRace.startRace();
    }
}
```

## 参考资料

* [掘金 - Java实现生产者和消费者的5种方式](https://juejin.cn/post/6844903486895865864)