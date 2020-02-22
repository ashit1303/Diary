

const buttons = [
    {
       id: 'default-bg',
        t: 'rgb(7, 107, 146',
        b: 'rgb(53, 210, 238'
      },
      
      
      {
        id: 'green',
        t: 'rgb(29, 139, 7',
        b: 'rgb(75, 238, 53'
      },
      
      {
        id: 'red',
        t: 'rgb(168, 44, 44',
        b: 'rgb(243, 60, 60'
      },
      
      {
        id: 'magenta',
        t: 'rgb(141, 12, 91',
        b: 'rgb(243, 60, 152'
      },
      
      
      {
        id: 'voilet',
        t: 'rgb(104, 12, 141',
        b: 'rgb(176, 60, 243'
      },
      
      {
        id: 'dark-blue',
        t: 'rgb(36, 15, 155',
        b: 'rgb(75, 91, 233'
      },
      
      {
        id: 'teal',
        t: 'rgb(7, 141, 108',
        b: 'rgb(75, 233, 180'
      },
      
      
      {
        id: 'yellow',
        t: 'rgb(141, 128, 12',
        b: 'rgb(209, 233, 75'
      },
      
      
      {
        id: 'orange',
        t: 'rgb(141, 85, 12',
        b: 'rgb(233, 151, 75'
      },


      {
        id: 'love',
        t: 'rgb(218, 26, 186',
        b: 'rgb(206, 118, 201'
      },
      
      {
        id: 'feary',
        t: 'rgb(182, 182, 182',
        b: 'rgb(255, 255, 255'
      },

     ]
  
const textbg = document.getElementById("#entry");
const topicbg = document.getElementById("#topic");
  let alpha = 1, t, b
  
  setBackground(buttons[0])
  
  buttons.forEach(button => {
    button.id = document.getElementById(button.id)
    button.id.addEventListener('click', e => {
      buttons.forEach(btn => btn.id.disabled = true)
      fadeOut(button)
    })
  })
  
  function setBackground(button = false) {  
    if (button) {
      t = button.t
      b = button.b
    }
    textbg.style.backgroundColor = ` ${t}`
    topicbg.style.backgroundColor = `linear-gradient( ${b}, ${alpha}), ${t}, ${alpha}))`
  }
  
  function fadeOut(button) {
    let fadeOutInterval = setInterval(() => {
      alpha -= 0.1
      setBackground()
      if (alpha <= 0) {
        clearInterval(fadeOutInterval)
        fadeIn(button)
      }
    }, 50)
  }
  
  function fadeIn(button) {
    setBackground(button)
    let fadeInInterval = setInterval(() => {
      alpha += 0.1
      setBackground()
      if (alpha >= 1) {
        clearInterval(fadeInInterval)
        buttons.forEach(btn => btn.id.disabled = false)
      }
    }, 50)
  }