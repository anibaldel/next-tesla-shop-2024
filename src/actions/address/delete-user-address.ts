'use server'
import prisma from '@/lib/prisma';


export const deleteUserAddres =async(userId: string)=> {
    try {
        const deleteUserAddres = await prisma.userAddress.delete({
            where: {userId}
        })
        return {
            ok: true,
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo borrar de la DB'
        }
    }

}