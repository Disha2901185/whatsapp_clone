import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
// import {MD3LightTheme as DefaultTheme, PaperProvider} from 'react-native-paper';

const rootComponent = () => {
  return (
    <>
      <App />
    </>
  );
};
AppRegistry.registerComponent(appName, () => rootComponent);
