'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getOrdersByIdyUser = async()=> {
    const session = await auth();
    if(!session?.user) {
        return {
            ok: false,
            message: 'debe de estar autenticado'
        }
    }

    const orders = await prisma.order.findMany({
        where: {
            userId: session.user.id
        },
        include: {
            orderAddress: {
                select: {
                    firstName: true,
                    lastName: true,
                }
            }
        }
    })

    return {
        ok: true,
        orders
    }
}