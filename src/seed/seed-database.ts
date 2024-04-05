import { initialData } from "./seed";
import prisma from '../lib/prisma';
import { cities } from "./seed-cities";

async function main() {
    // 1. Borrar todos los datos de la base de datos
    // await Promise.all([
        await prisma.orderAddress.deleteMany();
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();

        await prisma.userAddress.deleteMany();
        await prisma.user.deleteMany();
        await prisma.city.deleteMany();
        await prisma.productImage.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
    // ]);

    // Categorias
    const {categories, products, users} = initialData;

    await prisma.user.createMany({
        data: users
    });
    
    const categoriesData = categories.map(category=>({
        name: category
    }))

    await prisma.category.createMany({
        data: categoriesData
    });

    const categoriesDB = await prisma.category.findMany();
    const categoriesMap = categoriesDB.reduce((map , category)=> {
        map[category.name.toLocaleLowerCase()] = category.id;
        return map
    }, {} as Record<string, string>)

    // console.log(categoriesMap);

    // Productos
    //const {images, type, ...product1} = products[0];

    // await prisma.product.create({
    //     data: {
    //         ...product1,
    //         categoryId: categoriesMap['shirts']
    //     }
    // });

    products.forEach(async(product)=> {
        const {type, images, ...rest} = product;

        const dbProduct = await prisma.product.create({
            data: {
                ...rest,
                categoryId: categoriesMap[type]
            }
        })
        // Images
    
        const imagesData = images.map(image=>({
            url: image,
            productId: dbProduct.id
            
        }));

        await prisma.productImage.createMany({
            data: imagesData
        })
    })

    await prisma.city.createMany({
        data: cities
    })



    console.log('Seed ejecutado correctamente');

}

(()=> {
    if(process.env.NODE_ENV === 'production') return

    main();
})();