import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, RpcException, Transport } from '@nestjs/microservices';
import { OrderDto } from './dtos/Order-created.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService implements OnModuleInit {
    private clientOrder : ClientProxy;
    private clientProduct : ClientProxy;
     onModuleInit() {
         this.clientOrder = ClientProxyFactory.create({
            transport : Transport.TCP,
            options:{
                host : "localhost",
                port:3002
            }
         }),
         this.clientProduct = ClientProxyFactory.create({
            transport : Transport.TCP,
            options:{
                host : "localhost",
                port:3001
            }
         })
     }

     async createOrder(orderDto : OrderDto){
        return this.clientOrder.send('create-order', orderDto)
     }

     async getAllOrdersByUser(id : string){
        return this.clientOrder.send('order-by-user', id)
     }

  async getAllOrderTotalUser(id: string) {
  try {
    const result = await lastValueFrom(this.clientOrder.send('order-total-user', id));
    return result;
  } catch (error) {
    // Aquí puedes manejar o lanzar el error con más información
    console.error('Error al obtener total de órdenes:', error);
    throw new RpcException('Error al obtener total de órdenes');
  }
}


   //   async getProductReconmedations( userId : string){
   //       //1 obtenemos produtos comprados
   //       const purchasedProducts = await this.clientOrder.send(
   //          'get-purchased-products' , userId
   //       ).toPromise();


   //       const productIds = purchasedProducts.map(p => p.productId)
         
   //       //2 detales de esos productos 
   //       const products = await this.clientProduct.send(
   //          'get-products-by-ids' , productIds
   //       ).toPromise()


   //       //3 conteo por categoria

   //       const categoryCounter : Record<string , number> = {}
   //       for(const p of products){
   //          const qty = +purchasedProducts.find(pp => pp.productId === p.id).total;
   //          categoryCounter[p.category.name] = (categoryCounter[p.category.name] || 0) + qty
   //       }


   //       const [topCategory] = Object.entries(categoryCounter).sort((a, b) => b[1] - a[1])[0] || [];

   //       if(!topCategory) return [] //el usuario no compro nada

   //       //5 tofdos los produto de esa categoria

   //       const allInCategory = await this.clientProduct.send(
   //          'get-products-by-category' , topCategory
   //       ).toPromise()


   //       //6 filtrar los ya comprados

   //       const reconmmendations = allInCategory.filter(
   //          p => !productIds.includes(p.id)
   //       )

   //       return reconmmendations
     
   //    }

      async getProductReconmedations(userId: string) {
        // 1. Obtenemos productos comprados
        const purchasedProductsResponse = await this.clientOrder
          .send('get-purchased-products', userId)
          .toPromise();

        // Validar estructura
        const purchasedProducts = Array.isArray(purchasedProductsResponse?.data)
          ? purchasedProductsResponse.data
          : ["primero"];

        if (!purchasedProducts.length) {
          return ["segundo"]; // El usuario no ha comprado nada
        }

        // 2. Extraer los productIds
        const productIds = purchasedProducts.map(p => p.productId);

        // 3. Traer detalles de esos productos
        const products = await this.clientProduct
          .send('get-products-by-ids', productIds)
          .toPromise();

        // 4. Contar por categoría
        const categoryCounter: Record<string, number> = {};

        for (const p of products) {
          const match = purchasedProducts.find(pp => pp.productId === p.id);
          const qty = match ? +match.total : 0;
          categoryCounter[p.category.name] = (categoryCounter[p.category.name] || 0) + qty;
        }

        // 5. Obtener categoría más comprada
        const [topCategory] = Object.entries(categoryCounter)
          .sort((a, b) => b[1] - a[1])[0] || [];

        if (!topCategory) {
          return ["tercero"]; // No se encontró categoría dominante
        }

        // 6. Obtener todos los productos de esa categoría
        const allInCategory = await this.clientProduct
          .send('get-products-by-category', topCategory)
          .toPromise();

        // 7. Filtrar los ya comprados
        const recommendations = allInCategory.filter(p => !productIds.includes(p.id));

        return recommendations;
}

}
