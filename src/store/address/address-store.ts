import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
    address: {
        firstName: string;
        lastName: string;
        address: string;
        address2? : string;
        city: string;
        phone: string;
    }

    // Methods
    setAddress: (address: State['address']) => void;
}

export const useAddressStore = create<State>()(
    persist(
        (set, get)=> ({
            address: {
                firstName: '',
                lastName: '',
                address: '',
                address2 : '',
                city: '',
                phone: '',
            },
            setAddress: (address)=> {
                set({address});
            }
        }),
        {
            name: "address-storage",
        }
    )
)