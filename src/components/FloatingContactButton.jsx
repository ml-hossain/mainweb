import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { FiMessageCircle, FiX } from 'react-icons/fi'
import { FaWhatsapp, FaFacebookMessenger, FaTelegramPlane, FaFacebookF } from 'react-icons/fa'

const FloatingContactButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const iconsRef = useRef([])

  const contacts = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-green-500 hover:bg-green-600',
      url: 'https://wa.me/1234567890',
    },
    {
      name: 'Messenger',
      icon: FaFacebookMessenger,
      color: 'bg-blue-500 hover:bg-blue-600',
      url: 'https://m.me/username',
    },
    {
      name: 'Telegram',
      icon: FaTelegramPlane,
      color: 'bg-blue-400 hover:bg-blue-500',
      url: 'https://t.me/username',
    },
    {
      name: 'Facebook',
      icon: FaFacebookF,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: 'https://facebook.com/username',
    },
  ]

  useEffect(() => {
    // Initial animation for the main button
    if (buttonRef.current) {
      gsap.fromTo(buttonRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(1.7)", delay: 0.2 }
      )

      // Floating animation
      gsap.to(buttonRef.current, {
        y: -10,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      })
    }
  }, [])

  const toggleMenu = () => {
    if (!isOpen) {
      setIsOpen(true)
      
      // Animate icons immediately after state change
      requestAnimationFrame(() => {
        const validIcons = iconsRef.current.filter(ref => ref !== null && ref !== undefined)
        if (validIcons.length > 0) {
          // Clear any existing transforms and start fresh
          gsap.killTweensOf(validIcons)
          
          // Animate each icon with stagger
          validIcons.forEach((icon, index) => {
            if (icon) {
              gsap.fromTo(icon, 
                {
                  opacity: 0,
                  scale: 0,
                  y: 30
                },
                {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: "back.out(1.7)"
                }
              )
            }
          })
        }
      })
    } else {
      // Animate out
      const validIcons = iconsRef.current.filter(ref => ref !== null && ref !== undefined)
      if (validIcons.length > 0) {
        gsap.killTweensOf(validIcons)
        
        validIcons.forEach((icon, index) => {
          if (icon) {
            gsap.to(icon, {
              opacity: 0,
              scale: 0,
              y: -20,
              duration: 0.2,
              delay: index * 0.03,
              ease: "power2.in",
              onComplete: index === validIcons.length - 1 ? () => setIsOpen(false) : null
            })
          }
        })
      }
    }
  }

  const handleContactClick = (url) => {
    window.open(url, '_blank')
    toggleMenu()
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Contact Menu */}
      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute bottom-20 right-0"
        >
          <div className="flex flex-col items-center space-y-3">
            {contacts.map((contact, index) => {
              const IconComponent = contact.icon
              return (
                <button
                  key={contact.name}
                  ref={el => iconsRef.current[index] = el}
                  onClick={() => handleContactClick(contact.url)}
                  className={`w-14 h-14 rounded-full ${contact.color} text-white flex items-center justify-center shadow-lg transform transition-all duration-100 hover:scale-110`}
                  style={{ opacity: 0, transform: 'scale(0)' }}
                  title={contact.name}
                >
                  <IconComponent className="w-6 h-6" />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Contact Button */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center transform transition-all duration-150 hover:scale-110 hover:from-blue-600 hover:to-purple-700"
      >
        {isOpen ? (
          <FiX className="w-6 h-6 text-white" />
        ) : (
          <FiMessageCircle className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  )
}

export default FloatingContactButton
