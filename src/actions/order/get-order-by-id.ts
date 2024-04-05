'use server';
import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getOrderById=async(id: string)=> {
    const session = await auth();
    const userId = session?.user.id;

    // Verificar sesion de usuario
    if( !userId) {
        return {
            ok: false,
            message: 'No hay sesion de usuario'
        }
    }
    try {

        const order = await prisma.order.findUnique({
            where: {id: id},
            include: {
                orderAddress: {
                    include: {
                        city: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                orderItem: {
                    select: {
                        price: true,
                        quantity: true,
                        size: true,

                        product: {
                            select: {
                                title: true,
                                slug: true,

                                productImage: {
                                    select: {
                                        url: true
                                    },
                                    take: 1,
                                }
                            }
                        }
                    }
                },
            }
        });

        if(!order) throw `${id} no existe`
        if( session.user.role === 'user') {
            if( userId !== order.userId ) {
                throw `${id} no es de este usuario`
            }
        }

        // const products = await prisma.product.findMany({
        //     where: {
        //         id: {
        //             in: order?.orderItem.map( p => p.productId)
        //         }
        //     },
        //     include: {
        //         productImage: true
        //     }
        // })

        // const summaryProducts = order?.orderItem.map((item)=>{
        //     const product = products.find(p => p.id === item.productId)
        //     return {
        //         title: product?.title,
        //         price: product?.price,
        //         slug: product?.slug,
        //         quantity: item?.quantity || 0,
        //         subtotal: product!.price * item!.quantity,
        //         image: product?.productImage[0].url,
        //     }
        // },)

        return {
            ok: true,
            order
        }

        
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Orden no existe'
        }
    }

}