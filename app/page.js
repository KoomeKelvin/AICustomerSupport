'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
export default function Home() {


  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the fixaAvocado farmers support. How can I help you today?",
    },
  ])

  const sendMessage = async () => {
    if (!message.trim()) return;  // Don't send empty messages
  
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
  }


  const [message, setMessage] = useState('')

  return (
    <Box display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      flexDirection={'column'}
      gap={2}
      width="100vw"
      height="100vh"
    >
     <Stack direction={'column' }
     width='500px'
     height='500px'
     border="1px solid black"
     gap={2}
     p={2}
     >
    <Stack direction={'column'} spacing={2} flexGrow={1} overflow={'auto'} maxHeight="500px">
      {
        messages.map((message, index) =>(
        <Box
        key={index}
        display={'flex'}
        justifyContent={message.role==='assistant'? 'flex-start': 'flex-end'}>
        <Box
        bgcolor={message.role==='assistant'? 'primary.main': 'secondary.main'}
        color={'white'}
        borderRadius={16}
        p={3}
        >
        {message.content}
        </Box>
        </Box>
        )
        )
      }

    </Stack>
    <Stack direction={"row"} spacing={2}
  > 
  <TextField label="Message" value={message}
  onChange={(e)=> setMessage(e.target.value)}
  fullWidth />
  <Button variant="contained" onClick={sendMessage}>Send</Button>
  </Stack>
  </Stack>

    </Box>
  )
}
