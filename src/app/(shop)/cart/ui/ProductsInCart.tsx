'use client';
import { ProductImage, QuantitySelector } from "@/components";
import { useCartStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

 
export const ProductsInCart = () => {
    const [loaded, setLoaded] = useState(false)
    const productsInCart = useCartStore(state=> state.cart);
    const updateProductQuantity = useCartStore(state=> state.updateProductQuantity);
    const removeProudct = useCartStore(state=> state.removeProduct);
    useEffect(() => {
        setLoaded(true)
      }, [])

    if(!loaded) {
        return <p>Cargando...</p>
    }

  return (
    <>
        {
            productsInCart.map( product => (

              <div key={ `${product.slug} ${product.size}` } className="flex mb-5">
                <ProductImage
                  src={product.image}
                  width={ 100 }
                  height={ 100 }
                  style={{
                    width: '100px',
                    height: '100px'
                  }}
                  alt={ product.title }
                  className="mr-5 rounded"
                />

                <div>
                  <Link className="hover:underline cursor-pointer"
                    href={`/product/${product.slug}`}
                   >
                    {product.title} - {product.size}
                  </Link>
                  <p>Bs { product.price }</p>
                  <QuantitySelector 
                    quantity={ product.quantity } 
                    onQuantityChanged={(quantity)=> updateProductQuantity(product, quantity)}
                />

                  <button onClick={()=>removeProudct(product)}
                    className="underline mt-3"
                  >
                    Remover
                  </button>
                </div>

              </div>


            ) )
        }
    </>
  )
}
