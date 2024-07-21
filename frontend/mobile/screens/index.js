import { AppRegistry } from 'react-native';
import App from '../App'; // Assurez-vous que ce chemin est correct
import { name as appName } from './app.json'; // Assurez-vous que ce fichier existe et contient le nom correct

AppRegistry.registerComponent(appName, () => App);
