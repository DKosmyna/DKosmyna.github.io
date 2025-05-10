import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient(
  'https://vrmiietkfzhpfgrdzfch.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZybWlpZXRrZnpocGZncmR6ZmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxOTY3MDEsImV4cCI6MjA1OTc3MjcwMX0.JSmpMmb4EBmKOEfr_Xl-fg7EyFmliC3aF-MhreNsW8E'
)

document.getElementById('export-csv').addEventListener('click', async () => {
  const { data, error } = await supabase.from('subscribers').select('*')

  if (error) {
    return alert('Помилка: ' + error.message)
  }

  const csvRows = [
    ['Email', 'Дата підписки'],
    ...data.map(row => [row.email, formatDate(row.created_at)])
  ]

  const csvContent = csvRows
    .map(e => e.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'subscribers.csv')
  link.click()

  function formatDate(isoDate) {
    const date = new Date(isoDate)
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
})
