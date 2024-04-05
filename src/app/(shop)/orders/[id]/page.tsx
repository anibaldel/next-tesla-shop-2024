import Link from 'next/link';

import Image from 'next/image';

import { Title } from '@/components';
import { initialData } from '@/seed/seed';
import clsx from 'clsx';
import { IoCardOutline } from 'react-icons/io5';
import { getOrderById } from '@/actions';
import { redirect } from 'next/navigation';
import { currencyFormat } from '@/utils';


// const productsInCart = [
//   initialData.products[ 0 ],
//   initialData.products[ 1 ],
//   initialData.products[ 2 ],
// ];

interface Props {
  params: {
    id: string;
  }
}


export default async function OrderByIdPage({params}:Props) {

  const {id} = params;

  const {order, ok} = await getOrderById(id)
  //console.log(order);
  if(!ok) {
    return redirect('/')
  }

  const address = order?.orderAddress;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">

      <div className="flex flex-col w-[1000px]">

        <Title title={`Orden #${id.split('-').at(-1)}`} />


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* Carrito */ }
          <div className="flex flex-col mt-5">
            <div className={
                clsx(
                  "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                  {
                    'bg-red-500': order?.isPaid === false,
                    'bg-green-700': order?.isPaid === true,
                  }
                )
              }
            >
              <IoCardOutline size={30} />
              {
                order?.isPaid 
                ? <span className='mx-2'>Pagada</span>
                : <span className='mx-2'>No pagada</span>
              }
            </div>


          {/* Items */ }
          {
            order!.orderItem.map( item => (

              <div key={ item.product.slug + '_' + item.size } className="flex mb-5">
                <Image
                  src={ `/products/${ item.product.productImage[0].url }` }
                  width={ 100 }
                  height={ 100 }
                  style={{
                    width: '100px',
                    height: '100px'
                  }}
                  alt={ item.product.title || '' }
                  className="mr-5 rounded"
                />

                <div>
                  <p>{ item.product.title }</p>
                  <p>${ item.price } x {item.quantity}</p>
                  <p className='font-bold'>Subtotal: ${currencyFormat(item.price * item.quantity)}</p>
                </div>

              </div>


            ) )
          }
           </div>

          {/* Checkout - Resumen de orden */ }
          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className='text-2xl mb-2'>Direccion de entrega</h2>
            <div className='mb-10'>
              <p className="text-xl">{address?.firstName} {address?.lastName}</p>
              <p>{address?.address}</p>
              <p>{address?.address2}</p>
              <p>{address?.city.name}</p>
              <p>{address?.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />
            <h2 className="text-2xl mb-2">Resumen de orden</h2>

            <div className="grid grid-cols-2">

              <span>No. Productos</span>
              <span className="text-right">{order?.itemsInOrder} artículos</span>
              
              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(order?.subTotal || 0 )}</span>
              
              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(order?.tax || 0 )}</span>
              
              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">{currencyFormat(order?.total || 0 )}</span>


            </div>

            <div className="mt-5 mb-2 w-full">
              <div className={
                  clsx(
                    "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                    {
                      'bg-red-500': order?.isPaid === false,
                    'bg-green-700': order?.isPaid === true,
                    }
                  )
                }
              >
                <IoCardOutline size={30} />
                {order?.isPaid
                  ? <span className='mx-2'>Pagada</span>
                  : <span className='mx-2'>No pagada</span>
                }
              </div>
            </div>


          </div>



        </div>



      </div>


    </div>
  );
}