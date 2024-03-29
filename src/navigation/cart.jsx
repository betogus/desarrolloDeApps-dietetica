import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '../constants/colors';
import { Cart } from '../screens';

const Stack = createNativeStackNavigator();

const CartNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
      name="Cart" 
      component={Cart} 
      options={{
        headerStyle: {
           backgroundColor: colors.primary,
        },
      }}
      />
    </Stack.Navigator>
  );
};

export default CartNavigator;
