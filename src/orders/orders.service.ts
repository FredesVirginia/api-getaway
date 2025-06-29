import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { OrderDto } from './dtos/Order-created.dto';
import { defaultIfEmpty, firstValueFrom, lastValueFrom } from 'rxjs';
import { ProductReconmedationDto } from 'src/products/dtos/ProductReconmedation.dto';
import { ProductDtoForDecreaseQuantity } from 'src/products/dtos/ProductDto.dto';
import { AddToCartDto, UpdateCartDto } from './dtos/AddToCartItem.dto';
import { UsersService } from 'src/users/users.service';
import {
  cleanCartIfNeeded,
  decreaseProductStock,
  isCouponValid,
} from './handlers/CallMsOrder';

@Injectable()
export class OrdersService implements OnModuleInit {
  private clientOrder: ClientProxy;
  private clientProduct: ClientProxy;

  constructor(private readonly userService: UsersService) {}

  onModuleInit() {
    (this.clientOrder = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3002,
      },
    })),
      (this.clientProduct = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      }));
  }

  // async createOrder(user: any, nameCoupon?: string) {
  //   try {
  //     const data1 = await this.userService.getCartItemUser(user);
  //     console.log('DATA SERVICE USER ', nameCoupon);

  //     const itemsOrder = data1.products.map((q) => {
  //       return {
  //         productId: q.id,
  //         quantity: q.quantity,
  //         price: q.price,
  //       };
  //     });

  //     const dataOrder: OrderDto = {
  //       userId: user,
  //       items: itemsOrder,
  //     };

  //     if (typeof nameCoupon === 'string' && nameCoupon.trim() !== '') {
  //       const coupon = await lastValueFrom(
  //         this.clientOrder.send('look-for', nameCoupon),
  //       );

  //       const couponId = coupon[0].discountPercent;
  //       console.log('CUPONNNNNNNNNN', coupon);

  //       const couponDate = Array.isArray(couponId) ? couponId[0] : couponId;
  //       const now = new Date();
  //       const fechaSolo = new Date(
  //         now.getFullYear(),
  //         now.getMonth(),
  //         now.getDate(),
  //       );
  //       const validFrom = new Date(couponDate.validFrom);
  //       const validUntil = new Date(couponDate.validUntil);

  //       if(fechaSolo >= validFrom && fechaSolo <= validUntil){
  //         const dataResult = await lastValueFrom(
  //         this.clientOrder.send('create-order', {
  //           coupon,
  //           orderDto: dataOrder, // Cambié dataOrder por orderDto
  //         }),
  //       );

  //       const data = dataResult.items.map((q) => {
  //         return {
  //           productId: q.productId,
  //           quantity: q.quantity,
  //         };
  //       });
  //       const dataSend: ProductDtoForDecreaseQuantity = { products: data };

  //       const dataResult2 = await lastValueFrom(
  //         this.clientProduct.send('decrement-stock-product', dataSend),
  //       );

  //       // TODO para borrar el carrito luego de  la compra
  //       if (dataResult.items.length > 0) {
  //         const resultCartDelete = await lastValueFrom(
  //           this.clientOrder.send('delete-cart-after-order', { user }),
  //         );
  //       }

  //       return dataResult;
  //       }else{
  //         throw new  BadRequestException({
  //           message: "Cupon No valido"
  //         })
  //       }
  //     } else {
  //       const dataResult = await lastValueFrom(
  //         this.clientOrder.send('create-order', {
  //           orderDto: dataOrder, // Cambié dataOrder por orderDto
  //         }),
  //       );
  //       console.log("MICROOOOOOOOOO" , dataResult)

  //       const data = dataResult.items.map((q) => {
  //         return {
  //           productId: q.productId,
  //           quantity: q.quantity,
  //         };
  //       });
  //       const dataSend: ProductDtoForDecreaseQuantity = { products: data };

  //       const dataResult2 = await lastValueFrom(
  //         this.clientProduct.send('decrement-stock-product', dataSend),
  //       );

  //       // TODO para borrar el carrito luego de  la compra
  //       if (dataResult.items.length > 0) {
  //         const resultCartDelete = await lastValueFrom(
  //           this.clientOrder.send('delete-cart-after-order', { user }),
  //         );
  //       }

  //       return dataResult;
  //     }
  //   } catch (error) {
  //     console.log('POR EL CATCH' , error);
  //      // error puede tener estructura { status: 'error', message: 'Cupon no valido' }
  // const message = error?.message || 'Error en el cupón';
  // throw new BadRequestException(message);
  //   }
  // }

  async createOrder(user: any, nameCoupon?: string) {
    try {
      const cartData = await this.userService.getCartItemUser(user);

      const itemsOrder = cartData.products.map((q) => ({
        productId: q.id,
        quantity: q.quantity,
        price: q.price,
      }));

      const orderDto: OrderDto = {
        userId: user,
        items: itemsOrder,
      };

      let coupon: any = null;

      if (typeof nameCoupon === 'string' && nameCoupon.trim() !== '') {
        const fetchedCoupon = await lastValueFrom(
          this.clientOrder.send('look-for', nameCoupon),
        );
        coupon = Array.isArray(fetchedCoupon)
          ? fetchedCoupon[0]
          : fetchedCoupon;

        if (!isCouponValid(coupon)) {
          throw new BadRequestException({ message: 'Cupón no válido' });
        }
      }

      const dataResult = await lastValueFrom(
        this.clientOrder.send('create-order', {
          orderDto,
          ...(coupon && { coupon }),
        }),
      );

      await decreaseProductStock(dataResult.items, this.clientProduct);
      await cleanCartIfNeeded(dataResult.items, user, this.clientOrder);

      return dataResult;
    } catch (error) {
      console.error('Error al crear la orden:', error);
      const message = error?.message || 'Error en el proceso de la orden';
      throw new BadRequestException(message);
    }
  }

  async getAllOrdersByUser(id: string) {
    console.log("AQUIIIIIIIIIIIIIIIIIIIIIIIIIII")
    return this.clientOrder.send('order-by-user', id);
  }

  async addToCart(user: any, data: AddToCartDto) {
    console.log('DATA DE API GET AWAY', data);
    return this.clientOrder.send('add-cart', { user, data });
  }

  async deleteCartAfterOrder(userId: string) {
    return this.clientOrder.send('delete-cart-after-order', { userId });
  }

  async deleteCart(user: string, data: UpdateCartDto) {
    console.log('DATA SERVICE API GETAWAY', data);
    return this.clientOrder.send('delete-product-cart', { user, data });
  }

  async getAllOrderTotalUser(id: string) {
    try {
      const result = await lastValueFrom(
        this.clientOrder.send('order-total-user', id),
      );

      const productMasComprado: string[] = [];
      productMasComprado.push(result.productoMasComprado);

      const categoryProductMas = await lastValueFrom(
        this.clientProduct.send(
          'get-products-by-ids-and-category-id',
          productMasComprado,
        ),
      );

      const data: ProductReconmedationDto = {
        productosComprados: result.productos,
        categoriaDeProductoComprado: categoryProductMas,
      };

      const finalReconmendation = await lastValueFrom(
        this.clientProduct.send('get-product-recomendados', data),
      );

      return {
        data: result,
        productosReconmendados: finalReconmendation,
      };
    } catch (error) {
      // Aquí puedes manejar o lanzar el error con más información
      console.error('Error al obtener total de órdenes:', error);
      throw new RpcException('Error al obtener total de órdenes');
    }
  }

  async getAllPoductByUserForMouthAverage(id: string) {
    const result = await lastValueFrom(
      this.clientOrder.send('product-average-mouth-by-user', id),
    );
    return result;
  }

  async getUserMonth200(id: string) {
    const result = await lastValueFrom(
      this.clientOrder.send('user-200-mouth', id),
    );
    return result;
  }

  async getMouthUserMuch200(mes: string) {
    const result = await lastValueFrom(
      this.clientOrder.send('mouth-user-200', mes),
    );
    return result;
  }

  async getProductMouthBestSeller() {
    const result = await lastValueFrom(
      this.clientOrder.send('product-best-seller-for-mouth', {}),
    );
    return result;
  }

  async getHistoryUser(id: string) {
    return this.clientOrder.send('history-order', id);
  }

  async getProductReconmedations(userId: string) {
    // 1. Obtenemos productos comprados
    const purchasedProductsResponse = await this.clientOrder
      .send('get-purchased-products', userId)
      .toPromise();

    // Validar estructura
    const purchasedProducts = Array.isArray(purchasedProductsResponse?.data)
      ? purchasedProductsResponse.data
      : ['primero'];

    if (!purchasedProducts.length) {
      return ['segundo']; // El usuario no ha comprado nada
    }

    // 2. Extraer los productIds
    const productIds = purchasedProducts.map((p) => p.productId);

    // 3. Traer detalles de esos productos
    const products = await this.clientProduct
      .send('get-products-by-ids', productIds)
      .toPromise();

    // 4. Contar por categoría
    const categoryCounter: Record<string, number> = {};

    for (const p of products) {
      const match = purchasedProducts.find((pp) => pp.productId === p.id);
      const qty = match ? +match.total : 0;
      categoryCounter[p.category.name] =
        (categoryCounter[p.category.name] || 0) + qty;
    }

    // 5. Obtener categoría más comprada
    const [topCategory] =
      Object.entries(categoryCounter).sort((a, b) => b[1] - a[1])[0] || [];

    if (!topCategory) {
      return ['tercero']; // No se encontró categoría dominante
    }

    // 6. Obtener todos los productos de esa categoría
    const allInCategory = await this.clientProduct
      .send('get-products-by-category', topCategory)
      .toPromise();

    // 7. Filtrar los ya comprados
    const recommendations = allInCategory.filter(
      (p) => !productIds.includes(p.id),
    );

    return recommendations;
  }

  async getProductIdMasComprado(userId: string) {}
}
