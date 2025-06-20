// src/utils/order-utils.ts (o donde prefieras ubicarlo)


import { lastValueFrom } from 'rxjs';
import { ProductDtoForDecreaseQuantity } from 'src/products/dtos/ProductDto.dto';
 // Asegurate de usar el path correcto

export function isCouponValid(coupon: any): boolean {
  const today = new Date();
  const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const validFrom = new Date(coupon.validFrom);
  const validUntil = new Date(coupon.validUntil);

  return currentDate >= validFrom && currentDate <= validUntil;
}

export async function decreaseProductStock(
  items: any[],
  clientProduct: any,
): Promise<void> {
  const products = items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));

  const dataSend: ProductDtoForDecreaseQuantity = { products };

  await lastValueFrom(clientProduct.send('decrement-stock-product', dataSend));
}

export async function cleanCartIfNeeded(
  items: any[],
  user: any,
  clientOrder: any,
): Promise<void> {
  if (items.length > 0) {
    await lastValueFrom(clientOrder.send('delete-cart-after-order', { user }));
  }
}
