import React from 'react'

export default (onClickOutside, disabled) => {
  const ref = React.useRef()

  React.useEffect(() => {
    if(!disabled){
      window.addEventListener('click', checkForClickOutside)
      return () => {
        window.removeEventListener('click', checkForClickOutside)
      }
    }else{
      window.removeEventListener('click', checkForClickOutside)
    }
  }, [disabled])

  const checkForClickOutside = e => {
    if(ref.current){
      if(!ref.current.contains(e.target)){
        onClickOutside()
      }
    }
  }
  return ref;
}
