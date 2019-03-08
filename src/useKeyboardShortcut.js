import React from 'react'

export default ({keyCode, action, disabled}) => {
  React.useEffect(() => {
    if(!disabled){
      enable()
    }
    return () => {
      disable()
    }
  })

  const enable = () => {
    document.addEventListener('keydown', handleAction)
  }

  const disable = () => {
    document.removeEventListener('keydown', handleAction)
  }

  const handleAction = e => {
    if(e.keyCode === keyCode){
      e.preventDefault()
      action(e)
    }
  }

  return {enable, disable}
}
