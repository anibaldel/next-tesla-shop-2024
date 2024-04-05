'use server';
import prisma from '@/lib/prisma';

export const getCities = async()=> {
    try {
        const cities = await prisma.city.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        return cities;
    } catch (error) {
        console.log(error);
        return []
    }
}

