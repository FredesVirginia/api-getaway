import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { OrderDto } from './dtos/Order-created.dto';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ProductReconmedationDto } from 'src/products/dtos/ProductReconmedation.dto';

@Injectable()
export class OrdersService implements OnModuleInit {
  private clientOrder: ClientProxy;
  private clientProduct: ClientProxy;
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

  async createOrder(orderDto: OrderDto) {
    return this.clientOrder.send('create-order', orderDto);
  }

  async getAllOrdersByUser(id: string) {
    return this.clientOrder.send('order-by-user', id);
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

  async getAllPoductByUserForMouthAverage(id: string){
     const result = await lastValueFrom(
        this.clientOrder.send('product-average-mouth-by-user', id),
      );
      return result
  }

  async getHistoryUser( id : string ){
    return this.clientOrder.send('history-order' , id)
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
