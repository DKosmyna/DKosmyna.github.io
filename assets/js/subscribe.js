import { createClient } from 'https://esm.sh/@supabase/supabase-js'

  const supabase = createClient(
    'https://vrmiietkfzhpfgrdzfch.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZybWlpZXRrZnpocGZncmR6ZmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxOTY3MDEsImV4cCI6MjA1OTc3MjcwMX0.JSmpMmb4EBmKOEfr_Xl-fg7EyFmliC3aF-MhreNsW8E'
  )

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('subscribe-form')

    form.addEventListener('submit', async (e) => {
      e.preventDefault()

      const email = form.email.value.trim()
      if (!email) return alert('Введіть email')

      const { error } = await supabase
        .from('subscribers')
        .insert([{ email }])

      if (error) {
        alert('Помилка: ' + error.message)
      } else {
        alert('Дякуємо за підписку!')
        form.reset()
      }
    })
  })
