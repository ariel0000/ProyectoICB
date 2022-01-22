import React, {useEffect} from 'react'

//Este componente no es visual. Solo sirve para detectar cuando la app gana y pierde el foco. 
// También detecta el foco cuando un celular vuelve del bloqueo
  
const WindowFocusHandler = ({beginFocus, beginBlur}) => {
    useEffect(() => {
      window.addEventListener('focus', onFocus);
      window.addEventListener('blur', onBlur);
      // Specify how to clean up after this effect:
      return () => {
        window.removeEventListener('focus', onFocus);
        window.removeEventListener('blur', onBlur);
      };
    })
    const onFocus = () => {
        console.log('Tab is in focus');
        beginFocus();
      };
      
      // User has switched away from the tab (AKA tab is hidden)
      const onBlur = () => {
        console.log('Tab is blurred');
      //  beginBlur    --No se usa por ahora--
      };

    return <></>
};
export default WindowFocusHandler;
