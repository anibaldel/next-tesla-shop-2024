'use server';

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import prisma from '@/lib/prisma';

interface ProductToOrder {
    productId: string;
    quantity: number;
    size : Size;
}
export const placeOrder= async (productIds: ProductToOrder[], address: Address)=> {

    const session = await auth();
    const userId = session?.user.id;

    // Verificar sesion de usuario
    if( !userId) {
        return {
            ok: false,
            message: 'No hay sesion de usuario'
        }
    }

    // Obtener la informacion de los productos
    // Nota: recuerden que podemos llevar dos o mas Productos con el mismo ID

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map( p => p.productId)
            }
        }
    });
    
    // Calcular los montos // Encabezado
    const itemsInOrder = productIds.reduce(( count, p) => count + p.quantity, 0)

    // Los totales de tax, subtotal y total
    const {subTotal, tax, total} = productIds.reduce((totals, item)=> {
        const productQuantity = item.quantity;
        const product = products.find(product => product.id === item.productId)
        if(!product) throw new Error(`${item.productId} no existe - 500`)

        const subTotal = product.price * productQuantity;
        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.13;
        totals.total += subTotal + 1.13;

        return totals;

    }, {subTotal:0, tax: 0, total: 0})

    // Crear la transaccion en la base de datos

    try {
        const prismaTx = await prisma.$transaction(async(tx)=> {
            // 1. Actualizar el stock de los products
    
            // Acumular los valores
            const updatedProductsPromises = products.map((product)=> {
                const productQuantity = productIds.filter(
                    p=> p.productId === product.id
                ).reduce((acc, item)=> item.quantity + acc, 0)
    
                if( productQuantity === 0) {
                    throw new Error(`${product.id} no tiene cantidad definida - 500`)
                }
    
                return tx.product.update({
                    where: {id: product.id},
                    data: {
                        // inStock: product.inStock - productQuantity // no hacer
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                });
            });
    
            const updatedProducts = await Promise.all(updatedProductsPromises)
            // Verificar valores negativos en las existencias = no hay stock
            updatedProducts.forEach(product => {
                if(product.inStock < 0) {
                    throw new Error(`${product.title} no tiene stock - 500`)
                }
            })
    
            // 2. Crear la orden - Encabezado -Detalle
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,
    
                    orderItem: {
                        createMany: {
                            data: productIds.map(p=> ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find(product => product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }
    
                }
            });
    
    
            // 3. Crear la direccion de la orden
            const {city, ...restAddress } = address;
    
            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    cityId: city,
                    orderId: order.id,
                }
            })
    
            return {
                order: order,
                updateProducts: updatedProducts,
                orderAddress: orderAddress
            }
        });

        return {
            ok: true,
            order: prismaTx.order,
            prismaTx: prismaTx,
        }
        
    } catch (error:any) {
        return {
            ok: false,
            message: error?.message
        }
    }

    

    

}