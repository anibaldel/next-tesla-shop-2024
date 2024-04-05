export const revalidate = 60 // segundos

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    page?: string
  }
  params: {
    gender: string;
  }
}

export default async function GenderByPage({params, searchParams}: Props) {
  const {gender} = params;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const {products, currentPage, totalPages} = await getPaginatedProductsWithImages(
    { page,
      gender: gender as Gender,
    });

  if(products.length === 0 ) {
    redirect(`/gender/${gender}`)
  }
  // if(id === 'kids') {
  //   notFound();
  // }

  // const products = seedProducts.filter(product => product.gender === id);

  const labels: Record<string, string> = {
    'men': 'para hombres',
    'women': 'para mujeres',
    'kid': 'para niños',
    'unisex': 'para todos',
  }
  
  return (
    <>
      <Title 
        title={`Articulos ${labels[gender]}`}
        subtitle="Todos los productos" 
        className="mb-2"
      />
      <ProductGrid products={products}/>
      <Pagination totalPages={totalPages}/>
      
    </>
  );
}