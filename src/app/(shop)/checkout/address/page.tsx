import { Title } from '@/components';
import Link from 'next/link';
import { AddressForm } from './ui/AddressForm';
import { getCities, getUserAddress } from '@/actions';
import { auth } from '@/auth.config';

export default async function AddressPage() {
  const cities = await getCities();

  const session = await auth();

  if(!session?.user) {
    return (
      <h3 className='text-5xl'>500 - No hay session de usuario</h3>
    )
  }

  const userAddress = await getUserAddress(session.user.id) ?? undefined;

  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">

      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">
        
        <Title title="Dirección" subtitle="Dirección de entrega" />

        <AddressForm cities={cities} userStoreAddress={userAddress}/>

      </div>




    </div>
  );
}