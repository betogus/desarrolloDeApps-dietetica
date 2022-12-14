import { signIn, signUp } from "./slices/authSlice";
import { URL_AUTH_SIGN_IN, URL_AUTH_SIGN_UP, URL_BASE } from "../constants/firebase";
import { confirmOrder } from "./slices/cartSlice";
import { URL_GEOCODING } from "../utils";
import { getData, insertData, updateData } from "../db";
import { saveAddress } from "./slices/userSlice";

export const loguearse =  (email, password) => {
    return async (dispatch) => {
        try {
            const response = await fetch(URL_AUTH_SIGN_IN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true
                })
            });

            const data = await response.json();
            dispatch(signIn({
                token: data.idToken,
                userId: data.localId,
                email: email,
                password: password
            }))
        } catch (error) {
            throw error;
        }
    }
}

export const registrarse = (email, password) => {
    return async (dispatch) => {
        try {
            const response = await fetch(URL_AUTH_SIGN_UP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true
                }),
            });
            if (!response.ok) {
                throw new Error('Algo anda mal')
            }
            const data = await response.json();
            dispatch(signUp({
                token: data.idToken,
                userId: data.localId,
                email: email,
                password: password
            })) 
        } catch (error) {
            throw error;
        }
    }
}

export const confirmCart = (items, total) => async (dispatch) => {
    try {
        const response = await fetch(`${URL_BASE}/orders.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date: Date.now(),
                items,
                total,
            }),
        });
        const result = await response.json();

        dispatch(confirmOrder({
             result
        }));
    } catch (error) {
        dispatch(confirmOrder({
            error,
        }));
    }
};



/* export const savePhoto = () => {
     return async () => {
         const fileName = action.image.split("/").pop();
         const Path = FileSystem.documentDirectory + fileName;
         if (state.user.find(item => item.id === action.id))
             try {
                 await FileSystem.moveAsync({
                     from: image,
                     to: Path,
                 })

                 return {
                     ...state,
                     photo: Path
                 };
             } catch (error) {
                 console.log("error", error);
                 throw error;
             }
     };
     case SAVE_LOCATION:
         return {
             ...state,
             location: action.item
         }
     default:
     return state
     }
}
           
 */

export const getAddress = (coords) => async (dispatch) => {
        try {
            const response = await fetch(URL_GEOCODING(coords?.lat, coords?.lng));
            if (!response.ok) throw new Error("No se ha podido conectar con el servidor");
            const data = await response.json();

            if (!data.results) throw new Error("No se ha podido encontrar la direcci??n");
            const address = data.results[0].formatted_address;
            let result;
            const loadAddress = await getData()
            if (!loadAddress.rows._array[0]) {
                result = await insertData(address, coords.lat, coords.lng)
            } else {
                result = await updateData(address, coords.lat, coords.lng)
            }
            dispatch(saveAddress({address, coords}))
        } catch (error) {
            throw Error;
        }
}


 export const loadUser = () => {
    return async (dispatch) => {
        try {
            const result = await getData()
            let coords = { lat: result?.rows?._array[0]?.lat, lng: result?.rows?._array[0]?.lng} 
            let address = result?.rows?._array[0]?.address                                                                                                                                                                                                                                                               
            dispatch(saveAddress({address, coords}))
        }
        catch (error) {
            throw Error   
        }
        
    }
} 