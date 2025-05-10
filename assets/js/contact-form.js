import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://vrmiietkfzhpfgrdzfch.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZybWlpZXRrZnpocGZncmR6ZmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxOTY3MDEsImV4cCI6MjA1OTc3MjcwMX0.JSmpMmb4EBmKOEfr_Xl-fg7EyFmliC3aF-MhreNsW8E'
)

const form = document.getElementById('contactform')
const nameInput = document.getElementById('name')
const emailInput = document.getElementById('email')
const phoneInput = document.getElementById('phone')
const messageInput = document.getElementById('comments')
const checkbox = document.getElementById('consent')
const submitBtn = document.getElementById('submitBtn')


const validate = () => {
  const isValid =
    nameInput.value.trim() !== '' &&
    emailInput.validity.valid &&
    phoneInput.value.trim().length >= 10 &&
    messageInput.value.trim() !== '' &&
    checkbox.checked

  submitBtn.disabled = !isValid
}


[nameInput, emailInput, phoneInput, messageInput, checkbox].forEach(el =>
  el.addEventListener('input', validate)
)
checkbox.addEventListener('change', validate)


phoneInput.addEventListener('input', () => {
    let digits = phoneInput.value.replace(/\D/g, '')
    

    if (digits.startsWith('380')) {
      digits = digits.slice(0, 12)
    } else if (digits.startsWith('0')) {
      digits = '38' + digits
      digits = digits.slice(0, 12)
    } else if (digits.length <= 9) {
      digits = '380' + digits
    }
  
    digits = digits.slice(0, 12)
    phoneInput.value = '+' + digits
  })


form.addEventListener('submit', async (e) => {
    e.preventDefault()
  
    const payload = {
      name: nameInput.value,
      email: emailInput.value,
      message: messageInput.value,
      phone: phoneInput.value, // ← ✅ додано кому тут
    }
  
    console.log('Дані для відправки:', payload)
  
    const { error } = await supabase.from('messages').insert([payload])
  
    if (error) {
      alert('Помилка: ' + error.message)
    } else {
      alert('Повідомлення надіслано успішно!')
      form.reset()
      submitBtn.disabled = true
    }
  })