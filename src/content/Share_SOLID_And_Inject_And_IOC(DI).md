---
title_en: Share SOLID And Inject And IOC(DI)
title: 分享 SOLID 和 Inject 和 IOC(DI)
date: 2022-05-26
---


# 5.26 分享 SOLID & IOC


本次分享主题是依赖注入与控制反转。在进入主题前我们可以先复习一下 Robert C. Martin 总结出的面向对象设计的 SOLID 五条设计原则。 这五条原则具有很好的建设性，一般遵循这五条原则进行面向对象编程设计迭代项目，可以尽可能的避免代码出現坏味道，提升代码的质量和可维护性。


## SOLID 简单介绍

- [**S**](https://en.wikipedia.org/wiki/Single-responsibility_principle)[ - Single-responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle) 单一职责原则
- [**O**](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)[ - Open-closed Principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle) 开闭原则
- [**L**](https://en.wikipedia.org/wiki/Liskov_substitution_principle)[ - Liskov Substitution Principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle) 里氏替换原则
- [**I**](https://en.wikipedia.org/wiki/Interface_segregation_principle)[ - Interface Segregation Principle](https://en.wikipedia.org/wiki/Interface_segregation_principle) 接口隔离原则
- [**D**](https://en.wikipedia.org/wiki/Dependency_inversion_principle)[ - Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle) 依赖倒置原则

### [**S**](https://en.wikipedia.org/wiki/Single-responsibility_principle)[ - Single-responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle) 单一职责原则

> There should never be more than one reason for a class to change.

单一职责指出：一个类的的实现最好只做一件事，换句话说就是需要保证每一个类只负责一类事。


举个例子：有 Square 和 Circle 两个类，我们提供一个计算面积和输出结果的 AreaCalculator 类


```typescript
class Square {
    constructor(public length: number) { }
}

class Circle {
    constructor(public radius: number) { }
}

class AreaCalculator {
    constructor(protected shapes: (Square|Circle)[]) { }

    public sum() {
        return this.shapes.reduce((sum,shape: Square|Circle,index: number) => {
            if(shape instanceof Square) {
                return sum+=Math.pow(shape.length,2);
            }
            if(shape instanceof Circle) {
                return sum+=Math.PI*Math.pow(shape.radius,2);
            }
            return sum;
        },0)

    }

    public output() {
        console.log('Sum of the areas of provided shapes: '+this.sum())
    }
}

// 使用：

const shapes=[
    new Circle(2),
    new Square(5),
    new Square(6),
];

const areas=new AreaCalculator(shapes);

areas.output();

// 上面的实现的 AreaCalculator 并未遵循 单一职责原则。 （即实现了计算面积的方法，也实现了输出方法）
// 假如我们希望 output 方法能打印出结构化数据，而不止打印出字符串。
// 我们可以做如下改造：
// 把 output 抽象成一个 SumCalculatorOutputter 类

class SumCalculatorOutputter {
    constructor(protected calculator: AreaCalculator) { }

    public toJSON() {
        const data={sum: this.calculator.sum()};
        console.log(JSON.stringify(data));
    }

    public toString() {
        console.log('Sum of the areas of provided shapes: '+this.calculator.sum())
    }
}

// 使用：

const shapes = [
  new Circle(2),
  new Square(5),
  new Square(6),
];

const areas = new AreaCalculator(shapes);
const output = new SumCalculatorOutputter(areas);

output.toJSON();
output.toString();
```


### [**O**](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)[ - Open-closed Principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle) 开闭原则

> Objects or entities should be open for extension but closed for modification.

开闭原则指出：在面向对象设计结构的时候，保证结构具有可扩展性而无需对其内部进行修改。


回顾之前的 AreaCalculator 类，当我们需要增加新的形状，例如 三角形或者长方形。则需要对 sum 方法进行改写。这违背了开闭原则。


```typescript
class AreaCalculator {
    public constructor(protected shapes: (Square|Circle)[]) { }

    public sum() {
        return this.shapes.reduce((sum,shape: Square|Circle,index: number) => {
            if(shape instanceof Square) {
                return sum+=Math.pow(shape.length,2);
            }
            if(shape instanceof Circle) {
                return sum+=Math.PI*Math.pow(shape.radius,2);
            }
            return sum;
        },0)

    }
}

// 我们可以考虑把 sum 方法中的 caculator area 方法分散到每一个 shape 类中。
interface IShape{
    area():number;
}

class Square implements IShape{
    constructor(public length: number) { }

    public area() {
        return Math.pow(this->length, 2);
    }
}

class Circle implements IShape {
    constructor(public radius: number) { }

    public area() {
        return Math.PI*Math.pow(this.radius,2);
    }
}

class AreaCalculator {
    public constructor(protected shapes: IShape[]) { }

    public sum() {
      return this.shapes.reduce((sum,shape: IShape,index: number) => (sum+shape.area()),0)
    }
}

// 我们还可以添加 Rectangle 类

class Rectangle implements IShape {
    constructor(public width: number,public height: number) { }

    public area() {
        return this.width*this.height;
    }
}
```


### [**L**](https://en.wikipedia.org/wiki/Liskov_substitution_principle)[ - Liskov Substitution Principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle) 里氏替换原则

> Let q(x) be a property provable about objects of x of type T. Then q(y) should be provable for objects y of type S where S is a subtype of T.

里氏替换原则指出：作为依赖的父类可被继承自父类的子类所替换而不影响逻辑和功能。


我们假设有一个新的 AreaCalculator2 类继承于 AreaCalculator， 其计算结果输出结构化数据。


```typescript
class AreaCalculator2 extends AreaCalculator {
    constructor(shapes: IShape[]) {
        super(shapes);
    }

    public sum():any {
        return {sum: this.shapes.reduce((sum:number,shape: IShape,index: number) => (sum+shape.area()),0)};
    }
}

// 使用 AreaCalculator2 和 AreaCalculator

const shapes = [
  new Circle(2),
  new Square(5),
  new Square(6),
];

const areas = new AreaCalculator(shapes);
const areas2 = new AreaCalculator2(shapes);

const output = new SumCalculatorOutputter(areas);
const output2 = new SumCalculatorOutputter(areas2);

output.toString();
// expected output: "Sum of the areas of provided shapes: 73.56"
output2.toString();
// expected output: "Sum of the areas of provided shapes: [object Object]"

// AreaCalculator2 类违背了里氏替换原则，它改写了 sum 方法，返回了 map 数据结构的数据。
// 这对原有功能造成了影响。
// 合适的改写可以另起一个方法来实现新的功能或者保证返回的数据能遵循父类的定义。

class AreaCalculator2 extends AreaCalculator {
    constructor(shapes: IShape[]) {
        super(shapes);
    }

    public sumToMap() {
        return {sum: this.shapes.reduce((sum:number,shape: IShape,index: number) => (sum+shape.area()),0)};
    }
}
```


### [**I**](https://en.wikipedia.org/wiki/Interface_segregation_principle)[ - Interface Segregation Principle](https://en.wikipedia.org/wiki/Interface_segregation_principle) 接口隔离原则

> A client should never be forced to implement an interface that it doesn’t use, or clients shouldn’t be forced to depend on methods they do not use.

接口隔离原则指出：我们在实现类的时候不需要强制实现类自身不需要的接口，依赖调用方不需要去依赖它不需要的方法。即我们在做接口设计的时候得考虑接口粒度，接口的能力范畴不能太大太泛。


例如上文提到的 `IShape Interface`， 假设我们为其增加了 volume 的方法声明，如下所示：


```typescript
interface IShape{
    area():number;
    volume():number;
}

// 如果这样设计，在实现 Square 类的时候我们就必须实现 volume 方法，这是不合理的
// 故我们要将 volume 拆分出来，满足接口隔离原则。

interface IThreeDimensionalShape{
    volume():number;
}

interface IShape{
    area():number;
}

class Cube implements IShape,IThreeDimensionalShape {
    constructor(public length: number) { }
    public area() {
        return Math.pow(this.length,2)*6;
    }

    public volume() {
        return Math.pow(this.length,3)
    }
}
```


### [**D**](https://en.wikipedia.org/wiki/Dependency_inversion_principle)[ - Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle) 依赖倒置原则

> Entities must depend on abstractions, not on concretions. It states that the high-level module must not depend on the low-level module, but they should depend on abstractions.

依赖倒置原则指出，依赖方不能依赖于确切的类，应该依赖于抽象接口。


如果不理解这条原则没关系，我们可以先从依赖注入讲起。


## 依赖注入讲解


在软件工程中，依赖注入是一种设计模式，一个客户端对象（Client）接收它所依赖的其他对象（Service）。作为一种控制反转的形式，依赖注入旨在分离构建对象和使用对象的关注点，从而构建松耦合的程序。该模式确保想要使用特定服务的对象不必知道如何构建这些服务。客户端对象由注入器提供其依赖关系，注入的依赖对象无需要感知这些依赖关系。


我们可以看这么一个场景：


假设有四样家具：

    - 木头桌子
    - 木头椅子
    - 塑料桌子
    - 塑料椅子

每个家具有四个属性：

    - 燃点
    - 密度
    - 价格
    - 重量

我们如何实现四个家具类呢？


```typescript
interface Material{
	private density:number;
	private burning:number;
  public getDensity():number;
	public getBurningPoint():number;
}

class Wood implements Meterial{
	constructor(private density = 10,private burning = 10){}
  public getDensity(){
		return this.density;
	}
	public getBurningPoint(){
		return this.burning;
	}
}

class Plastic implements Meterial{
	constructor(private density = 20,private burning = 20){}
  public get Density(){
		return this.density;
	}
	public get BurningPoint(){
		return this.burning;
	}
}

interface Furniture{
	private volume:number;
	private price:number;
	private material: Material;
	public getWeight():number;
	public getBurningPoint():number;
}

class Desk implements Furniture{
	constructor(private material:Material, private volume = 10, private price: 20 ){}
	public getWeight(){
		return this.volume * this.material.Density;
	}
	public getBurningPoint(){
		return this.material.BurningPoint;
	}
}

class Chair implements Furniture{
	constructor(private material:Material, private volume = 10, private price: 20 ){}
	public getWeight(){
		return this.volume * this.material.Density;
	}
	public getBurningPoint(){
		return this.material.BurningPoint;
	}
}

// 我们通过注入 Material 抽象来达到设置不同家具拥有不同的材质。这儿就是一种依赖注入——构造函数注入（Constructor injection），在本文中，我们主要讨论构造函数依赖注入。
// 依赖注入还有 设定器注入(Setter injection) 和 接口注入(Interface injection)、参数注入 (Parameter injection) 等等。


// 上面的例子，其实也体现了 依赖倒置（Dependency inversion) 的思想，通过抽象出 Material Interface，注入到 Furniture 中，Furniture 无需关注 Material 的实现，只需要关注接口调用即可，
// Wood 和 Plastic 也无需关注如何被调用，只需要关注自身如何实现 Material 定义的接口即可。
// Furniture 和 Wood、Plastic 都依赖于 Material。这即实现了控制反转 （Inversion of control）或者说 依赖倒置（Dependency inversion）
// 在 Furniture 和 依赖类（Wood 和 Plastic）之间抽象出一层 Material Interface，使双方都依赖接口编程，这很好的剥离了各自的关注点。

// 可以再举个例子：

class Katana {
    hit() {
        return "cut!";
    }
}

class Shuriken {
    throw() {
        return "hit!";
    }
}

class Ninja {
    constructor(private weapon: Katana | shuriken ) { }
    fight() {
			if (this.weapon instanceof Katana){
				 return this.weapon.hit();
			}
			if(this.weapon instanceof Shuriken){
				return this.weapon.throw();
			}
		};
}

// 换个写法，先声明 Weapon interface

interface Weapon{
	attack():string;
}


class Katana implements Weapon {
    hit() {
        return "cut!";
    }
		attack(){
			return this.hit();
		}
}

class Shuriken implements Weapon {
    throw() {
        return "hit!";
    }
		attack(){
			return this.throw();
		}
}

class Ninja {
    constructor(private weapon: Weapon) { }
    fight() {
			return this.weapon.attack();
		};
}

// 现在，忍者需要一个新武器 Wand, 他无需念咒语，直接使用 attack 就可以 '除你武器'

class Wand implements Weapon{
		expelliarmus(){
			return 'Expelliarmus';
		}

		attack(){
			return this.expelliarmus();
		}
}
```


### Dependency inversion 的优点

- 我们使用接口抽象了具体的实现类。依赖方耦合的是接口，而不是实现类，这增加了程序的可扩展性。这也体现了面向对象编程的特性之一 —— 多态。
- 讲依赖方的实现和注入依赖的实现解偶，双方无需关注对方的实现。
- 把各自模块的重点放在各自所设计的任务上，将模块从依赖方的系统中分离出来，各自依靠契约规范来进行交流。
- 防止在替换模块时产生副作用。

PS： Dependency inversion 的缺点可能就是提升了代码的抽象性，抽象的封装屏蔽了细节，不易于理解，但是这瑕不掩瑜。


PS： 我们在平时开发常常看到很多库都有插件系统，或者流水线的原子服务，微服务之间通过 RPC 调用通信都是很好的 IOC 例子。


PS： 控制反转还有很多种实现方式（例如策略模式或者模板方法模式），依赖倒置是一种控制反转的实现方式。


接下来进入实战环节，我们可以看看一个 Denpendency Inject 的 JS 库的实现。


## TSyringeJS 库源码解读


### 前置知识

- Metadata API （[Metadata Proposal - ECMAScript (rbuckton.github.io](https://rbuckton.github.io/reflect-metadata/)）
    - 元数据 API，提供在目标类，方法属性上获取和设置元数据使用。
    - TypeScript 提供了结合这一特性来和装饰器来自动弹射出参数，类，方法属性的元信息，需要在 tsconfig 里设置来开启，并配合 [https://github.com/rbuckton/reflect-metadata](https://github.com/rbuckton/reflect-metadata) 或者 [https://github.com/abraham/reflection](https://github.com/abraham/reflection) 使用（polyfill）

        ```typescript
        {
          "compilerOptions": {
        		...
            "experimentalDecorators": true,
            "emitDecoratorMetadata": true
          }
        }
        ```

    - 详细的装饰器元信息介绍：[TypeScript: Documentation - Decorators (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/decorators.html#metadata)
- 我们只需要先了解

    ```typescript
    // define metadata on an object or property
    Reflect.defineMetadata(metadataKey, metadataValue, target);
    Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);

    // get metadata value of a metadata key on the prototype chain of an object or property
    Reflect.getMetadata(metadataKey, target);
    Reflect.getMetadata(metadataKey, target, propertyKey);

    // get metadata value of an own metadata key of an object or property
    Reflect.getOwnMetadata(metadataKey, target);
    Reflect.getOwnMetadata(metadataKey, target, propertyKey);

    // equal to Reflect.defineMetadata(Symbol("design:paramtypes"), metadataValue, target，propertyKey)
    @Reflect.metadata("design:paramtypes", types)

    // get metadata value of `design:paramtypes` of an object or property
    Reflect.getMetadata("design:paramtypes", target, propertyKey)
    ```


    ```typescript
    // Design-time type annotations
    function Type(type) { return Reflect.metadata("design:type", type); }
    function ParamTypes(...types) { return Reflect.metadata("design:paramtypes", types); }
    function ReturnType(type) { return Reflect.metadata("design:returntype", type); }

    // Decorator application
    // equal to: `@Reflect.metadata("design:paramtypes", [String, Number])`  or  `Reflect.defineMetadata(Symbol("design:paramtypes"), C，[String, Number])`
    @ParamTypes(String, Number)
    class C {
      constructor(text, i) {
      }

    	// equal to: `@Reflect.metadata("design:type", String)`  or  `Reflect.defineMetadata(Symbol("design:type"), C， 'name', [String, Number])`
      @Type(String)
      get name() { return "text"; }

    	// equal to: `@Reflect.metadata("design:type", Function)`  or  `Reflect.defineMetadata(Symbol("design:type"), C， 'add', Function)`
      @Type(Function)
    	// equal to: @Reflect.metadata("design:paramtypes", [Number, Number])  or  `Reflect.defineMetadata(Symbol("design:paramtypes"), C， 'add', [Number, Number])`
      @ParamTypes(Number, Number)
    	// equal to: @Reflect.metadata("design:returntype", Number)  or  `Reflect.defineMetadata(Symbol("design:returntype"), C， 'add', Number)`
      @ReturnType(Number)
      add(x, y) {
        return x + y;
      }
    }

    // Metadata introspection
    let obj = new C("a", 1);
    let paramTypes = Reflect.getMetadata("design:paramtypes", inst, "add"); // [Number, Number]
    ```

- Decorator 装饰器
    - **Decorator Factories**
        - [TypeScript: Documentation - Decorators (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-factories)

    ```typescript
    function factoryDecorator(...args) {
        return function (target, ...others) {} // 返回生成的装饰器
    }
    ```

    - **Class Decorators**
        - [TypeScript: Documentation - Decorators (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators)

    ```typescript
    function classDecorator(target: any) {} // 可以返回新的类替换被装饰的类声明，或者返回空（返回空，则回继续使用原来的类声明）
    ```

    - **Parameter Decorators**
        - [TypeScript: Documentation - Decorators (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/decorators.html#parameter-decorators)

    ```typescript
    function parameterDecorator(target: any, propertyKey: string | symbol, parameterIndex: number) => void {} // 参数装饰器不返回值，一般用来实现副作用功能
    ```


### TSyringeJS 使用方式

- **Example without interfaces**

```typescript
// Foo.ts
export class Foo {}
```


```typescript
// Bar.ts
import {Foo} from "./Foo";
import {injectable} from "tsyringe";

@injectable()
export class Bar {
  constructor(public myFoo: Foo) {}
}
```


```typescript
// main.ts
import "reflect-metadata";
import {container} from "tsyringe";
import {Bar} from "./Bar";

const myBar = container.resolve(Bar);
// myBar.myFoo => An instance of Foo
```

- **Example with interfaces**

```typescript
// SuperService.ts
export interface SuperService {
  // ...
}
```


```typescript
// TestService.ts
import {SuperService} from "./SuperService";
export class TestService implements SuperService {
  //...
}
```


```typescript
// Client.ts
import {injectable, inject} from "tsyringe";

@injectable()
export class Client {
  constructor(@inject("SuperService") private service: SuperService) {}
}
```


```typescript
// main.ts
import "reflect-metadata";
import {Client} from "./Client";
import {TestService} from "./TestService";
import {container} from "tsyringe";

container.register("SuperService", {
  useClass: TestService
});
const client = container.resolve(Client);
// client's dependencies will have been resolved
```

- **Injecting primitive values (Named injection)**

```typescript
import {singleton, inject} from "tsyringe";

@singleton()
class Foo {
  private str: string;
  constructor(@inject("SpecialString") value: string) {
    this.str = value;
  }
}

// some other file
import "reflect-metadata";
import {container} from "tsyringe";
import {Foo} from "./foo";

const str = "test";
container.register("SpecialString", {useValue: str});

const instance = container.resolve(Foo);
```


### TSyringeJS 模块依赖图解


![unknown](/content_images/unknown__5bd7c531-1361-4ab8-a1d1-d05bed92b52f.png)


### TSyringeJS 代碼走读

- 我 fork 了项目，对源码进行了注释

[link_preview](https://github.com/C-Dao/tsyringe)


### TSyringeJS 中的 IOC 例子

- [C-Dao/tsyringe: Lightweight dependency injection container for JavaScript/TypeScript (github.com)](https://github.com/C-Dao/tsyringe#injectWithTransform)
- [C-Dao/tsyringe: Lightweight dependency injection container for JavaScript/TypeScript (github.com)](https://github.com/C-Dao/tsyringe#interception)
- [C-Dao/tsyringe: Lightweight dependency injection container for JavaScript/TypeScript (github.com)](https://github.com/C-Dao/tsyringe#providers)

## 扩展阅读

- [https://github.com/inversify/InversifyJS](https://github.com/inversify/InversifyJS) (该库的功能比 tsyringe 要丰富）
- [[面向对象设计的两个指导建议](https://github.com/inversify/InversifyJS/blob/master/wiki/oo_design.md)]
- [[IOC 最佳实践](http://github.com/inversify/InversifyJS/blob/master/wiki/good_practices.md)]
- [[IOC & Dependency Injection pattern](https://www.martinfowler.com/articles/injection.html)] Martin, Fowler
- [[The Dependency Inversion Principle"](https://web.archive.org/web/20110714224327/http://www.objectmentor.com/resources/articles/dip.pdf)] Martin, Robert C. (May 1996)

## 参考文章

1. [35 | 编程范式游记（6）- 面向对象编程 (geekbang.org)](https://time.geekbang.org/column/article/2729)
2. [SOLID: The First 5 Principles of Object Oriented Design | DigitalOcean](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design#single-responsibility-principle)
3. [SOLID - Wikipedia](https://en.wikipedia.org/wiki/SOLID)
4. [Liskov substitution principle - Wikipedia](https://en.wikipedia.org/wiki/Liskov_substitution_principle)
5. [Single-responsibility principle - Wikipedia](https://en.wikipedia.org/wiki/Single-responsibility_principle)
6. [Open–closed principle - Wikipedia](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)
7. [Interface segregation principle - Wikipedia](https://en.wikipedia.org/wiki/Interface_segregation_principle)
8. [Dependency inversion principle - Wikipedia](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
