import * as ImagePicker from "expo-image-picker";
import {useState} from "react";
import { View, Text, Image, Button } from "react-native"
import colors from "../../constants/colors"
import { styles } from "./styles"
const ImageSelector = ({onImage}) => {
    const [pickedUrl, setPickedUrl] = useState(null)
   
     const verifyPermissions = async () => {
         const { status } = await ImagePicker.requestCameraPermissionsAsync();

         if (status !== "granted") {
             Alert.alert("Permiso denegado", "Necesitamos permisos para usar la cámara", [{
                 text: "Ok"
             }]);
             return false;
         }
         return true;
     };

     const onHandleTakeImage = async () => {
         const isCameraPermission = await verifyPermissions();
         if (!isCameraPermission) return;

         const image = await ImagePicker.launchCameraAsync({
             aspect: [16, 9],
             quality: 0.7,
             allowsEditing: true
         });

         setPickedUrl(image.uri);
         onImage(image.uri);
     };
    return(
        <View style={styles.container}>
            <View style={styles.preview}>
                {!pickedUrl ? ( 
                    <Text>No tiene una foto de perfil</Text>    
                ) : (
                    <Image style={styles.image} source={{uri: pickedUrl}} /> 
                )}
                <Button title='Tomar foto' color={colors.button} onPress={onHandleTakeImage} />
            </View>
        </View>
    )
}

export default ImageSelector